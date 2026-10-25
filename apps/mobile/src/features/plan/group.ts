// Bugünün görevlerini kitap başına tek kartta toplar (T13). Motor görevleri birim birim üretir; aynı
// kitabın ardışık birimleri öğrenciye tek aralık olarak gösterilir. Saf; vitest ile test edilir.

export interface TaskLike {
  id: string;
  libraryItemId: string;
  /** Birim anahtarı; yarım kalan görev bölününce aynı birim iki görevde olur. */
  unitKey: string;
  title: string;
  kind: 'pages' | 'tests' | 'video';
  first: number;
  last: number;
  estSeconds: number;
  status?: 'planned' | 'done' | 'partial' | 'skipped';
  reason?: string | null;
}

export interface TaskGroup {
  libraryItemId: string;
  title: string;
  kind: 'pages' | 'tests' | 'video';
  /** Ardışık aralıklar birleşmiş hâlde; arada boşluk varsa birden çok aralık. */
  ranges: { first: number; last: number }[];
  /** Farklı birim sayısı. */
  unitCount: number;
  estSeconds: number;
  taskIds: string[];
  /** Tümü planlandı / tümü yapıldı / tümü yapılamadı / karışık (yarım kaldı). */
  status: 'planned' | 'done' | 'skipped' | 'mixed';
  doneRanges: { first: number; last: number }[];
  /** Görevlerde seçilen nedenler, ilk seçilme sırasıyla. */
  reasons: string[];
}

function pushRange(ranges: { first: number; last: number }[], first: number, last: number): void {
  const prev = ranges.at(-1);
  if (prev && prev.last + 1 === first) prev.last = last;
  else ranges.push({ first, last });
}

/** Girdi sırası korunur (kaynak sırası, sonra sayfa). */
export function groupTasks(tasks: readonly TaskLike[]): TaskGroup[] {
  const groups: TaskGroup[] = [];
  for (const t of tasks) {
    let g = groups.find((x) => x.libraryItemId === t.libraryItemId && x.kind === t.kind);
    if (!g) {
      g = {
        libraryItemId: t.libraryItemId,
        title: t.title,
        kind: t.kind,
        ranges: [],
        unitCount: 0,
        estSeconds: 0,
        taskIds: [],
        status: 'planned',
        doneRanges: [],
        reasons: [],
      };
      groups.push(g);
    }
    pushRange(g.ranges, t.first, t.last);
    if (t.status === 'done') pushRange(g.doneRanges, t.first, t.last);
    if (t.reason && !g.reasons.includes(t.reason)) g.reasons.push(t.reason);
    g.estSeconds += t.estSeconds;
    g.taskIds.push(t.id);
  }
  for (const g of groups) {
    g.unitCount = new Set(tasks.filter((t) => g.taskIds.includes(t.id)).map((t) => t.unitKey)).size;
    const statuses = new Set(
      tasks.filter((t) => g.taskIds.includes(t.id)).map((t) => t.status ?? 'planned'),
    );
    g.status =
      statuses.size === 1 && statuses.has('planned')
        ? 'planned'
        : statuses.size === 1 && statuses.has('done')
          ? 'done'
          : statuses.size === 1 && statuses.has('skipped')
            ? 'skipped'
            : 'mixed';
  }
  return groups;
}
