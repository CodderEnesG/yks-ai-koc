import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ErrorText } from '@/components/error-text';
import { CheckRow, TextField } from '@/components/fields';
import { ICONS, Icon } from '@/components/icon';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { StepScreen } from '@/features/onboarding/ui';
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
      subtitle={sent ? a.codeSubtitle : isRestore ? a.restoreSubtitle : a.subtitle}
      continueLabel={sent ? a.verify : a.sendCode}
      canContinue={!busy && (sent ? /^\d{6}$/.test(code) : EMAIL_RE.test(email.trim()) && consent)}
      onContinue={sent ? onVerify : onSend}>
      {!sent ? (
        <>
          <TextField
            testID="account-email"
            label={a.emailLabel}
            icon={<Icon name={ICONS.mail} size={16} />}
            value={email}
            onChangeText={setEmail}
            placeholder={a.emailPlaceholder}
            keyboardType="email-address"
            textContentType="emailAddress"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect={false}
            error={showInvalid ? a.invalidEmail : undefined}
          />
          <CheckRow
            testID="account-consent"
            label={a.consent}
            description={a.consentDraft}
            checked={consent}
            onPress={() => setConsent(!consent)}
          />
        </>
      ) : (
        <View className="gap-3">
          <TextField
            testID="account-code"
            label={a.codeLabel(email.trim())}
            value={code}
            onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
            numeric
            center
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            placeholder="••••••"
            style={{ letterSpacing: 12 }}
          />
          <View className="flex-row flex-wrap gap-2">
            <Button
              testID="account-resend"
              size="sm"
              variant="ghost"
              disabled={busy || resendIn > 0}
              onPress={() => void onSend()}>
              <Icon
                name={ICONS.refresh}
                size={16}
                tone={busy || resendIn > 0 ? 'muted-foreground' : 'foreground'}
              />
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
              <Icon name={ICONS.edit} size={16} tone={busy ? 'muted-foreground' : 'foreground'} />
              <Text>{a.changeEmail}</Text>
            </Button>
          </View>
        </View>
      )}
      {error ? <ErrorText>{error}</ErrorText> : null}
    </StepScreen>
  );
}
