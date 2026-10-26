import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';

import { Text } from '@/components/ui/text';
import { Choice, StepScreen } from '@/features/onboarding/ui';
import { sendCode, verifyCode } from '@/features/sync/auth';
import { push, restore } from '@/features/sync/sync';
import { tr } from '@/i18n/tr';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// E-posta + tek kullanımlık kod (T16). `restore=1`: yeni telefonda kurulum yerine geri yükleme.
export default function SignInScreen() {
  const { restore: restoreParam } = useLocalSearchParams<{ restore?: string }>();
  const isRestore = restoreParam === '1';
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const a = tr.account;
  const input = 'border-input text-foreground rounded-xl border px-4 py-3 text-lg';

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch {
      setError(a.failed);
    } finally {
      setBusy(false);
    }
  };

  const onSend = () =>
    run(async () => {
      await sendCode(email.trim());
      setSent(true);
    });

  const onVerify = () =>
    run(async () => {
      await verifyCode(email.trim(), code);
      if (isRestore) {
        const restored = await restore();
        if (restored) router.replace('/');
        else {
          setError(a.noBackup);
          router.replace('/onboarding/birth');
        }
        return;
      }
      // Giriş tamam; ilk gönderim hata verirse otomatik senkron sonra yeniden dener.
      await push().catch(() => undefined);
      router.back();
    });

  return (
    <StepScreen
      title={isRestore ? a.restoreTitle : a.title}
      continueLabel={sent ? a.verify : a.sendCode}
      canContinue={!busy && (sent ? /^\d{6}$/.test(code) : EMAIL_RE.test(email.trim()) && consent)}
      onContinue={sent ? onVerify : onSend}>
      {!sent ? (
        <>
          <View className="gap-2">
            <Text className="font-medium">{a.emailLabel}</Text>
            <TextInput
              testID="account-email"
              value={email}
              onChangeText={setEmail}
              placeholder={a.emailPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              className={input}
              placeholderTextColorClassName="accent-muted-foreground"
            />
          </View>
          <Choice
            testID="account-consent"
            label={a.consent}
            description={a.consentDraft}
            selected={consent}
            onPress={() => setConsent(!consent)}
          />
        </>
      ) : (
        <View className="gap-2">
          <Text className="font-medium">{a.codeLabel(email.trim())}</Text>
          <TextInput
            testID="account-code"
            value={code}
            onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            className={`${input} text-center tracking-widest`}
          />
        </View>
      )}
      {error ? <Text className="text-destructive text-sm">{error}</Text> : null}
    </StepScreen>
  );
}
