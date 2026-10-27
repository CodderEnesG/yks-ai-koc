import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, Share, TextInput, View } from 'react-native';

import { SafeAreaView } from '@/components/screen';
import { Button } from '@/components/ui/button';
import { ErrorText } from '@/components/error-text';
import { Text } from '@/components/ui/text';
import {
  consentLink,
  createConsentRequest,
  refreshConsentStatus,
  useConsentRequest,
  type ConsentRequestStatus,
} from '@/features/consent/consent';
import { StepScreen } from '@/features/onboarding/ui';
import { useProfile } from '@/features/profile/repo';
import { tr } from '@/i18n/tr';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Veli onayı isteği (T21): velinin e-postası → link → WhatsApp ya da paylaş menüsü → durum.
export default function ConsentScreen() {
  const c = tr.consent;
  const profile = useProfile();
  const request = useConsentRequest();
  const [status, setStatus] = useState<ConsentRequestStatus | null>(null);
  const [checked, setChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newRequest, setNewRequest] = useState(false);

  const token = request?.token;
  useEffect(() => {
    if (!token) return;
    void refreshConsentStatus()
      .then(setStatus)
      .catch(() => undefined);
  }, [token]);

  if (!profile || request === undefined) return null;

  const check = async () => {
    setError(null);
    try {
      setStatus(await refreshConsentStatus());
      setChecked(true);
    } catch {
      setError(c.failed);
    }
  };

  if (profile.consentStatus === 'granted') {
    return (
      <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
        <View className="gap-4 p-6">
          <Text testID="consent-granted" variant="h3">
            {c.grantedTitle}
          </Text>
          <Text>{c.grantedBody}</Text>
          <Button testID="consent-connect" onPress={() => router.replace('/account/sign-in')}>
            <Text>{tr.settings.connect}</Text>
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const showForm = !request || newRequest || (status !== null && status !== 'pending');
  if (showForm) {
    const create = async () => {
      setBusy(true);
      setError(null);
      try {
        await createConsentRequest(email);
        setStatus('pending');
        setNewRequest(false);
        setChecked(false);
      } catch {
        setError(c.failed);
      } finally {
        setBusy(false);
      }
    };
    return (
      <StepScreen
        title={c.title}
        subtitle={c.intro}
        continueLabel={c.create}
        canContinue={!busy && EMAIL_RE.test(email.trim())}
        onContinue={create}>
        {profile.consentStatus === 'withdrawn' ? (
          <Text testID="consent-withdrawn">{c.withdrawn}</Text>
        ) : status === 'expired' ? (
          <Text testID="consent-expired">{c.expired}</Text>
        ) : null}
        <View className="gap-2">
          <Text className="font-sans-semibold">{c.emailLabel}</Text>
          <TextInput
            testID="consent-email"
            value={email}
            onChangeText={setEmail}
            placeholder={tr.account.emailPlaceholder}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            className="border-input text-foreground rounded-xl border px-4 py-3 text-lg"
            placeholderTextColorClassName="accent-muted-foreground"
          />
          <Text variant="muted">{c.emailHint}</Text>
        </View>
        {error ? <ErrorText>{error}</ErrorText> : null}
      </StepScreen>
    );
  }

  const link = consentLink(request.token);
  const message = c.shareMessage(link);
  return (
    <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
      <ScrollView contentContainerClassName="gap-4 p-6">
        <Text variant="h3">{c.pendingTitle}</Text>
        <Text>{c.pendingBody(request.parentEmail)}</Text>
        <Text testID="consent-link" selectable variant="muted" className="text-sm">
          {link}
        </Text>
        <Button
          testID="consent-whatsapp"
          onPress={() =>
            void Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`)
          }>
          <Text>{c.whatsapp}</Text>
        </Button>
        <Button variant="outline" onPress={() => void Share.share({ message })}>
          <Text>{c.share}</Text>
        </Button>
        <Button testID="consent-check" variant="outline" onPress={check}>
          <Text>{c.check}</Text>
        </Button>
        {checked && status === 'pending' ? (
          <Text testID="consent-pending" variant="muted">
            {c.stillPending}
          </Text>
        ) : null}
        {error ? <ErrorText>{error}</ErrorText> : null}
        <Button variant="ghost" onPress={() => setNewRequest(true)}>
          <Text>{c.newLink}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
