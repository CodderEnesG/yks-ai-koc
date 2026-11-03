'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  AI_CONSENT,
  CONSENT_TEXT_VERSION,
  NOTICE_PARAGRAPHS,
  REPORT_CONSENT,
} from '@/lib/consent-text';
import { supabase } from '@/lib/supabase';
import {
  Card,
  ErrorLine,
  Loading,
  Notice,
  buttonClass,
  inputClass,
  labelClass,
} from '@/components/ui';

type Status = 'pending' | 'granted' | 'withdrawn' | 'expired';
interface View {
  status: Status;
  parent_email_hint: string;
  report_consent: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Rıza satırı: önceden işaretli gelmez; işaretli hali tarayıcının kendi tikiyle (renk değil şekil).
const checkRow =
  'border-border bg-card flex cursor-pointer gap-3 rounded-lg border p-4 has-[:checked]:border-foreground has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-emphasis';
const checkbox = 'accent-foreground mt-0.5 size-5 shrink-0';

function errorMessage(message: string): string {
  if (message.includes('email_mismatch'))
    return 'Bu e-posta adresi, öğrencinin onay isteğinde yazdığı adresle eşleşmiyor.';
  if (message.includes('expired')) return 'Linkin süresi dolmuş. Öğrenciden yeni bir link isteyin.';
  if (message.includes('not_pending')) return 'Bu istek için zaten karar verilmiş.';
  return 'Bir sorun oldu; lütfen tekrar deneyin.';
}

async function fetchView(token: string): Promise<View | null> {
  const { data, error } = await supabase.rpc('consent_request_view', { p_token: token });
  return error ? null : ((data as View[] | null)?.[0] ?? null);
}

// Veli onay sayfası (T21, rapor 2.11 adım 4 ve 6): aydınlatma, ayrı ayrı rıza, ad, e-posta OTP; geri çekme.
export function ConsentForm({ token }: { token: string }) {
  const [view, setView] = useState<View | null | undefined>(undefined);
  const [ai, setAi] = useState(false);
  const [report, setReport] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [withdrawing, setWithdrawing] = useState(false);

  const load = useCallback(() => fetchView(token).then(setView), [token]);

  useEffect(() => {
    let active = true;
    void fetchView(token).then((v) => {
      if (active) setView(v);
    });
    return () => {
      active = false;
    };
  }, [token]);

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(errorMessage(e instanceof Error ? e.message : String(e)));
    } finally {
      setBusy(false);
    }
  };

  const sendCode = () =>
    run(async () => {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { shouldCreateUser: true },
      });
      if (otpError) throw otpError;
      setSent(true);
    });

  // Kod doğrulanır, ardından istenen işlem velinin oturumuyla yapılır.
  const verifyAnd = (action: () => Promise<{ error: { message: string } | null }>) =>
    run(async () => {
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code,
        type: 'email',
      });
      if (verifyError) throw new Error('otp');
      const { error: actionError } = await action();
      // Oturum yalnız bu işlem için; ortak bilgisayarda açık kalmasın.
      await supabase.auth.signOut();
      if (actionError) throw new Error(actionError.message);
      setSent(false);
      setCode('');
      setWithdrawing(false);
      await load();
    });

  const grant = () =>
    verifyAnd(async () =>
      supabase.rpc('grant_consent', {
        p_token: token,
        p_name: name.trim(),
        p_ai: ai,
        p_report: report,
        p_text_version: CONSENT_TEXT_VERSION,
      }),
    );

  const withdraw = () =>
    verifyAnd(async () => supabase.rpc('withdraw_consent', { p_token: token }));

  if (view === undefined) return <Loading />;
  if (view === null)
    return (
      <Notice mark="✕" testId="consent-invalid">
        <p>Bu link geçersiz. Öğrenciden uygulamadan yeni bir link isteyin.</p>
      </Notice>
    );

  const emailForm = (onSubmit: () => void, submitLabel: string, canSubmit: boolean) => (
    <div className="space-y-4">
      <label className="block">
        <span className={labelClass}>E-posta adresiniz ({view.parent_email_hint})</span>
        <input
          className={inputClass}
          type="email"
          autoComplete="email"
          value={email}
          disabled={sent}
          onChange={(e) => setEmail(e.target.value)}
        />
        <span className="text-muted-foreground mt-1.5 block text-[15px]">
          Öğrencinin onay isteğinde yazdığı adres. Bu adrese bir doğrulama kodu göndereceğiz.
        </span>
      </label>
      {sent ? (
        <label className="block">
          <span className={labelClass}>E-postanıza gelen 6 haneli kod</span>
          <input
            className={`${inputClass} font-display text-center text-2xl tracking-[0.5em]`}
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
        </label>
      ) : null}
      {sent ? (
        <button
          className={buttonClass}
          disabled={busy || code.length !== 6 || !canSubmit}
          onClick={onSubmit}>
          {busy ? 'Doğrulanıyor…' : submitLabel}
        </button>
      ) : (
        <button
          className={buttonClass}
          disabled={busy || !EMAIL_RE.test(email.trim()) || !canSubmit}
          onClick={sendCode}>
          {busy ? 'Gönderiliyor…' : 'Doğrulama kodu gönder'}
        </button>
      )}
      {error ? <ErrorLine>{error}</ErrorLine> : null}
    </div>
  );

  if (view.status === 'expired')
    return (
      <Notice mark="↻" testId="consent-expired">
        <p>Bu linkin süresi dolmuş. Öğrenciden uygulamadan yeni bir link isteyin.</p>
      </Notice>
    );
  if (view.status === 'withdrawn')
    return (
      <Notice mark="✓" testId="consent-withdrawn">
        <p>Onay geri çekildi. Öğrencinin sunucudaki verisi silindi.</p>
      </Notice>
    );
  if (view.status === 'granted')
    return (
      <div className="space-y-6">
        <Notice mark="✓">
          <p className="font-display text-xl font-bold" data-testid="consent-granted">
            Onay verildi.
          </p>
          <p>Haftalık rapor: {view.report_consent ? 'açık' : 'kapalı'}.</p>
          <p className="text-muted-foreground text-[15px]">
            Öğrenci uygulamada hesabını bağlayınca sohbet, fotoğrafla kitap ekleme ve yedekleme
            açılır.
          </p>
        </Notice>
        {withdrawing ? (
          <Card className="space-y-4">
            <h2 className="font-display text-xl font-bold">Onayı geri çek</h2>
            <p className="text-muted-foreground text-[15px]">
              Geri çekince öğrencinin sunucudaki hesabı ve verisi silinir. Plan öğrencinin
              telefonunda çalışmaya devam eder.
            </p>
            {emailForm(withdraw, 'Onayı geri çek', true)}
          </Card>
        ) : (
          <button
            className="min-h-11 text-[15px] font-semibold underline underline-offset-4"
            onClick={() => setWithdrawing(true)}>
            Onayı geri çekmek istiyorum
          </button>
        )}
      </div>
    );

  return (
    <div className="space-y-6">
      <p className="text-[19px] leading-[27px]">
        Çocuğunuz lamba uygulamasını kullanmak için onayınızı istiyor. Lütfen aşağıdaki açıklamayı
        okuyun.
      </p>
      <Card className="space-y-3 text-[16px] leading-[24px]">
        <h2 className="font-display text-xl font-bold">Aydınlatma metni (taslak)</h2>
        {NOTICE_PARAGRAPHS.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </Card>

      <fieldset className="space-y-3">
        <legend className="font-display mb-3 text-xl font-bold">Rızalarınız</legend>
        <label className={checkRow}>
          <input
            type="checkbox"
            className={checkbox}
            data-testid="consent-ai"
            aria-label="AI ve yurt dışı aktarım rızası"
            checked={ai}
            onChange={(e) => setAi(e.target.checked)}
          />
          <span>
            <span className="text-muted-foreground mb-1 block text-[13px] font-bold">Zorunlu</span>
            {AI_CONSENT}
          </span>
        </label>
        <label className={checkRow}>
          <input
            type="checkbox"
            className={checkbox}
            data-testid="consent-report"
            aria-label="Haftalık rapor rızası"
            checked={report}
            onChange={(e) => setReport(e.target.checked)}
          />
          <span>
            <span className="text-muted-foreground mb-1 block text-[13px] font-bold">
              İsteğe bağlı
            </span>
            {REPORT_CONSENT}
          </span>
        </label>
      </fieldset>

      <Card className="space-y-4">
        <h2 className="font-display text-xl font-bold">Doğrulama</h2>
        <label className="block">
          <span className={labelClass}>Adınız ve soyadınız</span>
          <input
            className={inputClass}
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        {emailForm(grant, 'Onay veriyorum', ai && name.trim().length >= 2)}
      </Card>
    </div>
  );
}
