'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  AI_CONSENT,
  CONSENT_TEXT_VERSION,
  NOTICE_PARAGRAPHS,
  REPORT_CONSENT,
} from '@/lib/consent-text';
import { supabase } from '@/lib/supabase';

type Status = 'pending' | 'granted' | 'withdrawn' | 'expired';
interface View {
  status: Status;
  parent_email_hint: string;
  report_consent: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const input = 'w-full rounded-lg border border-neutral-300 px-3 py-2 text-base';
const button =
  'w-full rounded-lg bg-neutral-900 px-4 py-3 font-medium text-white disabled:opacity-40';

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

  if (view === undefined) return <p className="mt-4 text-neutral-500">Yükleniyor…</p>;
  if (view === null)
    return (
      <p className="mt-4" data-testid="consent-invalid">
        Bu link geçersiz. Öğrenciden uygulamadan yeni bir link isteyin.
      </p>
    );

  const emailForm = (onSubmit: () => void, submitLabel: string, canSubmit: boolean) => (
    <div className="mt-4 space-y-3">
      <label className="block">
        <span className="text-sm font-medium">E-posta adresiniz ({view.parent_email_hint})</span>
        <input
          className={input}
          type="email"
          autoComplete="email"
          value={email}
          disabled={sent}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      {sent ? (
        <label className="block">
          <span className="text-sm font-medium">E-postanıza gelen 6 haneli kod</span>
          <input
            className={input}
            inputMode="numeric"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
          />
        </label>
      ) : null}
      {sent ? (
        <button
          className={button}
          disabled={busy || code.length !== 6 || !canSubmit}
          onClick={onSubmit}>
          {submitLabel}
        </button>
      ) : (
        <button
          className={button}
          disabled={busy || !EMAIL_RE.test(email.trim()) || !canSubmit}
          onClick={sendCode}>
          Doğrulama kodu gönder
        </button>
      )}
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );

  if (view.status === 'expired')
    return (
      <p className="mt-4" data-testid="consent-expired">
        Bu linkin süresi dolmuş. Öğrenciden uygulamadan yeni bir link isteyin.
      </p>
    );
  if (view.status === 'withdrawn')
    return (
      <p className="mt-4" data-testid="consent-withdrawn">
        Onay geri çekildi. Öğrencinin sunucudaki verisi silindi.
      </p>
    );
  if (view.status === 'granted')
    return (
      <div className="mt-4 space-y-3">
        <p data-testid="consent-granted">
          Onay verildi. Haftalık rapor: {view.report_consent ? 'açık' : 'kapalı'}.
        </p>
        {withdrawing ? (
          emailForm(withdraw, 'Onayı geri çek', true)
        ) : (
          <button className="text-sm underline" onClick={() => setWithdrawing(true)}>
            Onayı geri çekmek istiyorum
          </button>
        )}
      </div>
    );

  return (
    <div className="mt-4 space-y-4">
      <p className="text-neutral-600">
        Çocuğunuz lamba uygulamasını kullanmak için onayınızı istiyor. Lütfen aşağıdaki açıklamayı
        okuyun.
      </p>
      <section className="space-y-2 rounded-lg bg-neutral-100 p-4 text-sm">
        <p className="font-semibold">Aydınlatma metni (taslak)</p>
        {NOTICE_PARAGRAPHS.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>
      <label className="flex gap-3">
        <input
          type="checkbox"
          data-testid="consent-ai"
          aria-label="AI ve yurt dışı aktarım rızası"
          checked={ai}
          onChange={(e) => setAi(e.target.checked)}
        />
        <span>{AI_CONSENT}</span>
      </label>
      <label className="flex gap-3">
        <input
          type="checkbox"
          data-testid="consent-report"
          aria-label="Haftalık rapor rızası"
          checked={report}
          onChange={(e) => setReport(e.target.checked)}
        />
        <span>{REPORT_CONSENT}</span>
      </label>
      <label className="block">
        <span className="text-sm font-medium">Adınız ve soyadınız</span>
        <input
          className={input}
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      {emailForm(grant, 'Onay veriyorum', ai && name.trim().length >= 2)}
    </div>
  );
}
