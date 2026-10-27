import { describe, expect, it } from 'vitest';

import { buildCoachContext, COACH_PROMPT, SAFE_MODE_INSTRUCTION } from './coach.ts';

const base = {
  today: '2026-10-27',
  daysToExam: 235,
  todayTasks: [],
  last7: { planned: 0, complete: 0 },
  reasons: [],
  safeMode: false,
};

describe('buildCoachContext', () => {
  it('planı, son 7 günü ve nedenleri yazar', () => {
    const text = buildCoachContext({
      ...base,
      todayTasks: [
        { title: 'Tarih', kind: 'pages', first: 11, last: 20, minutes: 30, status: 'done' },
        { title: 'Matematik', kind: 'tests', first: 3, last: 4, minutes: 30, status: 'planned' },
      ],
      last7: { planned: 5, complete: 3 },
      reasons: ['zaman_yetmedi', 'konu_zor'],
    });
    expect(text).toContain('Sınava 235 gün var.');
    expect(text).toContain('- Tarih sayfa 11-20, ≈30 dk (yapıldı)');
    expect(text).toContain('- Matematik test 3-4, ≈30 dk (yapılacak)');
    expect(text).toContain('5 çalışma gününün 3 tanesi tamamlandı');
    expect(text).toContain('zaman yetmedi, konu zor geldi');
    expect(text).not.toContain(SAFE_MODE_INSTRUCTION);
  });

  it('güvenli modda yumuşak ton talimatını ekler', () => {
    expect(buildCoachContext({ ...base, safeMode: true })).toContain(SAFE_MODE_INSTRUCTION);
  });

  it('kitap adındaki kişisel bilgiyi maskeler', () => {
    const text = buildCoachContext({
      ...base,
      todayTasks: [
        {
          title: 'Ahmet hoca notları 0532 123 45 67',
          kind: 'pages',
          first: 1,
          last: 5,
          minutes: 15,
          status: 'planned',
        },
      ],
    });
    expect(text).not.toContain('Ahmet');
    expect(text).not.toContain('0532');
  });

  it('aynı girdi aynı metni verir (istem önbelleği bağlamı ayrı tutar)', () => {
    expect(buildCoachContext(base)).toBe(buildCoachContext(base));
    expect(COACH_PROMPT).not.toContain('2026');
  });
});
