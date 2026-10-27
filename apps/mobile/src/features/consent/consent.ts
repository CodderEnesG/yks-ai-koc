// Veli onayı, öğrenci tarafı (T21, rapor 2.11). Onaydan önce hesap yok: telefon rastgele bir kod üretir,
// sunucuya yalnız kodu ve veli e-postasını verir (create_consent_request). Kod linkte velinin web sayfasına
// gider; durum aynı kodla sorulur. Onay gelince öğrenci hesap bağlar ve isteği hesabına bağlar (claim).
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';
import { getRandomBytes } from 'expo-crypto';

import { db } from '@/db/client';
import { appMeta, profile } from '@/db/schema';
import { startAnalytics, stopAnalytics, track } from '@/features/analytics/analytics';
import { supabase } from '@/lib/supabase';

const TOKEN_KEY = 'consent_token';
const EMAIL_KEY = 'consent_parent_email';
const REPORT_KEY = 'consent_report';

export type ConsentRequestStatus = 'pending' | 'granted' | 'withdrawn' | 'expired' | 'invalid';

function readMeta(key: string): string | null {
  const [row] = db.select().from(appMeta).where(eq(appMeta.key, key)).all();
  return row?.value ?? null;
}

function writeMeta(key: string, value: string): void {
  db.insert(appMeta)
    .values({ key, value })
    .onConflictDoUpdate({ target: appMeta.key, set: { value } })
    .run();
}

function base64Url(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Veli sayfalarının (apps/web) adresi. */
export function webLink(path: string): string {
  const base = process.env.EXPO_PUBLIC_WEB_URL;
  if (!base) throw new Error('EXPO_PUBLIC_WEB_URL apps/mobile/.env içinde olmalı');
  return `${base.replace(/\/$/, '')}${path}`;
}

export function consentLink(token: string): string {
  return webLink(`/onay/${token}`);
}

/** Açık istek: kod ve velinin e-postası (yalnız ekranda göstermek için). */
export function useConsentRequest(): { token: string; parentEmail: string } | null | undefined {
  const { data, updatedAt } = useLiveQuery(db.select().from(appMeta));
  if (updatedAt === undefined) return undefined;
  const token = data.find((r) => r.key === TOKEN_KEY)?.value;
  const parentEmail = data.find((r) => r.key === EMAIL_KEY)?.value;
  return token && parentEmail ? { token, parentEmail } : null;
}

/** Velinin haftalık rapora rıza verip vermediği (son durum sorgusundan). */
export function useReportConsent(): boolean {
  const { data } = useLiveQuery(db.select().from(appMeta).where(eq(appMeta.key, REPORT_KEY)));
  return data[0]?.value === '1';
}

/** Yeni istek açar (öncekinin yerine geçer). 32 rastgele bayt → 43 karakterlik kod. */
export async function createConsentRequest(parentEmail: string): Promise<string> {
  const token = base64Url(getRandomBytes(32));
  const email = parentEmail.trim().toLowerCase();
  const { error } = await supabase.rpc('create_consent_request', {
    p_token: token,
    p_parent_email: email,
  });
  if (error) throw error;
  writeMeta(TOKEN_KEY, token);
  writeMeta(EMAIL_KEY, email);
  return token;
}

function setLocalConsent(status: 'granted' | 'withdrawn'): void {
  db.update(profile).set({ consentStatus: status, updatedAt: new Date().toISOString() }).run();
}

/**
 * Sunucudaki durumu sorar ve profile işler: onay gelince `granted` (senkron ve hesap bağlama açılır),
 * geri çekilince `withdrawn` (sunucu hesabı silindi; cihazdaki oturum kapatılır, veri telefonda kalır).
 */
export async function refreshConsentStatus(): Promise<ConsentRequestStatus | null> {
  const token = readMeta(TOKEN_KEY);
  if (!token) return null;
  const { data, error } = await supabase.rpc('consent_request_status', { p_token: token });
  if (error) throw error;
  const row = (
    data as { status: Exclude<ConsentRequestStatus, 'invalid'>; report_consent: boolean }[] | null
  )?.[0];
  const status: ConsentRequestStatus = row?.status ?? 'invalid';
  writeMeta(REPORT_KEY, status === 'granted' && row?.report_consent ? '1' : '0');
  const [p] = db.select().from(profile).limit(1).all();
  if (p && status === 'granted' && p.consentStatus !== 'granted') {
    setLocalConsent('granted');
    startAnalytics();
    track('veli_onayladi');
  }
  if (p && status === 'withdrawn' && p.consentStatus !== 'withdrawn') {
    setLocalConsent('withdrawn');
    await stopAnalytics();
    await supabase.auth.signOut({ scope: 'local' });
  }
  return status;
}

/** Girişten sonra: onaylı isteği bu hesaba bağlar. Sunucu ancak bundan sonra öğrencinin verisini kabul eder. */
export async function claimConsent(): Promise<boolean> {
  const token = readMeta(TOKEN_KEY);
  if (!token) return false;
  const { data, error } = await supabase.rpc('claim_consent', { p_token: token });
  if (error) throw error;
  return data === true;
}
