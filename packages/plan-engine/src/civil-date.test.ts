import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import {
  addDays,
  diffDays,
  fromEpochDay,
  istanbulDate,
  parseCivilDate,
  toEpochDay,
  weekdayIndex,
} from './civil-date.ts';

// 2000-01-01 … 2100-12-31 arası epoch günleri.
const epochDay = fc.integer({ min: 10_957, max: 47_481 });
const civilDate = epochDay.map(fromEpochDay);

describe('civil-date', () => {
  it('bilinen değerler', () => {
    expect(toEpochDay(parseCivilDate('1970-01-01'))).toBe(0);
    expect(weekdayIndex(parseCivilDate('2026-10-23'))).toBe(4); // Cuma
    expect(weekdayIndex(parseCivilDate('2026-10-26'))).toBe(0); // Pazartesi
    expect(addDays(parseCivilDate('2026-12-31'), 1)).toBe('2027-01-01');
    expect(addDays(parseCivilDate('2028-02-28'), 1)).toBe('2028-02-29');
  });

  it('geçersiz tarihleri reddeder', () => {
    for (const bad of ['2026-02-30', '2026-13-01', '2026-1-01', '26-01-01', '']) {
      expect(() => parseCivilDate(bad)).toThrow(RangeError);
    }
  });

  it('İstanbul günü UTC 21:00 sınırında değişir', () => {
    expect(istanbulDate(Date.UTC(2026, 9, 23, 20, 59, 59))).toBe('2026-10-23');
    expect(istanbulDate(Date.UTC(2026, 9, 23, 21, 0, 0))).toBe('2026-10-24');
  });

  it('epoch-day dönüşümü gidiş-dönüş', () => {
    fc.assert(fc.property(epochDay, (n) => toEpochDay(fromEpochDay(n)) === n));
    fc.assert(fc.property(civilDate, (d) => parseCivilDate(d) === d));
  });

  it('addDays ve diffDays birbirinin tersi', () => {
    fc.assert(
      fc.property(civilDate, fc.integer({ min: -2000, max: 2000 }), (d, n) => {
        const moved = addDays(d, n);
        return diffDays(moved, d) === n && addDays(moved, -n) === d;
      }),
    );
  });

  it('haftanın günü 7 günde bir tekrar eder ve her gün bir ilerler', () => {
    fc.assert(
      fc.property(civilDate, (d) => {
        const w = weekdayIndex(d);
        return weekdayIndex(addDays(d, 7)) === w && weekdayIndex(addDays(d, 1)) === (w + 1) % 7;
      }),
    );
  });

  it('İstanbul günü her an için tek ve deterministik', () => {
    fc.assert(
      fc.property(fc.integer({ min: 946_684_800_000, max: 4_102_444_799_000 }), (ms) => {
        const d = istanbulDate(ms);
        return d === istanbulDate(ms) && diffDays(istanbulDate(ms + 86_400_000), d) === 1;
      }),
    );
  });
});
