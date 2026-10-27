import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { TextInput, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { ErrorText } from '@/components/error-text';
import { Text } from '@/components/ui/text';
import { Choice, StepScreen } from '@/features/onboarding/ui';
import { claimConsent } from '@/features/consent/consent';
import { useProfile } from '@/features/profile/repo';
import { sendCode, signOut, verifyCode } from '@/features/sync/auth';
import { push, restore } from '@/features/sync/sync';
import { tr } from '@/i18n/tr';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Yeni kod istemeden önce bekleme (Supabase aynı adrese sık kod göndermez). */
const RESEND_SECONDS = 60;

// E-posta + tek kullanımlık kod (T16). `restore=1`: yeni telefonda kurulum yerine geri yükleme.
export default function SignInScreen() {
  const { restore: restoreParam } = useLocalSearchParams<{ restore?: string }>();
  const isRestore = restoreParam === '1';
  const profile = useProfile();
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendIn, setResendIn] = useState(0);
  const a = tr.account;

  useEffect(() => {
    if (resendIn <= 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendIn]);
  const input = 'border-input text-foreground rounded-xl border px-4 py-3 text-lg';

  const run = async (fn: () => Promise<void>, failure: string = a.failed) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch {
      setError(failure);
    } finally {
      setBusy(false);
    }
  };

  const onSend = () =>
    run(async () => {
      await sendCode(email.trim());
      setSent(true);
      setCode('');
      setResendIn(RESEND_SECONDS);
    }, a.sendFailed);
  const trimmed = email.trim();
  const showInvalid = trimmed.length >= 6 && !EMAIL_RE.test(trimmed);

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
      // 18 yaş altı: veli onayı bu hesaba bağlanmadan sunucu veriyi kabul etmez (T21). Velinin hesabıyla
      // ya da başka öğrencinin onayıyla bağlanamaz; o durumda oturum kapatılır.
      if (profile?.consentStatus === 'granted' && !(await claimConsent())) {
        await signOut();
        setSent(false);
        setCode('');
        setError(a.claimFailed);
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
            <Text className="font-sans-semibold">{a.emailLabel}</Text>
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
            {showInvalid ? (
              <Text testID="account-email-invalid" variant="muted" className="text-sm">
                {a.invalidEmail}
              </Text>
            ) : null}
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
          <Text className="font-sans-semibold">{a.codeLabel(email.trim())}</Text>
          <TextInput
            testID="account-code"
            value={code}
            onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            className={`${input} text-center tracking-widest`}
          />
          <View className="flex-row flex-wrap gap-2">
            <Button
              testID="account-resend"
              size="sm"
              variant="ghost"
              disabled={busy || resendIn > 0}
              onPress={() => void onSend()}>
              <Text>{resendIn > 0 ? a.resendIn(resendIn) : a.resend}</Text>
            </Button>
            <Button
              testID="account-change-email"
              size="sm"
              variant="ghost"
              disabled={busy}
              onPress={() => {
                setSent(false);
                setError(null);
              }}>
              <Text>{a.changeEmail}</Text>
            </Button>
          </View>
        </View>
      )}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </StepScreen>
  );
}
