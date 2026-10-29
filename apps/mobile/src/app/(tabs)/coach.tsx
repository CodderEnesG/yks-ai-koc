import { CHAT_MAX_LENGTH } from '@yks/ai/limits';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import { FlatList, Pressable, TextInput, View } from 'react-native';
import { KeyboardAvoidingView } from 'react-native-keyboard-controller';

import { ICONS, Icon } from '@/components/icon';
import { SafeAreaView } from '@/components/screen';
import { LockedState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { ErrorText } from '@/components/error-text';
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
import { cn } from '@/lib/utils';
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
      <SafeAreaView className="bg-background flex-1" edges={['top']}>
        <View className="gap-5 px-5 pt-3">
          <Text variant="h1">{c.title}</Text>
          <LockedState
            testID="coach-locked"
            text={consent ? c.needConsent : c.needAccount}
            primary
            action={{
              label: consent ? tr.consent.open : tr.settings.connect,
              onPress: () => router.push(consent ? '/account/consent' : '/account/sign-in'),
              testID: consent ? 'coach-consent' : 'coach-connect',
            }}
          />
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
    // Alt kenar da: iOS native sekmelerde giriş çubuğu düz View, sekme çubuğunun altında kalıyordu (yalnız
    // kaydırma görünümü otomatik iç boşluk alır).
    <SafeAreaView className="bg-background flex-1" edges={['top', 'bottom']}>
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <FlatList
          ref={list}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerClassName="gap-3 px-4 pt-3 pb-4"
          onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
          ListHeaderComponent={
            <View className="gap-2 pb-2">
              <Text variant="h1">{c.title}</Text>
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
                accessibilityRole="progressbar"
                accessibilityLabel={c.thinking}
                className="border-border bg-card mt-3 self-start rounded-lg rounded-bl-xs border px-4 py-2.5">
                <Text variant="muted">{c.thinking}</Text>
              </View>
            ) : undefined
          }
        />
        {error ? (
          <ErrorText testID="coach-error" className="px-4">
            {error}
          </ErrorText>
        ) : null}
        {'issue' in checked && checked.issue === 'too_long' ? (
          <ErrorText className="px-4">{c.tooLong(CHAT_MAX_LENGTH)}</ErrorText>
        ) : null}
        {/* Yalnız metin: ek, fotoğraf ya da ses düğmesi yok (değişmez kural). */}
        <View className="border-border bg-background flex-row items-end gap-2 border-t px-4 pt-2.5 pb-2">
          <TextInput
            testID="coach-input"
            accessibilityLabel={c.placeholder}
            value={draft}
            onChangeText={setDraft}
            placeholder={c.placeholder}
            multiline
            maxLength={CHAT_MAX_LENGTH + 100}
            className={cn(
              'bg-card text-foreground font-sans text-body min-h-touch max-h-32 flex-1 rounded-md px-3.5 py-2.5',
              'issue' in checked && checked.issue === 'too_long'
                ? 'border-foreground border-2'
                : 'border-control border',
            )}
            placeholderTextColorClassName="accent-muted-foreground"
          />
          <Button
            testID="coach-send"
            variant="tonal"
            size="sm"
            disabled={busy || !('text' in checked)}
            onPress={send}>
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
    // Öğrenci balonu: sağda, ön plan dolgusu; turuncu kullanmaz.
    return (
      <View className="max-w-[85%] items-end gap-1 self-end">
        <View
          className={cn(
            'bg-foreground rounded-lg rounded-br-xs px-4 py-2.5',
            message.status === 'sending' && 'opacity-60',
          )}>
          <Text className="text-background">{message.content}</Text>
        </View>
        {message.status === 'sending' ? <Text variant="muted">{c.sending}</Text> : null}
        {message.status === 'failed' ? (
          <Pressable
            testID="coach-retry"
            accessibilityRole="button"
            onPress={onRetry}
            className="min-h-touch justify-center px-1">
            <ErrorText>{`${c.failed} · ${c.retry}`}</ErrorText>
          </Pressable>
        ) : null}
      </View>
    );
  }
  // Akut risk: koç yanıt üretmedi; içerik güvenlik katmanının sabit metni (packages/safety, sunucu).
  if (message.action === 'fixed') {
    return (
      <View
        testID="coach-reply-fixed"
        className="border-control bg-card items-start gap-3 rounded-lg border-2 p-4">
        <View className="flex-row items-center gap-2">
          <Icon name={ICONS.support} size={20} />
          <Text className="text-subhead font-sans-bold">{tr.support.title}</Text>
        </View>
        <Text>{message.content}</Text>
        <Button testID="coach-support" size="sm" onPress={() => router.push('/support')}>
          <Icon name={ICONS.support} size={16} tone="primary-foreground" />
          <Text>{c.support}</Text>
        </Button>
      </View>
    );
  }
  return (
    <View testID={`coach-reply-${message.action}`} className="max-w-[85%] items-start self-start">
      <View className="border-border bg-card rounded-lg rounded-bl-xs border px-4 py-2.5">
        <Text>{message.content}</Text>
      </View>
      {reported ? (
        <Text variant="muted" className="text-footnote min-h-touch px-1 py-3">
          {c.reported}
        </Text>
      ) : (
        <Pressable
          testID="coach-report"
          accessibilityRole="button"
          onPress={() => void reportChatMessage(message.id).then(setReported)}
          className="min-h-touch flex-row items-center gap-1.5 px-1">
          <Icon name={ICONS.flag} size={13} tone="muted-foreground" />
          <Text className="text-footnote text-muted-foreground font-sans-semibold">{c.report}</Text>
        </Pressable>
      )}
    </View>
  );
}
