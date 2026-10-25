// Kitap ilerlemesi (T23): yapılan sayfa/test sayısı. Aynı aralık iki kez yapıldı sayılsa da bir kez
// sayılır (aralıklar birim içinde birleştirilir). Saf; vitest ile test edilir.

export interface DoneTask {
  libraryItemId: string;
  unitKey: string;
  first: number;
  last: number;
}

export function doneItemsByLibraryItem(tasks: readonly DoneTask[]): Map<string, number> {
  const byUnit = new Map<string, DoneTask[]>();
  for (const t of tasks) {
    const key = `${t.libraryItemId}\u0000${t.unitKey}`;
    byUnit.set(key, [...(byUnit.get(key) ?? []), t]);
  }
  const result = new Map<string, number>();
  for (const ranges of byUnit.values()) {
    const sorted = [...ranges].sort((a, b) => a.first - b.first);
    let count = 0;
    let end = -Infinity;
    for (const r of sorted) {
      const start = Math.max(r.first, end + 1);
      if (r.last >= start) count += r.last - start + 1;
      end = Math.max(end, r.last);
    }
    const item = sorted[0]!.libraryItemId;
    result.set(item, (result.get(item) ?? 0) + count);
  }
  return result;
}

export function percent(done: number, total: number): number {
  return total <= 0 ? 0 : Math.min(100, Math.floor((done * 100) / total));
}
