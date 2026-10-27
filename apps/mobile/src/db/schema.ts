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
  /** YouTube oynatma listesi (T31); videolar `ytPlaylist`'te. */
  ytPlaylistId: text('yt_playlist_id'),
  /** Video izleme hızı (1, 1,25, 1,5, 2) ve not payı (0-1); yalnız listede. */
  watchSpeed: real('watch_speed'),
  noteRatio: real('note_ratio'),
  minutesPerItem: real('minutes_per_item'),
  sortOrder: integer('sort_order').notNull(),
  priority: integer('priority').notNull().default(0),
  status: text('status', { enum: ['active', 'paused', 'done'] }).notNull(),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
});

// Plan motorunun ürettiği günlük görevler (sunucuda plan_task). Cihazda yalnız bugün ve geçmiş günler
// saklanır; gelecek her açılışta hesaplanır. Geçmiş görevler değişmez (rapor 2.6).
export const planTask = sqliteTable('plan_task', {
  id: text('id').primaryKey(),
  libraryItemId: text('library_item_id').notNull(),
  day: text('day').notNull(),
  kind: text('kind', { enum: ['pages', 'tests', 'video'] }).notNull(),
  /** Katalog birim kimliği ya da özel baskıdaki birim anahtarı. */
  unitKey: text('unit_key').notNull(),
  rangeFirst: integer('range_first').notNull(),
  rangeLast: integer('range_last').notNull(),
  estSeconds: integer('est_seconds').notNull(),
  status: text('status', { enum: ['planned', 'done', 'partial', 'skipped'] }).notNull(),
  reason: text('reason', { enum: ['zaman_yetmedi', 'konu_zor', 'isteksiz', 'kotu_hissediyorum'] }),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at'),
});

// Akşam check-in'inin gün özeti (sunucuda checkin). Görev bazlı durum ve neden plan_task'ta.
export const checkin = sqliteTable('checkin', {
  id: text('id').primaryKey(),
  day: text('day').notNull().unique(),
  correctCount: integer('correct_count'),
  wrongCount: integer('wrong_count'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
});

// Koç sohbeti (T20). Ekran bu kopyayı gösterir; sunucudaki kopya koçun bağlamı ve güvenlik incelemesi
// için (chat_message, 90 gün). Senkronlanmaz: yeni telefonda sohbet geçmişi gelmez.
export const chatMessage = sqliteTable('chat_message', {
  id: text('id').primaryKey(),
  role: text('role', { enum: ['user', 'assistant'] }).notNull(),
  content: text('content').notNull(),
  /** Öğrenci mesajı: gönderiliyor, gönderildi ya da gönderilemedi. */
  status: text('status', { enum: ['sending', 'sent', 'failed'] }).notNull(),
  /** Koç yanıtının nasıl üretildiği (sunucudaki action). */
  action: text('action', {
    enum: ['reply', 'check', 'support', 'fixed', 'unavailable', 'replaced'],
  }),
  createdAt: text('created_at').notNull(),
  reportedAt: text('reported_at'),
});

// YouTube oynatma listesinin cihazdaki kopyası (T31). API verisi: en fazla 30 gün (YouTube API Hizmetleri
// III.E.4); 25 günü geçince yenilenir, yenilenemezse 30. günde silinir (T34). Senkronlanmaz.
export const ytPlaylist = sqliteTable('yt_playlist', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  channelTitle: text('channel_title').notNull(),
  videos: text('videos', { mode: 'json' })
    .$type<
      {
        videoId: string;
        title: string;
        channelTitle: string;
        durationSeconds: number;
        embeddable: boolean;
        madeForKids: boolean;
      }[]
    >()
    .notNull(),
  fetchedAt: text('fetched_at').notNull(),
});
