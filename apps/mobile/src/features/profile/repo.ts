import { type CivilDate } from '@yks/plan-engine';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';
import { randomUUID } from 'expo-crypto';

import { db } from '@/db/client';
import { profile } from '@/db/schema';
import { isMinor, type ProfileInput } from '@/features/onboarding/rules';

export type Profile = typeof profile.$inferSelect;

/** Cihazdaki profil; `undefined` henüz yükleniyor, `null` kurulum yapılmamış. */
export function useProfile(): Profile | null | undefined {
  const { data, updatedAt } = useLiveQuery(db.select().from(profile).limit(1));
  if (updatedAt === undefined) return undefined;
  return data[0] ?? null;
}

export function saveProfile(input: ProfileInput, today: CivilDate, now: Date): void {
  const timestamp = now.toISOString();
  db.transaction((tx) => {
    tx.delete(profile).run();
    tx.insert(profile)
      .values({
        id: randomUUID(),
        birthYear: input.birthYear,
        birthMonth: input.birthMonth,
        grade: input.grade,
        field: input.field,
        targetKind: input.target?.kind ?? null,
        targetValue: input.target?.value ?? null,
        examDate: input.examDate,
        weekdayMinutes: input.weekdayMinutes,
        consentStatus: isMinor(input.birthYear, input.birthMonth, today)
          ? 'pending'
          : 'not_required',
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .run();
  });
}

/** Yalnız geliştirmede: kurulumu baştan denemek için. */
export function deleteProfile(): void {
  db.delete(profile).run();
}
