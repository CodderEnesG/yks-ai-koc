// Risk sinyaliyle açılan güvenli mod (T18, rapor 2.10 katman 4). Sinyal günleri cihazda app_meta'da
// durur, senkronlanmaz; plan motoru o gün ve ertesi üç günün yükünü %50 yapar, ton yumuşar. Sunucudaki
// olay kaydı (`safety_event`) ayrı: onu yalnız Edge Function yazar.
import { type CivilDate, diffDays, SAFE_MODE_DAYS } from '@yks/plan-engine';
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';

import { db } from '@/db/client';
import { appMeta } from '@/db/schema';

const KEY = 'safety_days';

const parse = (value: string | undefined): CivilDate[] =>
  value ? (JSON.parse(value) as CivilDate[]) : [];

export function loadSafetyDays(): CivilDate[] {
  const [row] = db.select().from(appMeta).where(eq(appMeta.key, KEY)).all();
  return parse(row?.value);
}

export function useSafetyDays(): CivilDate[] | undefined {
  const { data, updatedAt } = useLiveQuery(db.select().from(appMeta).where(eq(appMeta.key, KEY)));
  return updatedAt === undefined ? undefined : parse(data[0]?.value);
}

/** Bugünden itibaren güvenli mod. Süresi geçmiş sinyal günleri atılır. */
export function startSafeMode(today: CivilDate): void {
  const days = [
    ...new Set([...loadSafetyDays(), today].filter((d) => diffDays(today, d) <= SAFE_MODE_DAYS)),
  ].sort();
  const value = JSON.stringify(days);
  db.insert(appMeta)
    .values({ key: KEY, value })
    .onConflictDoUpdate({ target: appMeta.key, set: { value } })
    .run();
}
