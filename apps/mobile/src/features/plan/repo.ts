import {
  buildPlan,
  type CivilDate,
  deriveAdjustments,
  parseCivilDate,
  type PlanResult,
  type Reason,
  currentStreak,
  type DayTask,
  type Streak,
} from '@yks/plan-engine';
import { and, asc, eq, inArray, isNull } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';
import { randomUUID } from 'expo-crypto';

import { db } from '@/db/client';
import { catalogEdition, libraryItem, planTask, profile } from '@/db/schema';
import { editionTitle } from '@/features/library/rules';
import { loadSafetyDays, useSafetyDays } from '@/features/safety/safe-mode';

import { loadReasonEvents } from './checkin';
import {
  type DoneRange,
  type LibrarySourceRow,
  planUnitId,
  splitPlanUnitId,
  toPlanInput,
} from './inputs';

function loadLibrary(): (LibrarySourceRow & { title: string })[] {
  const rows = db
    .select({ item: libraryItem, edition: catalogEdition })
    .from(libraryItem)
    .leftJoin(catalogEdition, eq(libraryItem.editionId, catalogEdition.id))
    .where(and(isNull(libraryItem.deletedAt), eq(libraryItem.status, 'active')))
    .orderBy(asc(libraryItem.sortOrder))
    .all();
  return rows.map(({ item, edition }) => ({
    id: item.id,
    sortOrder: item.sortOrder,
    minutesPerItem: item.minutesPerItem ?? 1,
    catalogUnits: edition?.units ?? null,
    customEdition: item.customEdition ?? null,
    title: edition ? editionTitle(edition) : (item.customEdition?.title ?? ''),
  }));
}

function loadDone(): DoneRange[] {
  return db
    .select()
    .from(planTask)
    .where(and(isNull(planTask.deletedAt), eq(planTask.status, 'done')))
    .all()
    .map((t) => ({
      unitId: planUnitId(t.libraryItemId, t.unitKey),
      first: t.rangeFirst,
      last: t.rangeLast,
    }));
}

/** Profil ve kütüphaneden bugünden başlayan planı hesaplar; profil yoksa null. Yan etkisiz. */
export function computePlan(today: CivilDate): PlanResult | null {
  const [p] = db.select().from(profile).limit(1).all();
  if (!p) return null;
  return buildPlan(
    toPlanInput({
      from: today,
      examDate: parseCivilDate(p.examDate),
      weekdayMinutes: p.weekdayMinutes,
      library: loadLibrary(),
      done: loadDone(),
      adjustments: deriveAdjustments(loadReasonEvents(), loadSafetyDays()),
    }),
  );
}

/**
 * Bugünün görevlerini plan motoruyla yeniden hesaplayıp cihaza yazar. Bugün için check-in başladıysa
 * (planlanmış dışında durum varsa) bugün dokunulmaz; geçmiş günler hiç değişmez.
 */
export function refreshToday(today: CivilDate, now: Date): void {
  const todays = db
    .select()
    .from(planTask)
    .where(and(eq(planTask.day, today), isNull(planTask.deletedAt)))
    .all();
  if (todays.some((t) => t.status !== 'planned')) return;
  const plan = computePlan(today);
  if (!plan) return;

  const day = plan.days[0]?.date === today ? plan.days[0] : undefined;
  const timestamp = now.toISOString();
  db.transaction((tx) => {
    if (todays.length > 0) {
      tx.update(planTask)
        .set({ deletedAt: timestamp, updatedAt: timestamp })
        .where(
          inArray(
            planTask.id,
            todays.map((t) => t.id),
          ),
        )
        .run();
    }
    for (const task of day?.tasks ?? []) {
      const { itemId, unitKey } = splitPlanUnitId(task.unitId);
      tx.insert(planTask)
        .values({
          id: randomUUID(),
          libraryItemId: itemId,
          day: today,
          kind: task.kind,
          unitKey,
          rangeFirst: task.first,
          rangeLast: task.last,
          estSeconds: task.seconds,
          status: 'planned',
          createdAt: timestamp,
          updatedAt: timestamp,
        })
        .run();
    }
  });
}

export interface TodayTask {
  id: string;
  libraryItemId: string;
  unitKey: string;
  title: string;
  kind: 'pages' | 'tests' | 'video';
  first: number;
  last: number;
  estSeconds: number;
  status: 'planned' | 'done' | 'partial' | 'skipped';
  reason: Reason | null;
}

/** Bugünün görevleri, kaynak sırasıyla; `undefined` yükleniyor. */
export function useTodayTasks(today: CivilDate): TodayTask[] | undefined {
  const { data, updatedAt } = useLiveQuery(
    db
      .select({ task: planTask, item: libraryItem, edition: catalogEdition })
      .from(planTask)
      .innerJoin(libraryItem, eq(planTask.libraryItemId, libraryItem.id))
      .leftJoin(catalogEdition, eq(libraryItem.editionId, catalogEdition.id))
      .where(and(eq(planTask.day, today), isNull(planTask.deletedAt)))
      .orderBy(asc(libraryItem.sortOrder), asc(planTask.rangeFirst)),
    [today],
  );
  if (updatedAt === undefined) return undefined;
  return data.map(({ task, item, edition }) => ({
    id: task.id,
    libraryItemId: task.libraryItemId,
    unitKey: task.unitKey,
    title: edition ? editionTitle(edition) : (item.customEdition?.title ?? ''),
    kind: task.kind,
    first: task.rangeFirst,
    last: task.rangeLast,
    estSeconds: task.estSeconds,
    status: task.status,
    reason: task.reason,
  }));
}

/** Kütüphane, profil ya da güvenli mod değişince bugünün yeniden hesaplanması için imza. */
export function useLibraryVersion(): string | undefined {
  const { data, updatedAt } = useLiveQuery(
    db.select({ id: libraryItem.id, updatedAt: libraryItem.updatedAt }).from(libraryItem),
  );
  const profiles = useLiveQuery(db.select({ updatedAt: profile.updatedAt }).from(profile));
  const safetyDays = useSafetyDays();
  if (updatedAt === undefined || profiles.updatedAt === undefined || safetyDays === undefined)
    return undefined;
  return JSON.stringify([data, profiles.data, safetyDays]);
}

/** Seri (T23): bugüne kadarki görevlerden, seri kuralıyla (plan motoru). */
export function useStreak(today: CivilDate): Streak | undefined {
  const { data, updatedAt } = useLiveQuery(
    db
      .select({ day: planTask.day, status: planTask.status, seconds: planTask.estSeconds })
      .from(planTask)
      .where(isNull(planTask.deletedAt)),
    [today],
  );
  if (updatedAt === undefined) return undefined;
  const days = new Map<CivilDate, DayTask[]>();
  for (const t of data) {
    const day = t.day as CivilDate;
    days.set(day, [...(days.get(day) ?? []), { status: t.status, seconds: t.seconds }]);
  }
  return currentStreak(days, today);
}
