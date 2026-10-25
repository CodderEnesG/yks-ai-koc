import { describe, expect, it } from 'vitest';

import { parseCivilDate } from './civil-date.ts';
import { buildPlan } from './schedule.ts';
import type { PlanInput, StudySource } from './types.ts';
import { PlanInputError } from './validate.ts';

const MONDAY = parseCivilDate('2026-11-02');
const FAR_EXAM = parseCivilDate('2027-06-19');
const EVERY_DAY_60 = [60, 60, 60, 60, 60, 60, 60];

function book(id: string, order: number, units: StudySource['units']): StudySource {
  return { id, order, units };
}

function input(overrides: Partial<PlanInput> = {}): PlanInput {
  return {
    from: MONDAY,
    examDate: FAR_EXAM,
    weekdayMinutes: EVERY_DAY_60,
    sources: [],
    ...overrides,
  };
}

describe('buildPlan', () => {
  it('tek kitabı günlük kapasiteye göre böler', () => {
    // 100 sayfa, 200 dk → sayfa başı 120 sn; günde 60 dk → 30 sayfa.
    const plan = buildPlan(
      input({
        sources: [book('a', 0, [{ id: 'a1', kind: 'pages', first: 1, last: 100, minutes: 200 }])],
      }),
    );
    const withTasks = plan.days.filter((d) => d.tasks.length > 0);
    expect(withTasks.map((d) => d.tasks.map((t) => [t.first, t.last]))).toEqual([
      [[1, 30]],
      [[31, 60]],
      [[61, 90]],
      [[91, 100]],
    ]);
    expect(withTasks[0]!.date).toBe('2026-11-02');
    expect(plan.warnings).toEqual([]);
  });

  it('kitaplar paralel ilerler', () => {
    const plan = buildPlan(
      input({
        sources: [
          book('a', 0, [{ id: 'a1', kind: 'pages', first: 1, last: 300, minutes: 600 }]),
          book('b', 1, [{ id: 'b1', kind: 'tests', first: 1, last: 40, minutes: 600 }]),
        ],
      }),
    );
    const firstDay = plan.days[0]!;
    expect(firstDay.tasks.map((t) => t.sourceId)).toEqual(['a', 'b']);
    expect(firstDay.tasks[0]!.seconds).toBe(1800);
    expect(firstDay.tasks[1]!.seconds).toBe(1800);
  });

  it('öğrencinin sırasını izler, sıra eşitse kimliğe bakar', () => {
    const units = (id: string) => [{ id, kind: 'pages' as const, first: 1, last: 10, minutes: 10 }];
    const plan = buildPlan(
      input({
        sources: [book('z', 1, units('z1')), book('y', 1, units('y1')), book('x', 2, units('x1'))],
      }),
    );
    expect(plan.days[0]!.tasks.map((t) => t.sourceId)).toEqual(['y', 'z', 'x']);
  });

  it('kapasitesi 0 olan günler plana girmez', () => {
    const plan = buildPlan(
      input({
        weekdayMinutes: [60, 60, 60, 60, 60, 60, 0],
        sources: [book('a', 0, [{ id: 'a1', kind: 'pages', first: 1, last: 400, minutes: 800 }])],
      }),
    );
    expect(plan.days.map((d) => d.date)).not.toContain('2026-11-08'); // Pazar
    expect(plan.days[6]!.date).toBe('2026-11-09');
  });

  it('tamamlanan sayfalardan devam eder', () => {
    const plan = buildPlan(
      input({
        sources: [book('a', 0, [{ id: 'a1', kind: 'pages', first: 1, last: 100, minutes: 200 }])],
        completed: { a1: 40 },
      }),
    );
    expect(plan.days[0]!.tasks[0]).toMatchObject({ first: 41, last: 70 });
  });

  it('son 21 gün plansız kalır', () => {
    const plan = buildPlan(
      input({
        examDate: parseCivilDate('2026-11-30'),
        sources: [book('a', 0, [{ id: 'a1', kind: 'pages', first: 1, last: 500, minutes: 5000 }])],
      }),
    );
    expect(plan.targetEnd).toBe('2026-11-09');
    expect(plan.days.map((d) => d.date).at(-1)).toBe('2026-11-08');
  });

  it('talep kapasiteyi aşınca uyarır ve çekirdeği öncelikle seçer', () => {
    const plan = buildPlan(
      input({
        examDate: parseCivilDate('2026-11-25'), // 2 çalışma günü: 120 dk
        sources: [
          book('a', 0, [
            {
              id: 'low',
              kind: 'tests',
              first: 1,
              last: 5,
              minutes: 100,
              examWeight: 0,
              weakness: 0,
            },
            {
              id: 'high',
              kind: 'tests',
              first: 1,
              last: 5,
              minutes: 100,
              examWeight: 1,
              weakness: 1,
            },
          ]),
        ],
      }),
    );
    expect(plan.warnings[0]).toEqual({
      code: 'overload',
      demandSeconds: 12000,
      capacitySeconds: 7200,
    });
    expect(plan.optional.map((r) => r.unitId)).toEqual(['low']);
    expect(plan.days.flatMap((d) => d.tasks.map((t) => t.unitId))).toEqual(['high', 'high']);
  });

  it('günlük süreden uzun tek test sığmaz ve uyarı verir', () => {
    const plan = buildPlan(
      input({
        weekdayMinutes: [30, 30, 30, 30, 30, 30, 30],
        sources: [book('a', 0, [{ id: 'a1', kind: 'tests', first: 1, last: 2, minutes: 90 }])],
      }),
    );
    expect(plan.days.every((d) => d.tasks.length === 0)).toBe(true);
    expect(plan.unscheduled).toEqual([
      { sourceId: 'a', unitId: 'a1', kind: 'tests', first: 1, last: 2, seconds: 5400 },
    ]);
    expect(plan.warnings).toEqual([{ code: 'unscheduled', seconds: 5400 }]);
  });

  it('ayarlar: kapasite ve gün çarpanı, birim süresi, ısınma', () => {
    const units = [
      { id: 'long', kind: 'pages' as const, first: 1, last: 100, minutes: 200 },
      { id: 'short', kind: 'tests' as const, first: 1, last: 2, minutes: 10 },
    ];
    const base = input({ sources: [book('a', 0, [units[0]!]), book('b', 1, [units[1]!])] });

    const halved = buildPlan({ ...base, adjustments: { capacityFactor: 0.5 } });
    expect(halved.days[0]!.capacitySeconds).toBe(1800);

    const safe = buildPlan({ ...base, adjustments: { dayFactors: { '2026-11-03': 0.5 } } });
    expect(safe.days.map((d) => d.capacitySeconds).slice(0, 3)).toEqual([3600, 1800, 3600]);

    const hard = buildPlan({ ...base, adjustments: { unitFactors: { long: 1.3 } } });
    const longSeconds = (p: typeof hard) =>
      p.days
        .flatMap((d) => d.tasks)
        .filter((t) => t.unitId === 'long')
        .reduce((a, t) => a + t.seconds, 0);
    expect(longSeconds(hard)).toBe(Math.round(200 * 60 * 1.3));

    const plain = buildPlan(base).days[0]!.tasks.map((t) => t.unitId);
    const warm = buildPlan({
      ...base,
      adjustments: { warmupDays: ['2026-11-02'] },
    }).days[0]!.tasks.map((t) => t.unitId);
    expect(plain[0]).toBe('long');
    expect(warm[0]).toBe('short');
  });

  it('geçersiz girdiyi reddeder', () => {
    const unit = { id: 'u', kind: 'pages' as const, first: 1, last: 10, minutes: 10 };
    const bad: PlanInput[] = [
      input({ weekdayMinutes: [60, 60] }),
      input({ weekdayMinutes: [60, 60, 60, 60, 60, 60, 1441] }),
      input({ sources: [book('a', 0, [{ ...unit, last: 0 }])] }),
      input({ sources: [book('a', 0, [{ ...unit, minutes: 0 }])] }),
      input({ sources: [book('a', 0, [unit]), book('b', 0, [unit])] }),
      input({ sources: [book('a', 0, [{ ...unit, examWeight: 2 }])] }),
      input({ sources: [book('a', 0, [unit])], completed: { other: 1 } }),
      input({ examDate: parseCivilDate('2031-01-01') }),
      input({ adjustments: { capacityFactor: 0 } }),
      input({ adjustments: { dayFactors: { '2026-11-02': 1.5 } } }),
      input({ sources: [book('a', 0, [unit])], adjustments: { unitFactors: { u: 0.5 } } }),
      input({ adjustments: { unitFactors: { yok: 1.3 } } }),
    ];
    for (const value of bad) expect(() => buildPlan(value)).toThrow(PlanInputError);
  });
});
