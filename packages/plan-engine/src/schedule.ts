// Plan motoru çekirdeği (rapor 2.6): deterministik, açgözlü liste zamanlama.
// Saf fonksiyon: aynı girdi her zaman aynı planı verir; saat, rastgelelik ve I/O yok.
// Neden kuralları (kapasite düşürme, süre ×1,3, güvenli mod) T14'te, video birimi T32'de eklenir.

import { addDays, type CivilDate, diffDays, weekdayIndex } from './civil-date.ts';
import type {
  PlanDay,
  PlanInput,
  PlanResult,
  PlanWarning,
  StudySource,
  StudyUnit,
  UnitRange,
} from './types.ts';
import { validatePlanInput } from './validate.ts';

/** Sınavdan önceki son 3 hafta plansız kalır: genel tekrar ve deneme. */
export const REVIEW_DAYS = 21;

// Öncelik skoru: w1·sınav_ağırlığı + w2·zayıflık + w3·kitap_içi_sıra (+ w4·gecikme).
// Rapor formülü veriyor, ağırlıkları vermiyor (NOT DEFINED); bunlar varsayılan.
// Gecikme terimi check-in geçmişine bağlı, T14'te eklenecek.
const W_EXAM = 0.4;
const W_WEAKNESS = 0.3;
const W_ORDER = 0.3;

interface PendingUnit {
  source: StudySource;
  sourceRank: number;
  unit: StudyUnit;
  unitIndex: number;
  /** Sıradaki planlanmamış sayfa ya da test numarası. */
  next: number;
  totalSeconds: number;
}

function compareSources(a: StudySource, b: StudySource): number {
  if (a.order !== b.order) return a.order - b.order;
  return a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
}

// Birimin toplam süresi sayfa/testlere tamsayı saniye olarak dağıtılır; parçaların toplamı
// her zaman birimin toplamına eşittir, kayan nokta birikimi olmaz.
function secondsUpTo(p: PendingUnit, item: number): number {
  const count = p.unit.last - p.unit.first + 1;
  return Math.floor((p.totalSeconds * (item - p.unit.first + 1)) / count);
}

function rangeSeconds(p: PendingUnit, first: number, last: number): number {
  return secondsUpTo(p, last) - secondsUpTo(p, first - 1);
}

function remainingSeconds(p: PendingUnit): number {
  return rangeSeconds(p, p.next, p.unit.last);
}

function priorityScore(p: PendingUnit): number {
  const order = 1 - p.unitIndex / p.source.units.length;
  return (
    W_EXAM * (p.unit.examWeight ?? 0.5) + W_WEAKNESS * (p.unit.weakness ?? 0.5) + W_ORDER * order
  );
}

function toRange(p: PendingUnit): UnitRange {
  return {
    sourceId: p.source.id,
    unitId: p.unit.id,
    kind: p.unit.kind,
    first: p.next,
    last: p.unit.last,
    seconds: remainingSeconds(p),
  };
}

