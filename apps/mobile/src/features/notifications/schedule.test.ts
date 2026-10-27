import { parseCivilDate } from '@yks/plan-engine';
import { describe, expect, it } from 'vitest';

import { buildSchedule, istanbulTime } from './schedule';

const today = parseCivilDate('2026-10-26'); // Pazartesi
const day = (offset: number) => parseCivilDate(`2026-10-${26 + offset}`);
const loads = Array.from({ length: 6 }, (_, i) => ({
  date: day(i),
  seconds: 7200,
  books: 2,
  videos: 0,
}));

describe('istanbulTime', () => {
  it('İstanbul saati UTC+3', () => {
    expect(new Date(istanbulTime(today, { hour: 8, minute: 0 })).toISOString()).toBe(
      '2026-10-26T05:00:00.000Z',
    );
    expect(new Date(istanbulTime(today, { hour: 21, minute: 30 })).toISOString()).toBe(
      '2026-10-26T18:30:00.000Z',
    );
  });
});

describe('buildSchedule', () => {
  it('7 gün, gün başına sabah + iki akşam; geçmiş saatler atlanır', () => {
    const now = Date.UTC(2026, 9, 26, 6, 0); // 09:00 İstanbul
    const s = buildSchedule({ today, now, loads, checkedInToday: false });
    expect(s.filter((n) => n.date === today).map((n) => n.kind)).toEqual(['evening', 'late']);
    expect(s.filter((n) => n.date === day(1)).map((n) => n.kind)).toEqual([
      'morning',
      'evening',
      'late',
    ]);
    expect(s.length).toBe(2 + 5 * 3); // 6. gün (day 6) yükü yok
    expect(s.length).toBeLessThanOrEqual(64);
    expect(new Set(s.map((n) => n.id)).size).toBe(s.length);
  });

  it('check-in yapılan günün akşam hatırlatmaları kurulmaz', () => {
    const now = Date.UTC(2026, 9, 26, 4, 0); // 07:00
    const s = buildSchedule({ today, now, loads, checkedInToday: true });
    expect(s.filter((n) => n.date === today).map((n) => n.kind)).toEqual(['morning']);
  });

  it('görevi olmayan gün (dinlenme) bildirim almaz', () => {
    const rest = loads.map((l) => (l.date === day(2) ? { ...l, seconds: 0 } : l));
    const s = buildSchedule({ today, now: 0, loads: rest, checkedInToday: false });
    expect(s.some((n) => n.date === day(2))).toBe(false);
  });

  it('sabah saati seçilebilir', () => {
    const s = buildSchedule({
      today,
      now: 0,
      loads,
      checkedInToday: false,
      morning: { hour: 6, minute: 30 },
    });
    expect(new Date(s[0]!.at).toISOString()).toBe('2026-10-26T03:30:00.000Z');
  });
});
