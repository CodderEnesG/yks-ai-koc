import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// Uygulama düzeyi anahtar-değer kayıtları (ör. son senkron imleci). Kullanıcı tabloları T03/T16'da gelir.
export const appMeta = sqliteTable('app_meta', {
  key: text('key').primaryKey(),
  value: text('value').notNull(),
});
