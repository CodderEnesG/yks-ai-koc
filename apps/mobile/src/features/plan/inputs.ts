// Cihazdaki profil ve kütüphaneyi plan motorunun girdisine çevirir (T13). Saf; vitest ile test edilir.
import {
  type CivilDate,
  type PlanAdjustments,
  type PlanInput,
  type StudySource,
  type StudyUnit,
  videoMinutes,
  type WatchSpeed,
} from '@yks/plan-engine';

import type { CustomEdition, ItemKind } from '@/features/library/rules';

export interface LibrarySourceRow {
  id: string;
  sortOrder: number;
  minutesPerItem: number;
  /** Katalog baskısının birimleri (sayfa aralığı) ya da null. */
  catalogUnits: { id: string; seq: number; pageStart: number; pageEnd: number }[] | null;
  customEdition: CustomEdition | null;
  /** YouTube listesi: videolar liste sırasıyla, izleme hızı ve not payı (T31). */
  playlist?: {
    videos: { videoId: string; durationSeconds: number }[];
    speed: WatchSpeed;
    noteRatio: number;
  } | null;
}

export interface DoneRange {
  unitId: string;
  first: number;
  last: number;
}

/** Plan motorunda birim kimliği: aynı baskı iki kez eklenirse çakışmasın diye kaynakla birleşik. */
export function planUnitId(itemId: string, unitKey: string): string {
  return `${itemId}:${unitKey}`;
}

export function splitPlanUnitId(id: string): { itemId: string; unitKey: string } {
  const i = id.indexOf(':');
  return { itemId: id.slice(0, i), unitKey: id.slice(i + 1) };
}

function unit(
  itemId: string,
  key: string,
  kind: ItemKind,
  first: number,
  last: number,
  perItem: number,
): StudyUnit {
  return { id: planUnitId(itemId, key), kind, first, last, minutes: (last - first + 1) * perItem };
}

export function toStudySource(row: LibrarySourceRow): StudySource {
  if (row.playlist) {
    // Her video tek, bölünmez birim; anahtar video kimliği, aralık 1-1 (sırayı birim sırası verir).
    const { videos, speed, noteRatio } = row.playlist;
    return {
      id: row.id,
      order: row.sortOrder,
      units: videos.map((v) => ({
        id: planUnitId(row.id, v.videoId),
        kind: 'video',
        first: 1,
        last: 1,
        minutes: videoMinutes(v.durationSeconds, speed, noteRatio),
      })),
    };
  }
  const units = row.catalogUnits
    ? row.catalogUnits.map((u) =>
        unit(row.id, u.id, 'pages', u.pageStart, u.pageEnd, row.minutesPerItem),
      )
    : (row.customEdition?.units ?? []).map((u) =>
        unit(row.id, u.key, u.kind, u.first, u.last, row.minutesPerItem),
      );
  return { id: row.id, order: row.sortOrder, units };
}

/**
 * Yapılan aralıklardan birim başına "baştan itibaren tamamlanan" sayısı. Motor ilerlemeyi önek olarak
 * bekler; arada boşluk varsa ilk boşluğa kadar sayılır (atlanan sayfa yeniden planlanır).
 */
export function completedCounts(
  sources: readonly StudySource[],
  done: readonly DoneRange[],
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const u of sources.flatMap((s) => s.units)) {
    const ranges = done.filter((d) => d.unitId === u.id).sort((a, b) => a.first - b.first);
    let next = u.first;
    for (const r of ranges) {
      if (r.first > next) break;
      next = Math.max(next, r.last + 1);
    }
    if (next > u.first) result[u.id] = Math.min(next, u.last + 1) - u.first;
  }
  return result;
}

export function toPlanInput(args: {
  from: CivilDate;
  examDate: CivilDate;
  weekdayMinutes: readonly number[];
  library: readonly LibrarySourceRow[];
  done: readonly DoneRange[];
  adjustments?: PlanAdjustments;
}): PlanInput {
  const sources = args.library.map(toStudySource).filter((s) => s.units.length > 0);
  return {
    from: args.from,
    examDate: args.examDate,
    weekdayMinutes: args.weekdayMinutes,
    sources,
    completed: completedCounts(sources, args.done),
    // Silinen kaynağın birimine ait "konu zor" ayarı motora gitmesin (bilinmeyen birim hatası).
    ...(args.adjustments && {
      adjustments: {
        ...args.adjustments,
        unitFactors: Object.fromEntries(
          Object.entries(args.adjustments.unitFactors ?? {}).filter(([id]) =>
            sources.some((s) => s.units.some((u) => u.id === id)),
          ),
        ),
      },
    }),
  };
}
