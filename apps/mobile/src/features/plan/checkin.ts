// Check-in (T14): görevlerin durumu ve nedeni. Yarım kalan görev bölünür: yapılan kısım "done",
// kalanı "skipped" + neden olur ve plan motoru onu sonraki günlere yeniden dağıtır.
import type { CivilDate, Reason, ReasonEvent } from '@yks/plan-engine';
import { and, asc, eq, inArray, isNotNull, isNull } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';
import { randomUUID } from 'expo-crypto';

import { db } from '@/db/client';
import { checkin, planTask } from '@/db/schema';

import { planUnitId } from './inputs';

export const REASONS: readonly Reason[] = [
  'zaman_yetmedi',
  'konu_zor',
  'isteksiz',
  'kotu_hissediyorum',
];

function loadTasks(ids: readonly string[]) {
  return db
    .select()
    .from(planTask)
    .where(and(inArray(planTask.id, [...ids]), isNull(planTask.deletedAt)))
    .orderBy(asc(planTask.rangeFirst))
    .all();
}

/** Grubun tüm görevleri yapıldı ya da hiç yapılamadı. */
export function markTasks(
  ids: readonly string[],
  status: 'done' | 'skipped',
  reason: Reason | null,
  now: Date,
): void {
  const timestamp = now.toISOString();
  db.update(planTask)
    .set({ status, reason: status === 'skipped' ? reason : null, updatedAt: timestamp })
    .where(inArray(planTask.id, [...ids]))
    .run();
}

/**
 * Yarım kaldı: `doneThrough` numaralı sayfa/teste kadar (dahil) yapıldı. Ondan önceki görevler "done",
 * sonrakiler "skipped"; sınırın düştüğü görev ikiye bölünür, süre sayfa oranında paylaşılır.
 */
export function markPartial(
  ids: readonly string[],
  doneThrough: number,
  reason: Reason,
  now: Date,
): void {
  const timestamp = now.toISOString();
  db.transaction((tx) => {
    for (const t of loadTasks(ids)) {
      if (t.rangeLast <= doneThrough) {
        tx.update(planTask)
          .set({ status: 'done', reason: null, updatedAt: timestamp })
          .where(eq(planTask.id, t.id))
          .run();
      } else if (t.rangeFirst > doneThrough) {
        tx.update(planTask)
          .set({ status: 'skipped', reason, updatedAt: timestamp })
          .where(eq(planTask.id, t.id))
          .run();
      } else {
        const count = t.rangeLast - t.rangeFirst + 1;
        const doneSeconds = Math.round((t.estSeconds * (doneThrough - t.rangeFirst + 1)) / count);
        tx.update(planTask)
          .set({
            status: 'done',
            reason: null,
            rangeLast: doneThrough,
            estSeconds: doneSeconds,
            updatedAt: timestamp,
          })
          .where(eq(planTask.id, t.id))
          .run();
        tx.insert(planTask)
          .values({
            ...t,
            id: randomUUID(),
            rangeFirst: doneThrough + 1,
            estSeconds: t.estSeconds - doneSeconds,
            status: 'skipped',
            reason,
            createdAt: timestamp,
            updatedAt: timestamp,
          })
          .run();
      }
    }
  });
}

/** Plan motorunun neden kuralları için geçmiş (rules.ts: deriveAdjustments). */
export function loadReasonEvents(): ReasonEvent[] {
  return db
    .select()
    .from(planTask)
    .where(and(isNull(planTask.deletedAt), isNotNull(planTask.reason)))
    .all()
    .map((t) => ({
      day: t.day as CivilDate,
      reason: t.reason!,
      unitId: planUnitId(t.libraryItemId, t.unitKey),
    }));
}

/** Günün isteğe bağlı doğru/yanlış sayısı. */
export function saveCounts(
  day: CivilDate,
  correct: number | null,
  wrong: number | null,
  now: Date,
): void {
  const timestamp = now.toISOString();
  db.insert(checkin)
    .values({
      id: randomUUID(),
      day,
      correctCount: correct,
      wrongCount: wrong,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .onConflictDoUpdate({
      target: checkin.day,
      set: { correctCount: correct, wrongCount: wrong, updatedAt: timestamp },
    })
    .run();
}

export function useCheckin(day: CivilDate) {
  const { data, updatedAt } = useLiveQuery(db.select().from(checkin).where(eq(checkin.day, day)), [
    day,
  ]);
  return updatedAt === undefined ? undefined : (data[0] ?? null);
}
