// Rapor 2.6'daki property'ler. CI'da zorunlu; plan motoru değişince hepsi geçmeli.
import fc from 'fast-check';
import { describe, expect, it } from 'vitest';

import { addDays, diffDays, fromEpochDay, weekdayIndex } from './civil-date.ts';
import { buildPlan } from './schedule.ts';
import type { PlanInput, PlanResult, StudySource, StudyUnit, UnitRange } from './types.ts';

const unitSpec = fc.record({
  kind: fc.constantFrom('pages' as const, 'tests' as const),
  first: fc.integer({ min: 1, max: 400 }),
  length: fc.integer({ min: 1, max: 40 }),
  minutes: fc.integer({ min: 1, max: 600 }),
  examWeight: fc.option(fc.double({ min: 0, max: 1, noNaN: true })),
  weakness: fc.option(fc.double({ min: 0, max: 1, noNaN: true })),
  done: fc.option(fc.integer({ min: 0, max: 45 })),
});

const sourceSpec = fc.record({
  order: fc.integer({ min: 0, max: 3 }),
  units: fc.array(unitSpec, { minLength: 1, maxLength: 6 }),
});

const planInput: fc.Arbitrary<PlanInput> = fc
  .record({
    fromDay: fc.integer({ min: 20_300, max: 21_000 }), // 2025-07 … 2027-06
    // Sıkışık takvimler (birkaç çalışma günü) aşırı yük yolunu sık sınasın diye ayrı dal.
    span: fc.oneof(fc.integer({ min: 22, max: 50 }), fc.integer({ min: 0, max: 400 })),
    weekdayMinutes: fc.array(fc.integer({ min: 0, max: 300 }), { minLength: 7, maxLength: 7 }),
    sources: fc.array(sourceSpec, { maxLength: 4 }),
  })
  .map(({ fromDay, span, weekdayMinutes, sources }) => {
    const completed: Record<string, number> = {};
    const built: StudySource[] = sources.map((s, i) => ({
      id: `s${i}`,
      order: s.order,
      units: s.units.map((u, j): StudyUnit => {
        const id = `s${i}u${j}`;
        if (u.done !== null) completed[id] = u.done;
        return {
          id,
          kind: u.kind,
          first: u.first,
          last: u.first + u.length - 1,
          minutes: u.minutes,
          ...(u.examWeight !== null && { examWeight: u.examWeight }),
          ...(u.weakness !== null && { weakness: u.weakness }),
        };
      }),
    }));
    const from = fromEpochDay(fromDay);
    return { from, examDate: addDays(from, span), weekdayMinutes, sources: built, completed };
  });

interface Located extends UnitRange {
  where: 'day' | 'unscheduled' | 'optional';
}

function allRanges(plan: PlanResult): Located[] {
  return [
    ...plan.days.flatMap((d) => d.tasks.map((t) => ({ ...t, where: 'day' as const }))),
    ...plan.unscheduled.map((r) => ({ ...r, where: 'unscheduled' as const })),
    ...plan.optional.map((r) => ({ ...r, where: 'optional' as const })),
  ];
}

// Test tarafında bağımsız hesap: birimin kalan aralığı ve saniyesi.
function remainingOf(input: PlanInput, unit: StudyUnit) {
  const count = unit.last - unit.first + 1;
  const done = Math.min(input.completed?.[unit.id] ?? 0, count);
  const total = Math.round(unit.minutes * 60);
  return {
    first: unit.first + done,
    last: unit.last,
    seconds: total - Math.floor((total * done) / count),
  };
}

function units(input: PlanInput): StudyUnit[] {
  return input.sources.flatMap((s) => s.units);
}

function itemSeconds(unit: StudyUnit): number[] {
  const count = unit.last - unit.first + 1;
  const total = Math.round(unit.minutes * 60);
  return Array.from(
    { length: count },
    (_, i) => Math.floor((total * (i + 1)) / count) - Math.floor((total * i) / count),
  );
}

