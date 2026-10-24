import { parseCivilDate } from '@yks/plan-engine';
import { describe, expect, it } from 'vitest';

import {
  defaultExamDate,
  isMinor,
  parseTarget,
  profileIssues,
  profileSchema,
  splitWeek,
  type ProfileInput,
} from './rules';

const today = parseCivilDate('2026-10-24');

const valid: ProfileInput = {
  birthYear: 2009,
  birthMonth: 3,
  grade: '12',
  field: 'SAY',
  target: { kind: 'siralama', value: 20_000 },
  examDate: '2027-06-19',
  weekdayMinutes: [120, 120, 120, 120, 120, 240, 240],
};

describe('defaultExamDate', () => {
  it('12. sınıf ve mezun ilk sınava, 11. sınıf bir sonrakine', () => {
    expect(defaultExamDate('12', today)).toBe('2027-06-19');
    expect(defaultExamDate('mezun', today)).toBe('2027-06-19');
    expect(defaultExamDate('11', today)).toBe('2028-06-17');
  });

  it('sınav günü geçince bir sonrakine kayar; tahmin yoksa null', () => {
    const after = parseCivilDate('2027-06-19');
    expect(defaultExamDate('12', after)).toBe('2028-06-17');
    expect(defaultExamDate('11', after)).toBeNull();
  });
});

describe('isMinor', () => {
  it('18 yaşına girdiği ay boyunca reşit sayılmaz', () => {
    expect(isMinor(2008, 10, today)).toBe(true); // Ekim 2008: doğum günü bu ay, belki geçmedi
    expect(isMinor(2008, 9, today)).toBe(false); // Eylül 2008: 18 yaşını doldurdu
    expect(isMinor(2008, 11, today)).toBe(true);
    expect(isMinor(2010, 1, today)).toBe(true);
    expect(isMinor(2000, 12, today)).toBe(false);
  });
});

describe('splitWeek', () => {
  it('Pazartesi-Cuma hafta içi, Cumartesi-Pazar hafta sonu', () => {
    expect(splitWeek(90, 180)).toEqual([90, 90, 90, 90, 90, 180, 180]);
  });
});

describe('profileSchema', () => {
  it('geçerli profili kabul eder, hedef atlanabilir', () => {
    expect(profileSchema.safeParse(valid).success).toBe(true);
    expect(profileSchema.safeParse({ ...valid, target: null }).success).toBe(true);
    expect(
      profileSchema.safeParse({ ...valid, target: { kind: 'puan', value: 480.5 } }).success,
    ).toBe(true);
  });

  it('geçersiz değerleri reddeder', () => {
    const bad: unknown[] = [
      { ...valid, birthMonth: 13 },
      { ...valid, field: 'TM' },
      { ...valid, target: { kind: 'puan', value: 600 } },
      { ...valid, target: { kind: 'siralama', value: 0 } },
      { ...valid, target: { kind: 'siralama', value: 12.5 } },
      { ...valid, examDate: '2027-02-30' },
      { ...valid, weekdayMinutes: [0, 0, 0, 0, 0, 0, 0] },
      { ...valid, weekdayMinutes: [45, 60, 60, 60, 60, 60, 60] },
      { ...valid, weekdayMinutes: [60, 60, 60] },
    ];
    for (const value of bad) expect(profileSchema.safeParse(value).success).toBe(false);
  });
});

describe('profileIssues', () => {
  it('geçmiş sınav tarihini ve çok küçük yaşı yakalar', () => {
    expect(profileIssues(valid, today)).toEqual([]);
    expect(profileIssues({ ...valid, examDate: '2026-10-24' }, today)).toEqual(['exam_in_past']);
    expect(profileIssues({ ...valid, birthYear: 2015 }, today)).toEqual(['too_young']);
  });
});

describe('parseTarget', () => {
  it('Türkçe sayı yazımlarını okur', () => {
    expect(parseTarget('siralama', '20.000')).toEqual({ kind: 'siralama', value: 20_000 });
    expect(parseTarget('siralama', ' 150 000 ')).toEqual({ kind: 'siralama', value: 150_000 });
    expect(parseTarget('puan', '450,5')).toEqual({ kind: 'puan', value: 450.5 });
    expect(parseTarget('puan', '480')).toEqual({ kind: 'puan', value: 480 });
  });

  it('geçersiz ya da aralık dışı girişte null', () => {
    for (const [kind, text] of [
      ['siralama', ''],
      ['siralama', 'ilk 1000'],
      ['siralama', '0'],
      ['puan', '99'],
      ['puan', '561'],
      ['puan', '4,5,0'],
    ] as const) {
      expect(parseTarget(kind, text)).toBeNull();
    }
  });
});
