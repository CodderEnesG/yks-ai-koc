// Seri kuralı (rapor 2.6). Öğrencinin ekranı ve veli raporu (T22) aynı kuralı kullanır.

import { addDays, type CivilDate, diffDays } from './civil-date.ts';

export interface DayTask {
  status: 'planned' | 'done' | 'partial' | 'skipped';
  seconds: number;
}

/** Planlanan görevlerin en az üçte ikisi ya da planlanan dakikanın en az %60'ı yapıldıysa gün tamam. */
export function isDayComplete(tasks: readonly DayTask[]): boolean {
  if (tasks.length === 0) return false;
  const done = tasks.filter((t) => t.status === 'done');
  const plannedSeconds = tasks.reduce((a, t) => a + t.seconds, 0);
  const doneSeconds = done.reduce((a, t) => a + t.seconds, 0);
  return (
    done.length * 3 >= tasks.length * 2 ||
    (plannedSeconds > 0 && doneSeconds * 10 >= plannedSeconds * 6)
  );
}

export interface Streak {
  /** Art arda tamam günler. */
  days: number;
  todayComplete: boolean;
}

/**
 * Bugünden geriye art arda tamam günler. Görevi olmayan günler (dinlenme) seriyi bozmaz; bugünün
 * check-in'i henüz tamam değilse seri dünden sayılır. Rapor bu iki durumu tanımlamıyor (NOT DEFINED).
 */
export function currentStreak(
  days: ReadonlyMap<CivilDate, readonly DayTask[]>,
  today: CivilDate,
): Streak {
  const todayComplete = isDayComplete(days.get(today) ?? []);
  const dates = [...days.keys()]
    .filter((d) => diffDays(d, today) <= 0)
    .sort()
    .reverse();
  let count = 0;
  let cursor = todayComplete ? today : addDays(today, -1);
  for (const date of dates) {
    if (date === today && !todayComplete) continue;
    if (diffDays(date, cursor) > 0) continue;
    const tasks = days.get(date)!;
    if (tasks.length === 0) continue;
    if (!isDayComplete(tasks)) break;
    count++;
    cursor = addDays(date, -1);
  }
  return { days: count, todayComplete };
}
