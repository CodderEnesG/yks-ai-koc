import { buildPlan, parseCivilDate } from '@yks/plan-engine';
import { describe, expect, it } from 'vitest';

import {
  completedCounts,
  type LibrarySourceRow,
  splitPlanUnitId,
  toPlanInput,
  toStudySource,
} from './inputs';

const catalogBook: LibrarySourceRow = {
  id: 'item-a',
  sortOrder: 0,
  minutesPerItem: 3,
  catalogUnits: [
    { id: 'u1', seq: 1, pageStart: 11, pageEnd: 16 },
    { id: 'u2', seq: 2, pageStart: 17, pageEnd: 22 },
  ],
  customEdition: null,
};
const quickBook: LibrarySourceRow = {
  id: 'item-b',
  sortOrder: 1,
  minutesPerItem: 15,
  catalogUnits: null,
  customEdition: { title: 'X Fizik', units: [{ key: '1', kind: 'tests', first: 1, last: 40 }] },
};

describe('toStudySource', () => {
  it('katalog birimlerini sayfa, özel baskıyı kendi türüyle; süre öğe × dakika', () => {
    expect(toStudySource(catalogBook).units).toEqual([
      { id: 'item-a:u1', kind: 'pages', first: 11, last: 16, minutes: 18 },
      { id: 'item-a:u2', kind: 'pages', first: 17, last: 22, minutes: 18 },
    ]);
    expect(toStudySource(quickBook).units).toEqual([
      { id: 'item-b:1', kind: 'tests', first: 1, last: 40, minutes: 600 },
    ]);
    expect(splitPlanUnitId('item-a:u1')).toEqual({ itemId: 'item-a', unitKey: 'u1' });
  });

  it('aynı baskı iki kez eklenince birim kimlikleri çakışmaz', () => {
    const twice = toPlanInput({
      from: parseCivilDate('2026-11-02'),
      examDate: parseCivilDate('2027-06-19'),
      weekdayMinutes: [60, 60, 60, 60, 60, 60, 60],
      library: [catalogBook, { ...catalogBook, id: 'item-c', sortOrder: 2 }],
      done: [],
    });
    expect(() => buildPlan(twice)).not.toThrow();
  });
});

describe('completedCounts', () => {
  const sources = [toStudySource(catalogBook)];

  it('baştan ardışık yapılanı sayar, boşlukta durur', () => {
    expect(completedCounts(sources, [{ unitId: 'item-a:u1', first: 11, last: 13 }])).toEqual({
      'item-a:u1': 3,
    });
    expect(
      completedCounts(sources, [
        { unitId: 'item-a:u1', first: 14, last: 16 },
        { unitId: 'item-a:u1', first: 11, last: 13 },
      ]),
    ).toEqual({ 'item-a:u1': 6 });
    expect(completedCounts(sources, [{ unitId: 'item-a:u1', first: 13, last: 16 }])).toEqual({});
  });
});

describe('toPlanInput', () => {
  it('yapılan iş planı ilerletir', () => {
    const base = {
      from: parseCivilDate('2026-11-02'),
      examDate: parseCivilDate('2027-06-19'),
      weekdayMinutes: [30, 30, 30, 30, 30, 30, 30],
      library: [catalogBook],
    };
    const first = buildPlan(toPlanInput({ ...base, done: [] })).days[0]!.tasks[0]!;
    expect(first).toMatchObject({ unitId: 'item-a:u1', first: 11 });
    const after = buildPlan(
      toPlanInput({ ...base, done: [{ unitId: 'item-a:u1', first: 11, last: 16 }] }),
    );
    expect(after.days[0]!.tasks[0]).toMatchObject({ unitId: 'item-a:u2', first: 17 });
  });

  it('birimi olmayan kaynak plana girmez', () => {
    const empty: LibrarySourceRow = {
      ...quickBook,
      id: 'item-e',
      customEdition: { title: 'Boş', units: [] },
    };
    const input = toPlanInput({
      from: parseCivilDate('2026-11-02'),
      examDate: parseCivilDate('2027-06-19'),
      weekdayMinutes: [60, 60, 60, 60, 60, 60, 60],
      library: [empty],
      done: [],
    });
    expect(input.sources).toEqual([]);
  });
});

describe('toPlanInput ayarları', () => {
  it('silinen kaynağın birim çarpanını süzer', () => {
    const input = toPlanInput({
      from: parseCivilDate('2026-11-02'),
      examDate: parseCivilDate('2027-06-19'),
      weekdayMinutes: [60, 60, 60, 60, 60, 60, 60],
      library: [catalogBook],
      done: [],
      adjustments: { capacityFactor: 0.85, unitFactors: { 'item-a:u1': 1.3, 'silinen:u9': 1.3 } },
    });
    expect(input.adjustments).toEqual({ capacityFactor: 0.85, unitFactors: { 'item-a:u1': 1.3 } });
    expect(() => buildPlan(input)).not.toThrow();
  });
});
