import { describe, expect, it } from 'vitest';

import { parseCivilDate } from './civil-date.ts';
import { type ReportTask, weeklySummary, weekStartOf } from './weekly.ts';

const d = parseCivilDate;
const task = (day: string, status: ReportTask['status'], first = 1, last = 10): ReportTask => ({
  day: d(day),
  status,
  seconds: 1800,
  libraryItemId: 'kitap',
  unitKey: 'u1',
  first,
  last,
});

describe('weekStartOf', () => {
  it('Pazartesi döner', () => {
    expect(weekStartOf(d('2026-10-26'))).toBe('2026-10-26'); // Pazartesi
    expect(weekStartOf(d('2026-11-01'))).toBe('2026-10-26'); // Pazar
  });
});

describe('weeklySummary', () => {
  const books = [{ id: 'kitap', title: 'Tarih', kind: 'pages' as const, total: 100 }];

  it('haftanın günlerini, dakikaları, seriyi ve kitap ilerlemesini sayar', () => {
    const s = weeklySummary({
      today: d('2026-10-28'), // Çarşamba
      books,
      tasks: [
        task('2026-10-23', 'done', 1, 10), // geçen Cuma: seri ve toplam ilerleme, haftaya girmez
        task('2026-10-26', 'done', 11, 20),
        task('2026-10-27', 'skipped', 21, 30),
        task('2026-10-28', 'done', 21, 30),
        task('2026-10-29', 'planned', 31, 40), // gelecek gün: yok sayılır
      ],
    });
    expect(s.weekStart).toBe('2026-10-26');
    expect(s.days.map((x) => [x.planned, x.complete])).toEqual([
      [true, true],
      [true, false],
      [true, true],
    ]);
    expect(s.plannedDays).toBe(3);
    expect(s.completeDays).toBe(2);
    expect(s.plannedMinutes).toBe(90);
    expect(s.doneMinutes).toBe(60);
    expect(s.streak).toBe(1);
    expect(s.books).toEqual([
      { id: 'kitap', title: 'Tarih', kind: 'pages', doneThisWeek: 20, percent: 30 },
    ]);
  });

  it('bu hafta görevi olmayan kitap raporda yok', () => {
    const s = weeklySummary({
      today: d('2026-10-28'),
      books,
      tasks: [task('2026-10-20', 'done')],
    });
    expect(s.books).toEqual([]);
    expect(s.plannedDays).toBe(0);
  });
});
