import {
  buildPlan,
  type CivilDate,
  deriveAdjustments,
  parseCivilDate,
  type PlanResult,
  type Reason,
  currentStreak,
  type DayTask,
  DEFAULT_NOTE_RATIO,
  type Streak,
  WATCH_SPEEDS,
  type WatchSpeed,
} from '@yks/plan-engine';
import { and, asc, eq, inArray, isNull } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';
import { randomUUID } from 'expo-crypto';

import { db } from '@/db/client';
import { catalogEdition, libraryItem, planTask, profile, ytPlaylist } from '@/db/schema';
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

function watchSpeed(value: number | null): WatchSpeed {
  return WATCH_SPEEDS.find((s) => s === value) ?? 1;
}

function loadLibrary(): (LibrarySourceRow & { title: string })[] {
  const rows = db
    .select({ item: libraryItem, edition: catalogEdition, playlist: ytPlaylist })
    .from(libraryItem)
    .leftJoin(catalogEdition, eq(libraryItem.editionId, catalogEdition.id))
    .leftJoin(ytPlaylist, eq(libraryItem.ytPlaylistId, ytPlaylist.id))
    .where(and(isNull(libraryItem.deletedAt), eq(libraryItem.status, 'active')))
    .orderBy(asc(libraryItem.sortOrder))
    .all();
  return rows.map(({ item, edition, playlist }) => ({
    id: item.id,
    sortOrder: item.sortOrder,
    minutesPerItem: item.minutesPerItem ?? 1,
    catalogUnits: edition?.units ?? null,
    customEdition: item.customEdition ?? null,
    // Önbelleği silinmiş liste (30 gün) yenilenene kadar plana girmez.
    playlist: playlist
      ? {
          videos: playlist.videos,
          speed: watchSpeed(item.watchSpeed),
          noteRatio: item.noteRatio ?? DEFAULT_NOTE_RATIO,
        }
      : null,
    title: edition ? editionTitle(edition) : (playlist?.title ?? item.customEdition?.title ?? ''),
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
  /** Video görevi (T33): videonun kendi başlığı, kanalı ve süresi; önbellek yoksa yok. */
  video?: { id: string; title: string; channelTitle: string; durationSeconds: number };
}

/** Bugünün görevleri, kaynak sırasıyla; `undefined` yükleniyor. */
export function useTodayTasks(today: CivilDate): TodayTask[] | undefined {
  const { data, updatedAt } = useLiveQuery(
    db
      .select({ task: planTask, item: libraryItem, edition: catalogEdition, playlist: ytPlaylist })
      .from(planTask)
      .innerJoin(libraryItem, eq(planTask.libraryItemId, libraryItem.id))
      .leftJoin(catalogEdition, eq(libraryItem.editionId, catalogEdition.id))
      .leftJoin(ytPlaylist, eq(libraryItem.ytPlaylistId, ytPlaylist.id))
      .where(and(eq(planTask.day, today), isNull(planTask.deletedAt)))
      .orderBy(asc(libraryItem.sortOrder), asc(planTask.rangeFirst)),
    [today],
  );
  if (updatedAt === undefined) return undefined;
  const tasks = data.map(({ task, item, edition, playlist }): TodayTask & { order: number } => {
    const index = playlist?.videos.findIndex((v) => v.videoId === task.unitKey) ?? -1;
    const video = index >= 0 ? playlist!.videos[index]! : null;
    return {
      id: task.id,
      libraryItemId: task.libraryItemId,
      unitKey: task.unitKey,
      title: edition ? editionTitle(edition) : (playlist?.title ?? item.customEdition?.title ?? ''),
      kind: task.kind,
      first: task.rangeFirst,
      last: task.rangeLast,
      estSeconds: task.estSeconds,
      status: task.status,
      reason: task.reason,
      ...(video && {
        video: {
          id: video.videoId,
          title: video.title,
          channelTitle: video.channelTitle,
          durationSeconds: video.durationSeconds,
        },
      }),
      // Videoların aralığı 1-1; sırayı listedeki yerleri verir.
      order: task.kind === 'video' ? index : task.rangeFirst,
    };
  });
  // Sorgu kaynak sırasıyla geliyor; kaynak içinde sayfa ya da liste sırası (sıralama kararlı).
  return tasks
    .map((t, i) => ({ t, i }))
    .sort((a, b) => (a.t.libraryItemId === b.t.libraryItemId ? a.t.order - b.t.order : a.i - b.i))
    .map(({ t: { order: _order, ...task } }) => task);
}

/** Kütüphane, profil ya da güvenli mod değişince bugünün yeniden hesaplanması için imza. */
export function useLibraryVersion(): string | undefined {
  const { data, updatedAt } = useLiveQuery(
    db.select({ id: libraryItem.id, updatedAt: libraryItem.updatedAt }).from(libraryItem),
  );
  const profiles = useLiveQuery(db.select({ updatedAt: profile.updatedAt }).from(profile));
  // Liste önbelleği yenilenince ya da 30. günde silinince plan yeniden hesaplanır (T34).
  const playlists = useLiveQuery(
    db.select({ id: ytPlaylist.id, fetchedAt: ytPlaylist.fetchedAt }).from(ytPlaylist),
  );
  const safetyDays = useSafetyDays();
  if (
    updatedAt === undefined ||
    profiles.updatedAt === undefined ||
    playlists.updatedAt === undefined ||
    safetyDays === undefined
  )
    return undefined;
  return JSON.stringify([data, profiles.data, playlists.data, safetyDays]);
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
