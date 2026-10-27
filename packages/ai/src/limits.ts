// Sohbet sınırları (rapor 2.9, 2.11). Sunucu ve uygulama aynı değeri kullanır; uygulama yalnız bu dosyayı
// içe aktarır (`@yks/ai/limits`), istemler ve PII ayıklayıcı telefona girmez.
/** Günde 60 mesaj, mesaj başına 1.000 karakter. */
export const CHAT_DAILY_LIMIT = 60;
export const CHAT_MAX_LENGTH = 1000;
/** Bağlama giren son mesaj sayısı (iki taraf birlikte). */
export const CHAT_HISTORY_MESSAGES = 10;
/** Sohbet mesajları 90 günlük kayan pencerede tutulur. */
export const CHAT_RETENTION_DAYS = 90;
