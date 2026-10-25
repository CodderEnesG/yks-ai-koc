// Bugünün görevlerini kitap başına tek kartta toplar (T13). Motor görevleri birim birim üretir; aynı
// kitabın ardışık birimleri öğrenciye tek aralık olarak gösterilir. Saf; vitest ile test edilir.

export interface TaskLike {
  id: string;
  libraryItemId: string;
  title: string;
  kind: 'pages' | 'tests' | 'video';
  first: number;
  last: number;
  estSeconds: number;
}

export interface TaskGroup {
  libraryItemId: string;
  title: string;
  kind: 'pages' | 'tests' | 'video';
  /** Ardışık aralıklar birleşmiş hâlde; arada boşluk varsa birden çok aralık. */
  ranges: { first: number; last: number }[];
  unitCount: number;
  estSeconds: number;
  taskIds: string[];
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
      };
      groups.push(g);
    }
    const lastRange = g.ranges.at(-1);
    if (lastRange && lastRange.last + 1 === t.first) lastRange.last = t.last;
    else g.ranges.push({ first: t.first, last: t.last });
    g.unitCount += 1;
    g.estSeconds += t.estSeconds;
    g.taskIds.push(t.id);
  }
  return groups;
}
