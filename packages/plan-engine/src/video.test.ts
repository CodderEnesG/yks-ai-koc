import { describe, expect, it } from 'vitest';

import { parseCivilDate } from './civil-date.ts';
import { buildPlan } from './schedule.ts';
import type { StudySource } from './types.ts';
import { PlanInputError } from './validate.ts';
import { videoMinutes } from './video.ts';

describe('videoMinutes', () => {
  it('süre / hız × (1 + not payı)', () => {
    expect(videoMinutes(1200)).toBe(25); // 20 dk, 1×, %25
    expect(videoMinutes(1200, 2)).toBe(12.5);
    expect(videoMinutes(1200, 1.5, 0)).toBeCloseTo(13.333);
  });

  it('geçersiz değeri reddeder', () => {
    expect(() => videoMinutes(0)).toThrow(RangeError);
    expect(() => videoMinutes(600, 3 as never)).toThrow(RangeError);
    expect(() => videoMinutes(600, 1, 1.5)).toThrow(RangeError);
  });
});

describe('plan motorunda video', () => {
  const playlist = (n: number, minutes: number): StudySource => ({
    id: 'liste',
    order: 1,
    units: Array.from({ length: n }, (_, i) => ({
      id: `v${i + 1}`,
      kind: 'video',
      first: i + 1,
      last: i + 1,
      minutes,
    })),
  });
  const input = {
    from: parseCivilDate('2026-11-02'),
    examDate: parseCivilDate('2027-06-19'),
    weekdayMinutes: [60, 60, 60, 60, 60, 60, 60],
  };

  it('videolar liste sırasıyla, bölünmeden planlanır; kitapla paralel ilerler', () => {
    const book: StudySource = {
      id: 'kitap',
      order: 0,
      units: [{ id: 'k1', kind: 'pages', first: 1, last: 100, minutes: 300 }],
    };
    const plan = buildPlan({ ...input, sources: [book, playlist(10, videoMinutes(900))] });
    const videos = plan.days.flatMap((d) => d.tasks).filter((t) => t.kind === 'video');
    expect(videos.map((t) => t.unitId)).toEqual(Array.from({ length: 10 }, (_, i) => `v${i + 1}`));
    expect(videos.every((t) => t.first === t.last)).toBe(true);
    expect(plan.days[0]!.tasks.map((t) => t.sourceId)).toEqual(['kitap', 'liste']);
  });

  it('bir günden uzun video sığmaz ve uyarı verir', () => {
    const plan = buildPlan({ ...input, sources: [playlist(1, 120)] });
    expect(plan.unscheduled.map((r) => r.unitId)).toEqual(['v1']);
  });

  it('birden çok öğeli video birimini reddeder', () => {
    const bad: StudySource = {
      id: 'liste',
      order: 0,
      units: [{ id: 'v', kind: 'video', first: 1, last: 3, minutes: 30 }],
    };
    expect(() => buildPlan({ ...input, sources: [bad] })).toThrow(PlanInputError);
  });
});
