// MEB OGM kitaplarından katalog tohumu üretir (T12'nin ilk parçası): eser, baskı ve birimler.
// Değişmez kural: paylaşılan katalogda ham başlık metni tutulmaz; yalnız olgular (ISBN, sayfa sayısı,
// birimlerin sayfa aralıkları) girer. Konu eşlemesi taksonomi gelince eklenecek.
//
// Kullanım (kök dizinden): node tools/toc-eval/catalog-seed.ts > supabase/migrations/<zaman>_catalog_seed_meb.sql
// Girdi: data-private/meb-ogm/truth.json (extract-truth.ts), tools/toc-eval/meb-ogm-sources.json

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

interface TruthBook {
  id: string;
  seri: string;
  sinav: string;
  ders: string;
  pdfSayfa: number;
  pdfKaymasi: number | null;
  isbn: string | null;
  birimler: { sira: number; sayfaBas: number; sayfaSon: number }[];
  sorunlar: string[];
}

// Tekrar üretildiğinde aynı kimlikler çıksın: kaynak kimliğinden türetilmiş UUID.
function stableUuid(key: string): string {
  const h = createHash('md5').update(`yks-catalog:${key}`).digest('hex');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-8${h.slice(17, 20)}-${h.slice(20, 32)}`;
}

/** ISBN-13 sağlama toplamı tutmuyorsa null (ör. metin katmanından eksik okunmuş ISBN). */
function normalizeIsbn(raw: string | null): string | null {
  const digits = raw?.replace(/[^0-9X]/gi, '').toUpperCase() ?? '';
  if (digits.length !== 13) return null;
  const sum = [...digits].reduce((a, c, i) => a + Number(c) * (i % 2 === 0 ? 1 : 3), 0);
  return sum % 10 === 0 ? digits : null;
}

const quote = (value: string | number | null) =>
  value === null
    ? 'null'
    : typeof value === 'number'
      ? String(value)
      : `'${value.replace(/'/g, "''")}'`;

const truth = JSON.parse(readFileSync('data-private/meb-ogm/truth.json', 'utf8')) as TruthBook[];
const lines: string[] = [
  '-- MEB OGM katalog tohumu (T12, ilk parça). tools/toc-eval/catalog-seed.ts ile üretildi; elle düzenlenmez.',
  '-- Yalnız olgular: ISBN, sayfa sayısı, birim sayfa aralıkları. Ham başlık yok (değişmez kural).',
  '-- Baskılar "draft": otomatik çıkarıldı, editör doğrulaması bekliyor.',
];
const skipped: string[] = [];

for (const book of truth) {
  if (book.sorunlar.length > 0 || book.birimler.length === 0 || book.pdfKaymasi === null) {
    skipped.push(book.id);
    continue;
  }
  const workId = stableUuid(`work:${book.id}`);
  const editionId = stableUuid(`edition:${book.id}`);
  const exam = book.sinav as 'TYT' | 'AYT' | 'YDT';
  const lastPrinted = book.pdfSayfa - book.pdfKaymasi;
  lines.push(
    '',
    `-- ${book.id}`,
    `insert into public.work (id, publisher, series, subject, exam, kind) values (${quote(workId)}, 'MEB OGM', ${quote(book.seri)}, ${quote(book.ders)}, ${quote(exam)}, 'soru_bankasi');`,
    `insert into public.edition (id, work_id, isbn, print_year, page_count, curriculum, source, status) values (${quote(editionId)}, ${quote(workId)}, ${quote(normalizeIsbn(book.isbn))}, null, ${lastPrinted}, 'MEB-2027', 'meb-ogm', 'draft');`,
    'insert into public.unit (id, edition_id, seq, page_start, page_end) values',
    book.birimler
      .map(
        (u) =>
          `  (${quote(stableUuid(`unit:${book.id}:${u.sira}`))}, ${quote(editionId)}, ${u.sira}, ${u.sayfaBas}, ${Math.max(u.sayfaBas, u.sayfaSon)})`,
      )
      .join(',\n') + ';',
  );
}

if (skipped.length > 0) lines.splice(3, 0, `-- Atlanan (çıkarma sorunu): ${skipped.join(', ')}`);
console.log(lines.join('\n'));
