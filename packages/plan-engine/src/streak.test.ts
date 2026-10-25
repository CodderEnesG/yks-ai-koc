import { describe, expect, it } from 'vitest';

import { type CivilDate, parseCivilDate } from './civil-date.ts';
import { currentStreak, type DayTask, isDayComplete } from './streak.ts';

const t = (status: DayTask['status'], seconds = 600): DayTask => ({ status, seconds });

describe('isDayComplete', () => {
  it('görevlerin 2/3ü ya da dakikanın %60ı', () => {
    expect(isDayComplete([t('done'), t('done'), t('skipped')])).toBe(true); // 2/3
    expect(isDayComplete([t('done'), t('skipped'), t('skipped')])).toBe(false);
    expect(isDayComplete([t('done', 3600), t('skipped', 600), t('skipped', 600)])).toBe(true); // %75 dakika
    expect(isDayComplete([t('done', 1100), t('skipped', 900)])).toBe(false); // 1/2, %55
    expect(isDayComplete([t('done', 1200), t('skipped', 800)])).toBe(true); // %60
    expect(isDayComplete([t('planned'), t('planned')])).toBe(false);
    expect(isDayComplete([])).toBe(false);
  });
});

describe('currentStreak', () => {
  const d = (s: string) => parseCivilDate(s);
  const map = (entries: [string, DayTask[]][]) =>
    new Map(entries.map(([k, v]) => [d(k) as CivilDate, v]));
  const ok = [t('done')];
  const bad = [t('skipped')];

  it('art arda tamam günler; bozulan gün seriyi keser', () => {
    const days = map([
      ['2026-11-01', ok],
      ['2026-11-02', bad],
      ['2026-11-03', ok],
      ['2026-11-04', ok],
      ['2026-11-05', ok],
    ]);
    expect(currentStreak(days, d('2026-11-05'))).toEqual({ days: 3, todayComplete: true });
  });

  it('bugün henüz tamam değilse seri dünden sayılır', () => {
    const days = map([
      ['2026-11-04', ok],
      ['2026-11-05', [t('planned')]],
    ]);
    expect(currentStreak(days, d('2026-11-05'))).toEqual({ days: 1, todayComplete: false });
  });

  it('kaydı olmayan gün (dinlenme) seriyi bozmaz; gelecek günler sayılmaz', () => {
    const days = map([
      ['2026-11-02', ok],
      ['2026-11-04', ok],
      ['2026-11-06', ok],
    ]);
    expect(currentStreak(days, d('2026-11-04')).days).toBe(2);
  });

  it('dün check-in yapılmadıysa (planlanmış kaldıysa) seri sıfır', () => {
    const days = map([
      ['2026-11-03', ok],
      ['2026-11-04', [t('planned')]],
      ['2026-11-05', [t('planned')]],
    ]);
    expect(currentStreak(days, d('2026-11-05')).days).toBe(0);
  });
});
