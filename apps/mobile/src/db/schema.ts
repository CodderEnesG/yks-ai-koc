import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Uygulama düzeyi anahtar-değer kayıtları (ör. son senkron imleci).
export const appMeta = sqliteTable('app_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});

// Öğrencinin profili (rapor 2.5). Cihazda tek satır; veli onayından önce yalnız burada durur.
// Kimlik cihazda üretilir; senkron alanları (user_id, server_updated_at) T16'da eklenecek.
export const profile = sqliteTable('profile', {
  id: text('id').primaryKey(),
  birthYear: integer('birth_year').notNull(),
  birthMonth: integer('birth_month').notNull(),
  grade: text('grade', { enum: ['11', '12', 'mezun'] }).notNull(),
  field: text('field', { enum: ['SAY', 'EA', 'SOZ', 'DIL'] }).notNull(),
  targetKind: text('target_kind', { enum: ['siralama', 'puan'] }),
  targetValue: real('target_value'),
  examDate: text('exam_date').notNull(),
  /** 7 elemanlı JSON dizi, Pazartesi-Pazar dakika. */
  weekdayMinutes: text('weekday_minutes', { mode: 'json' }).$type<number[]>().notNull(),
  /** 18 yaş altı için veli onayı durumu (rapor 2.11); onay akışı T21'de. */
  consentStatus: text('consent_status', {
    enum: ['not_required', 'pending', 'granted', 'withdrawn'],
  }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});
