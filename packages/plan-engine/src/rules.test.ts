import { describe, expect, it } from 'vitest';

import { parseCivilDate } from './civil-date.ts';
import { deriveAdjustments, isSafeMode, type ReasonEvent } from './rules.ts';

const d = parseCivilDate;
const ev = (day: string, reason: ReasonEvent['reason'], unitId?: string): ReasonEvent => ({
  day: d(day),
  reason,
  ...(unitId && { unitId }),
});

describe('deriveAdjustments', () => {
  it('geçmiş yoksa etkisiz', () => {
    expect(deriveAdjustments([])).toEqual({
      capacityFactor: 1,
      dayFactors: {},
      unitFactors: {},
      warmupDays: [],
    });
  });

  it('üç gün üst üste "zaman yetmedi" kapasiteyi %15 düşürür, her yeni üçlü tekrar', () => {
    const two = [ev('2026-11-02', 'zaman_yetmedi'), ev('2026-11-03', 'zaman_yetmedi')];
    expect(deriveAdjustments(two).capacityFactor).toBe(1);
    const three = [...two, ev('2026-11-04', 'zaman_yetmedi')];
    expect(deriveAdjustments(three).capacityFactor).toBeCloseTo(0.85);
    const gap = [...two, ev('2026-11-05', 'zaman_yetmedi')];
    expect(deriveAdjustments(gap).capacityFactor).toBe(1);
    const six = [
      ...three,
      ev('2026-11-05', 'zaman_yetmedi'),
      ev('2026-11-06', 'zaman_yetmedi'),
      ev('2026-11-07', 'zaman_yetmedi'),
    ];
    expect(deriveAdjustments(six).capacityFactor).toBeCloseTo(0.7225);
  });

  it('kapasite %50 altına inmez; aynı günün birden çok görevi tek gün sayılır', () => {
    const many = Array.from({ length: 30 }, (_, i) =>
      ev(`2026-11-${String(i + 1).padStart(2, '0')}`, 'zaman_yetmedi'),
    );
    expect(deriveAdjustments(many).capacityFactor).toBe(0.5);
    const sameDay = [
      ev('2026-11-02', 'zaman_yetmedi'),
      ev('2026-11-02', 'zaman_yetmedi'),
      ev('2026-11-02', 'zaman_yetmedi'),
    ];
    expect(deriveAdjustments(sameDay).capacityFactor).toBe(1);
  });

  it('"kötü hissediyorum" ertesi üç günü %50 yapar; "isteksizim" ertesi gün ısınma; "konu zor" ×1,3', () => {
    const a = deriveAdjustments([
      ev('2026-11-02', 'kotu_hissediyorum'),
      ev('2026-11-02', 'isteksiz'),
      ev('2026-11-02', 'konu_zor', 'u1'),
      ev('2026-11-03', 'konu_zor', 'u1'),
    ]);
    expect(a.dayFactors).toEqual({ '2026-11-03': 0.5, '2026-11-04': 0.5, '2026-11-05': 0.5 });
    expect(a.warmupDays).toEqual(['2026-11-03']);
    expect(a.unitFactors).toEqual({ u1: 1.3 });
  });
});

describe('isSafeMode', () => {
  it('seçildiği günün ertesinden itibaren üç gün', () => {
    const events = [ev('2026-11-02', 'kotu_hissediyorum')];
    expect(isSafeMode(events, d('2026-11-02'))).toBe(false);
    expect(isSafeMode(events, d('2026-11-03'))).toBe(true);
    expect(isSafeMode(events, d('2026-11-05'))).toBe(true);
    expect(isSafeMode(events, d('2026-11-06'))).toBe(false);
  });
});

describe('risk sinyaliyle güvenli mod', () => {
  it('sinyal günü ve ertesi üç gün %50, ton yumuşak', () => {
    const a = deriveAdjustments([], [d('2026-11-02')]);
    expect(a.dayFactors).toEqual({
      '2026-11-02': 0.5,
      '2026-11-03': 0.5,
      '2026-11-04': 0.5,
      '2026-11-05': 0.5,
    });
    expect(isSafeMode([], d('2026-11-01'), [d('2026-11-02')])).toBe(false);
    expect(isSafeMode([], d('2026-11-02'), [d('2026-11-02')])).toBe(true);
    expect(isSafeMode([], d('2026-11-05'), [d('2026-11-02')])).toBe(true);
    expect(isSafeMode([], d('2026-11-06'), [d('2026-11-02')])).toBe(false);
  });

  it('check-in nedeniyle üst üste gelince birikmez, %50 kalır', () => {
    const a = deriveAdjustments([ev('2026-11-02', 'kotu_hissediyorum')], [d('2026-11-03')]);
    expect(Object.values(a.dayFactors ?? {}).every((f) => f === 0.5)).toBe(true);
    expect(Object.keys(a.dayFactors ?? {})).toHaveLength(4);
  });
});