describe('plan motoru property testleri', () => {
  it("bir günün görevleri kapasite + %10'u aşmaz", () => {
    fc.assert(
      fc.property(planInput, (input) => {
        const plan = buildPlan(input);
        for (const day of plan.days) {
          const sum = day.tasks.reduce((a, t) => a + t.seconds, 0);
          expect(day.seconds).toBe(sum);
          expect(day.seconds).toBeLessThanOrEqual(Math.floor((day.capacitySeconds * 11) / 10));
          expect(day.capacitySeconds).toBe(input.weekdayMinutes[weekdayIndex(day.date)]! * 60);
        }
      }),
    );
  });

  it('her birimin kalan kısmı tam bir kez yer alır, aralıklar çakışmaz', () => {
    fc.assert(
      fc.property(planInput, (input) => {
        const ranges = allRanges(buildPlan(input));
        for (const unit of units(input)) {
          const expected = remainingOf(input, unit);
          const mine = ranges.filter((r) => r.unitId === unit.id).sort((a, b) => a.first - b.first);
          if (expected.first > expected.last) {
            expect(mine).toEqual([]);
            continue;
          }
          expect(mine.length).toBeGreaterThan(0);
          let cursor = expected.first;
          for (const r of mine) {
            expect(r.first).toBe(cursor);
            expect(r.last).toBeGreaterThanOrEqual(r.first);
            cursor = r.last + 1;
          }
          expect(cursor - 1).toBe(expected.last);
          expect(mine.reduce((a, r) => a + r.seconds, 0)).toBe(expected.seconds);
          // "Zaman kalırsa" listesine giden birim bölünmez.
          if (mine.some((r) => r.where === 'optional')) expect(mine).toHaveLength(1);
        }
        const ids = new Set(units(input).map((u) => u.id));
        for (const r of ranges) expect(ids.has(r.unitId)).toBe(true);
      }),
    );
  });

  it('kaynak içinde kitap sırası korunur', () => {
    fc.assert(
      fc.property(planInput, (input) => {
        const plan = buildPlan(input);
        for (const source of input.sources) {
          const index = new Map(source.units.map((u, i) => [u.id, i]));
          const sequence = plan.days.flatMap((d) =>
            d.tasks
              .filter((t) => t.sourceId === source.id)
              .map((t) => [index.get(t.unitId)!, t.first, t.last] as const),
          );
          for (let i = 1; i < sequence.length; i++) {
            const [prevUnit, , prevLast] = sequence[i - 1]!;
            const [unit, first] = sequence[i]!;
            expect(unit > prevUnit || (unit === prevUnit && first === prevLast + 1)).toBe(true);
          }
        }
      }),
    );
  });

  it('görevler yalnız [from, targetEnd) aralığında ve sıralı günlerde', () => {
    fc.assert(
      fc.property(planInput, (input) => {
        const plan = buildPlan(input);
        expect(plan.targetEnd).toBe(addDays(input.examDate, -21));
        let previous: string | undefined;
        for (const day of plan.days) {
          expect(diffDays(day.date, input.from)).toBeGreaterThanOrEqual(0);
          expect(diffDays(plan.targetEnd, day.date)).toBeGreaterThan(0);
          expect(day.capacitySeconds).toBeGreaterThan(0);
          if (previous !== undefined) expect(day.date > previous).toBe(true);
          previous = day.date;
        }
      }),
    );
  });

  it('aynı girdi aynı çıktıyı verir; kaynakların dizideki sırası önemsizdir', () => {
    fc.assert(
      fc.property(planInput, (input) => {
        const plan = buildPlan(input);
        expect(buildPlan(JSON.parse(JSON.stringify(input)) as PlanInput)).toEqual(plan);
        expect(buildPlan({ ...input, sources: [...input.sources].reverse() })).toEqual(plan);
      }),
    );
  });

  it('talep kapasiteyi aşarsa uyarı üretilir ve çekirdek kapasiteye sığar', () => {
    fc.assert(
      fc.property(planInput, (input) => {
        const plan = buildPlan(input);
        const demand = units(input).reduce((a, u) => a + remainingOf(input, u).seconds, 0);
        const capacity = plan.days.reduce((a, d) => a + d.capacitySeconds, 0);
        const overload = plan.warnings.find((w) => w.code === 'overload');
        const core = allRanges(plan).filter((r) => r.where !== 'optional');
        if (demand > capacity) {
          expect(overload).toEqual({
            code: 'overload',
            demandSeconds: demand,
            capacitySeconds: capacity,
          });
          expect(core.reduce((a, r) => a + r.seconds, 0)).toBeLessThanOrEqual(capacity);
        } else {
          expect(overload).toBeUndefined();
          expect(plan.optional).toEqual([]);
        }
        expect(plan.warnings.some((w) => w.code === 'unscheduled')).toBe(
          plan.unscheduled.length > 0,
        );
      }),
    );
  });

  it('gün dolmadıysa hiçbir kaynağın sıradaki parçası o güne sığmıyordur', () => {
    fc.assert(
      fc.property(planInput, (input) => {
        const plan = buildPlan(input);
        const optional = new Set(plan.optional.map((r) => r.unitId));
        // Her kaynağın planlanacak parçaları, kitap sırasıyla: [birim kimliği, numara, saniye].
        const queues = input.sources.map((source) =>
          source.units
            .filter((u) => !optional.has(u.id))
            .flatMap((u) => {
              const seconds = itemSeconds(u);
              const start = remainingOf(input, u).first;
              return seconds
                .map((s, i) => [u.id, u.first + i, s] as const)
                .filter(([, item]) => item >= start);
            }),
        );
        const cursors = queues.map(() => 0);
        for (const day of plan.days) {
          for (const task of day.tasks) {
            const i = input.sources.findIndex((s) => s.id === task.sourceId);
            cursors[i]! += task.last - task.first + 1;
          }
          if (day.seconds >= day.capacitySeconds) continue;
          const limit = Math.floor((day.capacitySeconds * 11) / 10);
          queues.forEach((queue, i) => {
            const next = queue[cursors[i]!];
            if (next) expect(day.seconds + next[2]).toBeGreaterThan(limit);
          });
        }
      }),
    );
  });

  it('kapasite yetiyorsa ve parçalar küçükse her şey planlanır', () => {
    fc.assert(
      fc.property(planInput, (input) => {
        const plan = buildPlan(input);
        const minCapacity = Math.min(...plan.days.map((d) => d.capacitySeconds));
        const maxItem = Math.max(0, ...units(input).flatMap(itemSeconds));
        const overloaded = plan.warnings.some((w) => w.code === 'overload');
        fc.pre(!overloaded && plan.days.length > 0 && maxItem * 10 <= minCapacity);
        expect(plan.unscheduled).toEqual([]);
      }),
    );
  });

  it('yeniden planlama geçmişi değiştirmez ve yapılan işi düşer', () => {
    fc.assert(
      fc.property(planInput, fc.integer({ min: 1, max: 30 }), (input, k) => {
        const plan = buildPlan(input);
        fc.pre(plan.days.length > k);
        // İlk k çalışma günündeki görevler eksiksiz yapılmış olsun.
        const completed: Record<string, number> = { ...input.completed };
        for (const unit of units(input)) {
          const count = unit.last - unit.first + 1;
          completed[unit.id] = Math.min(completed[unit.id] ?? 0, count);
        }
        let doneSeconds = 0;
        for (const day of plan.days.slice(0, k)) {
          for (const task of day.tasks) {
            completed[task.unitId] = completed[task.unitId]! + (task.last - task.first + 1);
            doneSeconds += task.seconds;
          }
        }
        const from = addDays(plan.days[k - 1]!.date, 1);
        const replanned = buildPlan({ ...input, from, completed });
        for (const day of replanned.days) expect(day.date >= from).toBe(true);
        const before = allRanges(plan).reduce((a, r) => a + r.seconds, 0);
        const after = allRanges(replanned).reduce((a, r) => a + r.seconds, 0);
        expect(after).toBe(before - doneSeconds);
      }),
    );
  });
});
