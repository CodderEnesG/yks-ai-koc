// Cihaz tercihleri (senkronlanmaz): app_meta anahtar-değer.
import { eq } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';

import { db } from '@/db/client';
import { appMeta } from '@/db/schema';

const MORNING_KEY = 'morning_time';
export const MORNING_CHOICES = [
  '06:30',
  '07:00',
  '07:30',
  '08:00',
  '08:30',
  '09:00',
  '10:00',
] as const;
export const DEFAULT_MORNING = '08:00';

export function parseTime(value: string): { hour: number; minute: number } {
  const [hour, minute] = value.split(':').map(Number) as [number, number];
  return { hour, minute };
}

export function readMorningTime(): string {
  const [row] = db.select().from(appMeta).where(eq(appMeta.key, MORNING_KEY)).all();
  return row?.value ?? DEFAULT_MORNING;
}

export function useMorningTime(): string | undefined {
  const { data, updatedAt } = useLiveQuery(
    db.select().from(appMeta).where(eq(appMeta.key, MORNING_KEY)),
  );
  return updatedAt === undefined ? undefined : (data[0]?.value ?? DEFAULT_MORNING);
}

export function setMorningTime(value: string): void {
  db.insert(appMeta)
    .values({ key: MORNING_KEY, value })
    .onConflictDoUpdate({ target: appMeta.key, set: { value } })
    .run();
}
