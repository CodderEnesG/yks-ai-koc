import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';

import type { CustomEdition } from '@/features/library/rules';

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

// Katalogdan eklenen baskının cihazdaki kopyası: plan motoru çevrimdışı çalışsın diye birimler de burada.
export const catalogEdition = sqliteTable('catalog_edition', {
  id: text('id').primaryKey(),
  isbn: text('isbn'),
  pageCount: integer('page_count').notNull(),
  publisher: text('publisher').notNull(),
  series: text('series'),
  subject: text('subject').notNull(),
  exam: text('exam', { enum: ['TYT', 'AYT', 'YDT'] }).notNull(),
  /** [{ id, seq, pageStart, pageEnd }] — katalogda ham başlık yok. */
  units: text('units', { mode: 'json' })
    .$type<{ id: string; seq: number; pageStart: number; pageEnd: number }[]>()
    .notNull(),
  fetchedAt: text('fetched_at').notNull(),
});

// Öğrencinin kaynakları (sunucuda library_item). T10'da yalnız kitap; oynatma listesi T31'de.
export const libraryItem = sqliteTable('library_item', {
  id: text('id').primaryKey(),
  sourceKind: text('source_kind', { enum: ['book', 'playlist'] }).notNull(),
  editionId: text('edition_id'),
  /** Özel baskı ("hızlı ekle" ya da içindekiler fotoğrafı); yalnız bu öğrenciye ait. */
  customEdition: text('custom_edition', { mode: 'json' }).$type<CustomEdition>(),
  minutesPerItem: real('minutes_per_item'),
  sortOrder: integer('sort_order').notNull(),
  priority: integer('priority').notNull().default(0),
  status: text('status', { enum: ['active', 'paused', 'done'] }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
});
