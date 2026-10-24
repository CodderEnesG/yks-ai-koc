// Kurulum akışının saf kuralları. Ekranlardan bağımsız; vitest ile test edilir.
import { type CivilDate, diffDays, parseCivilDate } from '@yks/plan-engine';
import { z } from 'zod';

export const GRADES = ['11', '12', 'mezun'] as const;
export type Grade = (typeof GRADES)[number];

export const FIELDS = ['SAY', 'EA', 'SOZ', 'DIL'] as const;
export type Field = (typeof FIELDS)[number];

export const TARGET_KINDS = ['siralama', 'puan'] as const;
export type TargetKind = (typeof TARGET_KINDS)[number];

// YKS tarihleri tahmindir (rapor 3.3: 19 Haziran 2027). ÖSYM takvimi (≈14 Kasım) açıklanınca
// yalnız bu liste güncellenir. Sıralı olmalı.
export const ESTIMATED_YKS_DATES: readonly CivilDate[] = [
  parseCivilDate('2027-06-19'),
  parseCivilDate('2028-06-17'),
];

/** Sınıfa göre tahmini sınav tarihi: 12. sınıf ve mezun ilk sınava, 11. sınıf bir sonrakine girer. */
export function defaultExamDate(grade: Grade, today: CivilDate): CivilDate | null {
  const upcoming = ESTIMATED_YKS_DATES.filter((d) => diffDays(d, today) > 0);
  return (grade === '11' ? upcoming[1] : upcoming[0]) ?? null;
}

const ADULT_MONTHS = 18 * 12;

/**
 * Doğum günü bilinmediği için doğum ayı içinde öğrenci reşit olmayan sayılır (KVKK: belirsizlikte
 * koruyucu taraf). 18 yaşına girdiği ayın ertesi ayından itibaren reşit.
 */
export function isMinor(birthYear: number, birthMonth: number, today: CivilDate): boolean {
  const [year, month] = today.split('-').map(Number) as [number, number];
  const monthsSinceBirth = (year - birthYear) * 12 + (month - birthMonth);
  return monthsSinceBirth <= ADULT_MONTHS;
}

/** Pazartesi-Cuma hafta içi, Cumartesi-Pazar hafta sonu; `weekdayMinutes` sırasıyla. */
export function splitWeek(weekday: number, weekend: number): number[] {
  return [weekday, weekday, weekday, weekday, weekday, weekend, weekend];
}

export const MINUTE_STEP = 30;
export const MAX_DAY_MINUTES = 12 * 60;

const civilDate = z.string().refine(
  (value) => {
    try {
      parseCivilDate(value);
      return true;
    } catch {
      return false;
    }
  },
  { message: 'Geçersiz tarih' },
);

export const targetSchema = z.discriminatedUnion('kind', [
  // Türkiye sıralamaları milyonlarca; 3 milyon üst sınırı yanlış girişi yakalamak için.
  z.object({ kind: z.literal('siralama'), value: z.number().int().min(1).max(3_000_000) }),
  // YKS yerleştirme puanları 100-560 arasında.
  z.object({ kind: z.literal('puan'), value: z.number().min(100).max(560) }),
]);

export type Target = z.infer<typeof targetSchema>;

/**
 * Öğrencinin yazdığı hedefi okur. Sıralamada nokta ve boşluk binlik ayırıcıdır ("20.000"),
 * puanda virgül ondalık ayırıcıdır ("450,5"). Geçersizse null.
 */
export function parseTarget(kind: TargetKind, text: string): Target | null {
  const cleaned =
    kind === 'siralama' ? text.replace(/[.\s]/g, '') : text.replace(/\s/g, '').replace(',', '.');
  if (!/^\d+(\.\d+)?$/.test(cleaned)) return null;
  const parsed = targetSchema.safeParse({ kind, value: Number(cleaned) });
  return parsed.success ? parsed.data : null;
}

export const profileSchema = z.object({
  birthYear: z.number().int().min(1950),
  birthMonth: z.number().int().min(1).max(12),
  grade: z.enum(GRADES),
  field: z.enum(FIELDS),
  target: targetSchema.nullable(),
  examDate: civilDate,
  weekdayMinutes: z
    .array(z.number().int().min(0).max(MAX_DAY_MINUTES).multipleOf(MINUTE_STEP))
    .length(7)
    .refine((days) => days.some((m) => m > 0), { message: 'En az bir gün çalışma süresi gir' }),
});

export type ProfileInput = z.infer<typeof profileSchema>;

export type ProfileIssue = 'exam_in_past' | 'too_young';

/** Bugüne bağlı kontroller (şemaya girmez): sınav ileride olmalı, yaş YKS için makul olmalı. */
export function profileIssues(profile: ProfileInput, today: CivilDate): ProfileIssue[] {
  const issues: ProfileIssue[] = [];
  if (diffDays(parseCivilDate(profile.examDate), today) <= 0) issues.push('exam_in_past');
  const [year] = today.split('-').map(Number) as [number];
  if (year - profile.birthYear < 13) issues.push('too_young');
  return issues;
}
