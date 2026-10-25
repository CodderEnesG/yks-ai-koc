// Kütüphanenin saf kuralları (T10): ISBN, katalog araması, hızlı ekle ve süre varsayılanları.
import { z } from 'zod';

/**
 * Barkoddan ya da elle girilen ISBN'i 13 haneye çevirir; sağlama toplamı tutmuyorsa null.
 * ISBN-10 da kabul edilir (eski kitaplar), 978 önekiyle 13 haneye çevrilir.
 */
export function normalizeIsbn(raw: string): string | null {
  const s = raw.replace(/[\s-]/g, '').toUpperCase();
  if (/^\d{13}$/.test(s)) {
    const sum = [...s].reduce((a, c, i) => a + Number(c) * (i % 2 === 0 ? 1 : 3), 0);
    return sum % 10 === 0 ? s : null;
  }
  if (/^\d{9}[\dX]$/.test(s)) {
    const sum = [...s].reduce((a, c, i) => a + (c === 'X' ? 10 : Number(c)) * (10 - i), 0);
    if (sum % 11 !== 0) return null;
    const body = `978${s.slice(0, 9)}`;
    const check =
      (10 - ([...body].reduce((a, c, i) => a + Number(c) * (i % 2 === 0 ? 1 : 3), 0) % 10)) % 10;
    return `${body}${check}`;
  }
  return null;
}

/** Arama için Türkçe katlama: büyük/küçük harf ve ş/ç/ğ/ı/ö/ü farkı yok ("turkce" → "Türkçe"). */
export function foldTurkish(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .replace(
      /[şçğıöüâîû]/g,
      (c) => ({ ş: 's', ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ü: 'u', â: 'a', î: 'i', û: 'u' })[c]!,
    )
    .replace(/\s+/g, ' ')
    .trim();
}

export interface CatalogEdition {
  id: string;
  isbn: string | null;
  pageCount: number;
  publisher: string;
  series: string | null;
  subject: string;
  exam: 'TYT' | 'AYT' | 'YDT';
}

export function editionTitle(e: Pick<CatalogEdition, 'series' | 'subject' | 'exam'>): string {
  return `${e.series ?? e.subject} · ${e.exam} ${e.subject}`;
}

/**
 * Katalogda arar: ISBN girilirse eşleşen baskılar (takım ISBN'inde birden çok ders çıkar), yoksa her
 * kelimesi yayınevi, seri, ders ya da sınavda geçen baskılar. Sıra: sınav, ders, seri.
 */
export function searchCatalog(
  editions: readonly CatalogEdition[],
  query: string,
): CatalogEdition[] {
  const isbn = normalizeIsbn(query);
  const matches = isbn
    ? editions.filter((e) => e.isbn === isbn)
    : (() => {
        const words = foldTurkish(query).split(' ').filter(Boolean);
        if (words.length === 0) return [];
        return editions.filter((e) => {
          const haystack = foldTurkish(`${e.publisher} ${e.series ?? ''} ${e.subject} ${e.exam}`);
          return words.every((w) => haystack.includes(w));
        });
      })();
  const order = { TYT: 0, AYT: 1, YDT: 2 };
  return [...matches].sort(
    (a, b) =>
      order[a.exam] - order[b.exam] ||
      a.subject.localeCompare(b.subject, 'tr') ||
      (a.series ?? '').localeCompare(b.series ?? '', 'tr'),
  );
}

export type ItemKind = 'pages' | 'tests';

// Sayfa ve test başına süre tahmini. Ürün belgelerinde tanımlı değil (NOT DEFINED); öğrenci ekleme
// sırasında değiştirir. Ocak'ta gerçek tamamlamalardan öğrenilecek (rapor 1.2).
export const MINUTE_CHOICES: Record<ItemKind, readonly number[]> = {
  pages: [2, 3, 5, 8],
  tests: [10, 15, 20, 30],
};
export const DEFAULT_MINUTES: Record<ItemKind, number> = { pages: 3, tests: 15 };

/** "Hızlı ekle": ad ve toplam sayfa ya da test sayısı; tek birim olarak saklanır (rapor 2.8). */
export const quickAddSchema = z.object({
  title: z.string().trim().min(2).max(80),
  kind: z.enum(['pages', 'tests']),
  count: z.number().int().min(1).max(2000),
  minutesPerItem: z.number().positive().max(240),
});
export type QuickAdd = z.infer<typeof quickAddSchema>;

/** Cihazdaki özel baskı biçimi (sunucuda library_item.custom_edition). */
export interface CustomEdition {
  title: string;
  units: { key: string; kind: ItemKind; first: number; last: number }[];
}

export function quickAddEdition(input: QuickAdd): CustomEdition {
  return {
    title: input.title.trim(),
    units: [{ key: '1', kind: input.kind, first: 1, last: input.count }],
  };
}
