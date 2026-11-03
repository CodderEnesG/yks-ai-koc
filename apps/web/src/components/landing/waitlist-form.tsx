'use client';

import Image from 'next/image';
import { useState } from 'react';

import { ErrorLine, inputClass, labelClass } from '@/components/ui';
import { SpotlightButton } from '@/components/motion/spotlight-button';
import { waitlist } from '@/content/landing';
import {
  WAITLIST_NOTICE,
  WAITLIST_NOTICE_VERSION,
  WAITLIST_OPEN,
  type WaitlistGrade,
  type WaitlistRole,
} from '@/lib/waitlist';

type RoleChoice = WaitlistRole | 'kucuk';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Seçim kartı: işaretli hali kalın çerçeve (renk değil şekil); odak halkası tarayıcı odaklanınca.
const choice =
  'border-border flex cursor-pointer flex-col rounded-md border-2 px-4 py-3 has-[:checked]:border-foreground has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-emphasis';
const chip =
  'border-control flex min-h-[44px] cursor-pointer items-center rounded-full border px-4 text-[15px] font-semibold has-[:checked]:bg-foreground has-[:checked]:text-background has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-emphasis';

function errorMessage(message: string): string {
  if (message.includes('rate_limited'))
    return 'Kısa sürede çok deneme oldu. Biraz sonra tekrar dene.';
  if (message.includes('invalid_email')) return 'E-posta adresini kontrol et.';
  return 'Bir sorun oldu; lütfen tekrar dene.';
}

/**
 * Bekleme listesi formu (T40). 18 yaş altı öğrenci gönderim yapmaz: veliye WhatsApp ile sayfa linki paylaşır
 * (değişmez kural). Form, aydınlatma metni onaylanana kadar kapalı (`NEXT_PUBLIC_WAITLIST_OPEN`).
 */
export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<RoleChoice | null>(null);
  const [grade, setGrade] = useState<WaitlistGrade | null>(null);
  const [notice, setNotice] = useState(false);
  const [trap, setTrap] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!WAITLIST_OPEN) {
    return (
      <div className="bg-card rounded-[24px] p-6 md:p-8">
        <p className="font-display text-[26px] font-bold">{waitlist.closed}</p>
        <p className="text-muted-foreground mt-2 text-[17px]">{waitlist.closedBody}</p>
      </div>
    );
  }

  if (done) {
    return (
      <div
        role="status"
        className="bg-card flex flex-col items-center rounded-[24px] p-8 text-center">
        <Image
          src="/lamba-parilti.svg"
          alt=""
          width={140}
          height={92}
          className="h-auto w-[140px]"
        />
        <p className="font-display mt-6 text-[30px] font-extrabold">{waitlist.done.title}</p>
        <p className="text-muted-foreground mt-2 text-[17px]">{waitlist.done.body}</p>
      </div>
    );
  }

  const minor = role === 'kucuk';
  const showGrade = role === 'ogrenci_18' || role === 'veli';
  const canSubmit = EMAIL_RE.test(email.trim()) && role !== null && !minor && notice && !busy;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || role === null || minor) return;
    setBusy(true);
    setError(null);
    // Supabase istemcisi yalnız gönderimde yüklenir (ilk yükte yok).
    const { supabase } = await import('@/lib/supabase');
    const { error: rpcError } = await supabase.rpc('join_waitlist', {
      p_email: email.trim(),
      p_role: role,
      p_grade: showGrade ? grade : null,
      p_notice_version: WAITLIST_NOTICE_VERSION,
      p_trap: trap,
    });
    setBusy(false);
    if (rpcError) setError(errorMessage(rpcError.message));
    else setDone(true);
  };

  const site =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (typeof window === 'undefined' ? '' : window.location.origin);
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${waitlist.minor.message} ${site}/#katil`)}`;

  return (
    <form onSubmit={submit} noValidate className="bg-card space-y-7 rounded-[24px] p-6 md:p-8">
      <fieldset>
        <legend className={labelClass}>Kim olarak katılıyorsun?</legend>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {waitlist.roles.map((r) => (
            <label key={`${r.value}`} className={choice}>
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => {
                  setRole(r.value);
                  if (r.value === 'ogretmen') setGrade(null);
                }}
                className="sr-only"
              />
              <span className="text-[16px] font-semibold">{r.label}</span>
              <span className="text-muted-foreground text-[14px]">{r.hint}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {minor ? (
        <div role="status" className="border-foreground rounded-md border-2 p-5">
          <p className="font-display text-[22px] font-bold">{waitlist.minor.title}</p>
          <p className="text-muted-foreground mt-2 text-[16px] leading-snug">
            {waitlist.minor.body}
          </p>
          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary text-primary-foreground focus-visible:outline-emphasis mt-4 inline-flex min-h-[48px] items-center rounded-md px-5 text-[16px] font-semibold focus-visible:outline-3 focus-visible:outline-offset-2">
            {waitlist.minor.share}
          </a>
        </div>
      ) : (
        <>
          {showGrade ? (
            <fieldset>
              <legend className={labelClass}>
                {role === 'veli' ? 'Çocuğunun sınıfı' : 'Sınıfın'}{' '}
                <span className="text-muted-foreground font-normal">(isteğe bağlı)</span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {waitlist.grades.map((g) => (
                  <label key={g.value} className={chip}>
                    <input
                      type="radio"
                      name="grade"
                      value={g.value}
                      checked={grade === g.value}
                      onChange={() => setGrade(g.value)}
                      className="sr-only"
                    />
                    {g.label}
                  </label>
                ))}
              </div>
            </fieldset>
          ) : null}

          <div>
            <label htmlFor="waitlist-email" className={labelClass}>
              E-posta
            </label>
            <input
              id="waitlist-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="ornek@eposta.com"
            />
          </div>

          {/* Bal tuzağı: ekranda ve ekran okuyucuda yok; botlar doldurur. */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label htmlFor="waitlist-website">Web sitesi</label>
            <input
              id="waitlist-website"
              tabIndex={-1}
              autoComplete="off"
              value={trap}
              onChange={(e) => setTrap(e.target.value)}
            />
          </div>

          <div>
            <details className="text-[15px]">
              <summary className="cursor-pointer font-semibold underline underline-offset-4">
                {waitlist.noticeTitle}
              </summary>
              <div className="text-muted-foreground mt-3 space-y-2 leading-snug">
                {WAITLIST_NOTICE.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </details>
            <label className="mt-3 flex cursor-pointer gap-3 text-[16px]">
              <input
                type="checkbox"
                checked={notice}
                onChange={(e) => setNotice(e.target.checked)}
                className="accent-foreground mt-0.5 size-5 shrink-0"
              />
              {waitlist.noticeAccept}
            </label>
          </div>

          <SpotlightButton type="submit" disabled={!canSubmit}>
            {busy ? 'Gönderiliyor…' : waitlist.submit}
          </SpotlightButton>
          {error ? <ErrorLine>{error}</ErrorLine> : null}
        </>
      )}
    </form>
  );
}