function sum(values: readonly number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

// Kuyruğun başından, kota ve günün sınırı izin verdikçe sayfa/test alır.
function take(
  queue: PendingUnit[],
  day: PlanDay,
  limitSeconds: number,
  quotaSeconds: number,
): void {
  let taken = 0;
  while (queue.length > 0 && taken < quotaSeconds && day.seconds < day.capacitySeconds) {
    const p = queue[0]!;
    const seconds = rangeSeconds(p, p.next, p.next);
    if (day.seconds + seconds > limitSeconds) return;

    const task = day.tasks.find((t) => t.unitId === p.unit.id && t.last === p.next - 1);
    if (task) {
      task.last = p.next;
      task.seconds += seconds;
    } else {
      day.tasks.push({
        sourceId: p.source.id,
        unitId: p.unit.id,
        kind: p.unit.kind,
        first: p.next,
        last: p.next,
        seconds,
      });
    }
    day.seconds += seconds;
    taken += seconds;
    p.next += 1;
    if (p.next > p.unit.last) queue.shift();
  }
}

export function buildPlan(input: PlanInput): PlanResult {
  validatePlanInput(input);

  const targetEnd = addDays(input.examDate, -REVIEW_DAYS);
  const completed = input.completed ?? {};
  const adjust = input.adjustments ?? {};
  const sources = [...input.sources].sort(compareSources);

  const pending: PendingUnit[] = sources.flatMap((source, sourceRank) =>
    source.units.flatMap((unit, unitIndex) => {
      const count = unit.last - unit.first + 1;
      const next = unit.first + Math.min(completed[unit.id] ?? 0, count);
      if (next > unit.last) return [];
      return [
        {
          source,
          sourceRank,
          unit,
          unitIndex,
          next,
          totalSeconds: Math.round(unit.minutes * 60 * (adjust.unitFactors?.[unit.id] ?? 1)),
        },
      ];
    }),
  );

  const days: PlanDay[] = [];
  for (let date: CivilDate = input.from; diffDays(targetEnd, date) > 0; date = addDays(date, 1)) {
    const factor = (adjust.capacityFactor ?? 1) * (adjust.dayFactors?.[date] ?? 1);
    const capacitySeconds = Math.floor(input.weekdayMinutes[weekdayIndex(date)]! * 60 * factor);
    if (capacitySeconds > 0) days.push({ date, capacitySeconds, seconds: 0, tasks: [] });
  }

  const warnings: PlanWarning[] = [];
  const demandSeconds = sum(pending.map(remainingSeconds));
  const capacitySeconds = sum(days.map((d) => d.capacitySeconds));

  // Talep kapasiteyi aşıyorsa öncelik skoruna göre kapasiteye sığan "çekirdek" seçilir;
  // kalan birimler bütün olarak "zaman kalırsa" listesine gider.
  let core = pending;
  let optional: PendingUnit[] = [];
  if (demandSeconds > capacitySeconds) {
    warnings.push({ code: 'overload', demandSeconds, capacitySeconds });
    const ranked = [...pending].sort(
      (a, b) =>
        priorityScore(b) - priorityScore(a) ||
        a.sourceRank - b.sourceRank ||
        a.unitIndex - b.unitIndex,
    );
    const chosen = new Set<PendingUnit>();
    let budget = capacitySeconds;
    for (const p of ranked) {
      const seconds = remainingSeconds(p);
      if (seconds <= budget) {
        chosen.add(p);
        budget -= seconds;
      }
    }
    core = pending.filter((p) => chosen.has(p));
    optional = pending.filter((p) => !chosen.has(p));
  }

  // Kaynaklar paralel ilerler: her gün önce kalan işleri oranında pay alırlar,
  // sonra boş kalan kapasite kaynak sırasıyla doldurulur. Gün kapasiteyi en fazla %10 aşar.
  const queues = sources.map((_, rank) => core.filter((p) => p.sourceRank === rank));
  const weights = queues.map((queue) => sum(queue.map(remainingSeconds)));
  for (const day of days) {
    const limitSeconds = Math.floor((day.capacitySeconds * 11) / 10);
    const active = queues.flatMap((queue, i) => (queue.length > 0 ? [i] : []));
    const activeWeight = sum(active.map((i) => weights[i]!));
    for (const i of active) {
      const quota =
        activeWeight > 0 ? Math.floor((day.capacitySeconds * weights[i]!) / activeWeight) : 0;
      take(queues[i]!, day, limitSeconds, quota);
    }
    for (const i of active) take(queues[i]!, day, limitSeconds, Infinity);
  }

  // Isınma: o günün en kısa görevi başa alınır (diğerlerinin sırası korunur).
  for (const day of days) {
    if (!adjust.warmupDays?.includes(day.date) || day.tasks.length < 2) continue;
    const shortest = day.tasks.reduce(
      (best, t, i) => (t.seconds < day.tasks[best]!.seconds ? i : best),
      0,
    );
    day.tasks.unshift(...day.tasks.splice(shortest, 1));
  }

  const unscheduled = queues.flat().map(toRange);
  if (unscheduled.length > 0) {
    warnings.push({ code: 'unscheduled', seconds: sum(unscheduled.map((r) => r.seconds)) });
  }

  return { targetEnd, days, optional: optional.map(toRange), unscheduled, warnings };
}
