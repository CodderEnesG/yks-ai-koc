// Check-in nedenlerinin plana etkisi (rapor 2.6, "Neden kuralları"). Geçmişten saf olarak türetilir;
// ayrı durum tutulmaz, aynı geçmiş her zaman aynı ayarları verir.

import { addDays, type CivilDate, diffDays } from './civil-date.ts';
import type { PlanAdjustments } from './types.ts';

export type Reason = 'zaman_yetmedi' | 'konu_zor' | 'isteksiz' | 'kotu_hissediyorum';

export interface ReasonEvent {
  /** Görevin günü. */
  day: CivilDate;
  reason: Reason;
  /** Görevin birimi (plan motorundaki kimlik); "konu zor" için gerekir. */
  unitId?: string;
}

/** Üç gün üst üste "zaman yetmedi" kapasiteyi %15 düşürür; her yeni üçlü tekrar düşürür. */
export const TIME_SHORT_STREAK = 3;
export const TIME_SHORT_FACTOR = 0.85;
/** Kapasite bu çarpanın altına inmez (rapor sınır koymuyor; plan anlamsızlaşmasın diye). */
export const MIN_CAPACITY_FACTOR = 0.5;
/** "Konu zor" birimin süre tahminini çarpar; tekrar seçmek birikmez. */
export const HARD_TOPIC_FACTOR = 1.3;
/** Güvenli mod: 72 saat, yük %50. Seçildiği günün ertesinden başlayan üç gün. */
export const SAFE_MODE_DAYS = 3;
export const SAFE_MODE_FACTOR = 0.5;

export function deriveAdjustments(events: readonly ReasonEvent[]): PlanAdjustments {
  const daysWith = (reason: Reason) =>
    [...new Set(events.filter((e) => e.reason === reason).map((e) => e.day))].sort();

  // Zaman yetmedi: ardışık takvim günleri sayılır; her tamamlanan üçlü bir düşüş, sayaç sıfırlanır.
  let triggers = 0;
  let streak = 0;
  let previous: CivilDate | undefined;
  for (const day of daysWith('zaman_yetmedi')) {
    streak = previous !== undefined && diffDays(day, previous) === 1 ? streak + 1 : 1;
    if (streak === TIME_SHORT_STREAK) {
      triggers += 1;
      streak = 0;
    }
    previous = day;
  }

  const dayFactors: Record<string, number> = {};
  for (const day of daysWith('kotu_hissediyorum')) {
    for (let i = 1; i <= SAFE_MODE_DAYS; i++) dayFactors[addDays(day, i)] = SAFE_MODE_FACTOR;
  }

  const unitFactors: Record<string, number> = {};
  for (const e of events) {
    if (e.reason === 'konu_zor' && e.unitId) unitFactors[e.unitId] = HARD_TOPIC_FACTOR;
  }

  return {
    capacityFactor: Math.max(MIN_CAPACITY_FACTOR, TIME_SHORT_FACTOR ** triggers),
    dayFactors,
    unitFactors,
    warmupDays: daysWith('isteksiz').map((day) => addDays(day, 1)),
  };
}

/** Güvenli mod bugün açık mı (sert ton kapanır; rapor 2.10 katman 4). */
export function isSafeMode(events: readonly ReasonEvent[], today: CivilDate): boolean {
  return events.some(
    (e) =>
      e.reason === 'kotu_hissediyorum' &&
      diffDays(today, e.day) >= 1 &&
      diffDays(today, e.day) <= SAFE_MODE_DAYS,
  );
}
