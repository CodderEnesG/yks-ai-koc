import { CHAT_MAX_LENGTH } from '@yks/ai/limits';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, FlatList, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  type ChatMessage,
  reportChatMessage,
  retryChatMessage,
  sendChatMessage,
  useChatMessages,
} from '@/features/chat/chat';
import { checkChatText } from '@/features/chat/rules';
import { useProfile } from '@/features/profile/repo';
import { useSession } from '@/features/sync/auth';
import { canSync } from '@/features/sync/mapping';
import { tr } from '@/i18n/tr';
import { useToday } from '@/lib/use-today';

// Koç sohbeti (T20). Yalnız metin (değişmez kural: görsel ve ek yok). Hesap ve onay gerekir; sohbet
// sunucuda güvenlik taramasından geçer (T17).
export default function CoachScreen() {
  const c = tr.chat;
  const profile = useProfile();
  const session = useSession();
  const messages = useChatMessages();
  const today = useToday();
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const list = useRef<FlatList<ChatMessage>>(null);
  if (!profile || session === undefined || !messages) return null;

  if (!canSync(profile.consentStatus) || !session) {
    const consent = !canSync(profile.consentStatus);
    return (
      <SafeAreaView className="bg-background flex-1">
        <View className="gap-4 p-6">
          <Text variant="h3">{c.title}</Text>
          <Text testID="coach-locked">{consent ? c.needConsent : c.needAccount}</Text>
          <Button
            testID={consent ? 'coach-consent' : 'coach-connect'}
            onPress={() => router.push(consent ? '/account/consent' : '/account/sign-in')}>
            <Text>{consent ? tr.consent.open : tr.settings.connect}</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const checked = checkChatText(draft);
  const run = async (send: () => ReturnType<typeof sendChatMessage>) => {
    setBusy(true);
    setError(null);
    const result = await send();
    setBusy(false);
    if ('error' in result) setError(c.errors[result.error]);
    else if (result.action === 'fixed') router.push('/support');
  };
  const send = () => {
    if (!('text' in checked)) return;
    setDraft('');
    void run(() => sendChatMessage(checked.text, today));
  };

  return (
    <SafeAreaView className="bg-background flex-1" edges={['top']}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <FlatList
          ref={list}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerClassName="gap-3 p-4"
          onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={
            <View className="gap-2 pb-2">
              <Text variant="h3">{c.title}</Text>
              <Text variant="muted">{c.intro}</Text>
            </View>
          }
          renderItem={({ item }) => (
            <Bubble message={item} onRetry={() => void run(() => retryChatMessage(item, today))} />
          )}
          // Yanıt güvenlik taraması ve üretimle birkaç saniye sürer (akışsız; T17).
          ListFooterComponent={
            busy ? (
              <View
                testID="coach-thinking"
                className="bg-muted mt-3 flex-row items-center gap-2 self-start rounded-2xl rounded-bl-sm px-4 py-3">
                <ActivityIndicator size="small" />
                <Text variant="muted">{c.thinking}</Text>
              </View>
            ) : undefined
          }
        />
        {error ? (
          <Text testID="coach-error" className="text-destructive px-4 text-sm">
            {error}
          </Text>
        ) : null}
        {'issue' in checked && checked.issue === 'too_long' ? (
          <Text className="text-destructive px-4 text-sm">{c.tooLong(CHAT_MAX_LENGTH)}</Text>
        ) : null}
        <View className="border-border flex-row items-end gap-2 border-t p-3">
          <TextInput
            testID="coach-input"
            value={draft}
            onChangeText={setDraft}
            placeholder={c.placeholder}
            multiline
            maxLength={CHAT_MAX_LENGTH + 100}
            className="border-input text-foreground max-h-32 flex-1 rounded-xl border px-3 py-2 text-base"
            placeholderTextColorClassName="accent-muted-foreground"
          />
          <Button testID="coach-send" disabled={busy || !('text' in checked)} onPress={send}>
            <Text>{busy ? c.sending : c.send}</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Bubble({ message, onRetry }: { message: ChatMessage; onRetry: () => void }) {
  const c = tr.chat;
  const [reported, setReported] = useState(message.reportedAt !== null);
  if (message.role === 'user') {
    return (
      <View className="max-w-[85%] gap-1 self-end">
        <View
          className={`bg-primary rounded-2xl rounded-br-sm px-4 py-2 ${
            message.status === 'sending' ? 'opacity-60' : ''
          }`}>
          <Text className="text-primary-foreground">{message.content}</Text>
        </View>
        {message.status === 'sending' ? (
          <Text variant="muted" className="self-end text-xs">
            {c.sending}
          </Text>
        ) : null}
        {message.status === 'failed' ? (
          <Button testID="coach-retry" size="sm" variant="ghost" onPress={onRetry}>
            <Text className="text-destructive text-xs">{`${c.failed} · ${c.retry}`}</Text>
          </Button>
        ) : null}
      </View>
    );
  }
  return (
    <View testID={`coach-reply-${message.action}`} className="max-w-[85%] gap-1 self-start">
      <View className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2">
        <Text>{message.content}</Text>
      </View>
      {message.action === 'fixed' ? (
        <Button testID="coach-support" size="sm" onPress={() => router.push('/support')}>
          <Text>{c.support}</Text>
        </Button>
      ) : null}
      {reported ? (
        <Text variant="muted" className="text-xs">
          {c.reported}
        </Text>
      ) : (
        <Button
          testID="coach-report"
          size="sm"
          variant="ghost"
          className="self-start"
          onPress={() => void reportChatMessage(message.id).then(setReported)}>
          <Text className="text-xs">{c.report}</Text>
        </Button>
      )}
    </View>
  );
}
