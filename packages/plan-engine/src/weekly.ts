// Haftalık veli raporunun sayıları (T22, rapor 2.12). Sayıları kural hesaplar; seri ve kitap ilerlemesi
// öğrencinin ekranındakiyle aynı fonksiyonlardan gelir. Saf: aynı girdi, aynı çıktı.

import { addDays, type CivilDate, diffDays, weekdayIndex } from './civil-date.ts';
import { doneItemsByLibraryItem, percent } from './progress.ts';
import { currentStreak, type DayTask, isDayComplete } from './streak.ts';
import type { UnitKind } from './types.ts';

export interface ReportTask extends DayTask {
  day: CivilDate;
  libraryItemId: string;
  unitKey: string;
  /** Video görevinde aralık yok. */
  first: number | null;
  last: number | null;
}

export interface ReportBook {
  id: string;
  title: string;
  kind: UnitKind;
  /** Toplam sayfa ya da test. */
  total: number;
}

export interface WeeklySummary {
  /** Haftanın Pazartesi'si. */
  weekStart: CivilDate;
  /** Raporun son günü (bugün; Pazar akşamı tam hafta). */
  through: CivilDate;
  days: { date: CivilDate; planned: boolean; complete: boolean }[];
  plannedDays: number;
  completeDays: number;
  plannedMinutes: number;
  doneMinutes: number;
  streak: number;
  /** Bu hafta görevi olan kitaplar, kütüphane sırasıyla. */
  books: { id: string; title: string; kind: UnitKind; doneThisWeek: number; percent: number }[];
}

export function weekStartOf(date: CivilDate): CivilDate {
  return addDays(date, -weekdayIndex(date));
}

function doneRanges(tasks: readonly ReportTask[]) {
  return tasks.flatMap((t) =>
    t.status === 'done' && t.first !== null && t.last !== null
      ? [{ libraryItemId: t.libraryItemId, unitKey: t.unitKey, first: t.first, last: t.last }]
      : [],
  );
}

/** `tasks` öğrencinin bugüne kadarki görevleri (seri için geçmiş de gerekir); gelecek günler yok sayılır. */
export function weeklySummary(args: {
  today: CivilDate;
  tasks: readonly ReportTask[];
  books: readonly ReportBook[];
}): WeeklySummary {
  const { today, books } = args;
  const tasks = args.tasks.filter((t) => diffDays(t.day, today) <= 0);
  const weekStart = weekStartOf(today);
  const inWeek = tasks.filter((t) => diffDays(t.day, weekStart) >= 0);

  const byDay = new Map<CivilDate, ReportTask[]>();
  for (const t of tasks) byDay.set(t.day, [...(byDay.get(t.day) ?? []), t]);

  const days = [];
  for (let d = weekStart; diffDays(d, today) <= 0; d = addDays(d, 1)) {
    const dayTasks = byDay.get(d) ?? [];
    days.push({ date: d, planned: dayTasks.length > 0, complete: isDayComplete(dayTasks) });
  }

  const sumMinutes = (list: readonly ReportTask[]) =>
    Math.round(list.reduce((a, t) => a + t.seconds, 0) / 60);
  const doneTotal = doneItemsByLibraryItem(doneRanges(tasks));
  const doneWeek = doneItemsByLibraryItem(doneRanges(inWeek));
  const activeIds = new Set(inWeek.map((t) => t.libraryItemId));

  return {
    weekStart,
    through: today,
    days,
    plannedDays: days.filter((d) => d.planned).length,
    completeDays: days.filter((d) => d.complete).length,
    plannedMinutes: sumMinutes(inWeek),
    doneMinutes: sumMinutes(inWeek.filter((t) => t.status === 'done')),
    streak: currentStreak(byDay, today).days,
    books: books
      .filter((b) => activeIds.has(b.id))
      .map((b) => ({
        id: b.id,
        title: b.title,
        kind: b.kind,
        doneThisWeek: doneWeek.get(b.id) ?? 0,
        percent: percent(doneTotal.get(b.id) ?? 0, b.total),
      })),
  };
}
