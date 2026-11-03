import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, ScrollView, Share, View } from 'react-native';

import { Banner } from '@/components/banner';
import { ErrorText } from '@/components/error-text';
import { TextField } from '@/components/fields';
import { ICONS, Icon } from '@/components/icon';
import { SafeAreaView } from '@/components/screen';
import { EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
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

// Veli onayı isteği (T21): velinin e-postası → link → WhatsApp ya da paylaş menüsü → durum. Kilitli
// durum suçlamaz, bilgilendirir (UI-RULES); onay gelince tek dönüm noktası sahnesi.
export default function ConsentScreen() {
  const c = tr.consent;
  const profile = useProfile();
  const request = useConsentRequest();
  const [status, setStatus] = useState<ConsentRequestStatus | null>(null);
  const [checked, setChecked] = useState(false);
  const [checking, setChecking] = useState(false);
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
    setChecking(true);
    try {
      setStatus(await refreshConsentStatus());
      setChecked(true);
    } catch {
      setError(c.failed);
    } finally {
      setChecking(false);
    }
  };

  if (profile.consentStatus === 'granted') {
    return (
      <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
        <ScrollView contentContainerClassName="px-5 pt-3 pb-8">
          <EmptyState
            testID="consent-granted"
            scene="mutlu"
            title={c.grantedTitle}
            text={c.grantedBody}
            action={{
              label: tr.settings.connect,
              onPress: () => router.replace('/account/sign-in'),
              testID: 'consent-connect',
            }}
          />
        </ScrollView>
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
          <Banner kind="info" testID="consent-withdrawn">
            {c.withdrawn}
          </Banner>
        ) : status === 'expired' ? (
          <Banner kind="pending" testID="consent-expired">
            {c.expired}
          </Banner>
        ) : null}
        <TextField
          testID="consent-email"
          label={c.emailLabel}
          icon={<Icon name={ICONS.mail} size={16} />}
          hint={c.emailHint}
          value={email}
          onChangeText={setEmail}
          placeholder={tr.account.emailPlaceholder}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {error ? <ErrorText>{error}</ErrorText> : null}
      </StepScreen>
    );
  }

  const link = consentLink(request.token);
  const message = c.shareMessage(link);
  return (
    <SafeAreaView className="bg-background flex-1" edges={['bottom']}>
      <ScrollView contentContainerClassName="gap-6 px-5 pt-3 pb-8">
        <Text variant="h2">{c.pendingTitle}</Text>
        <Banner kind="pending">{c.pendingBody(request.parentEmail)}</Banner>

        <View className="border-border bg-card gap-1.5 rounded-lg border p-4">
          <Text className="text-footnote font-sans-bold text-muted-foreground">{c.linkLabel}</Text>
          <Text testID="consent-link" selectable className="text-subhead">
            {link}
          </Text>
        </View>

        <View className="gap-3">
          <Button
            testID="consent-whatsapp"
            size="lg"
            onPress={() =>
              void Linking.openURL(`https://wa.me/?text=${encodeURIComponent(message)}`)
            }>
            <Icon name={ICONS.message} size={18} tone="primary-foreground" />
            <Text>{c.whatsapp}</Text>
          </Button>
          <Button variant="outline" onPress={() => void Share.share({ message })}>
            <Icon name={ICONS.share} size={18} />
            <Text>{c.share}</Text>
          </Button>
        </View>

        <View className="gap-2">
          <Button testID="consent-check" variant="outline" disabled={checking} onPress={check}>
            <Icon
              name={ICONS.refresh}
              size={18}
              tone={checking ? 'muted-foreground' : 'foreground'}
            />
            <Text>{c.check}</Text>
          </Button>
          {checked && status === 'pending' ? (
            <View className="flex-row items-center gap-2 px-1">
              <Icon name={ICONS.pending} size={16} tone="muted-foreground" />
              <Text testID="consent-pending" variant="muted">
                {c.stillPending}
              </Text>
            </View>
          ) : null}
          {error ? <ErrorText>{error}</ErrorText> : null}
        </View>

        <Button variant="ghost" className="self-center" onPress={() => setNewRequest(true)}>
          <Text>{c.newLink}</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}
