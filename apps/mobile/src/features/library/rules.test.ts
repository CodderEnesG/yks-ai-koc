import { describe, expect, it } from 'vitest';

import {
  type CatalogEdition,
  editionFromToc,
  foldTurkish,
  normalizeIsbn,
  quickAddEdition,
  quickAddSchema,
  searchCatalog,
} from './rules';

describe('normalizeIsbn', () => {
  it('ISBN-13 ve tireli yazımı kabul eder, sağlama toplamını denetler', () => {
    expect(normalizeIsbn('978-975-11-5998-4')).toBe('9789751159984');
    expect(normalizeIsbn('9789751159984')).toBe('9789751159984');
    expect(normalizeIsbn('9789751159985')).toBeNull();
    expect(normalizeIsbn('978975117263')).toBeNull(); // eksik hane
  });

  it("ISBN-10'u 978 önekiyle 13 haneye çevirir", () => {
    expect(normalizeIsbn('0-306-40615-2')).toBe('9780306406157');
    expect(normalizeIsbn('080442957X')).toBe('9780804429573');
    expect(normalizeIsbn('0306406153')).toBeNull();
  });
});

describe('foldTurkish', () => {
  it('büyük/küçük harf ve Türkçe karakter farkını kaldırır', () => {
    expect(foldTurkish('Türk Dili ve Edebiyatı')).toBe('turk dili ve edebiyati');
    expect(foldTurkish('İNGİLİZCE')).toBe('ingilizce');
    expect(foldTurkish('  Coğrafya   AYT ')).toBe('cografya ayt');
  });
});

describe('searchCatalog', () => {
  const e = (
    id: string,
    subject: string,
    exam: CatalogEdition['exam'],
    isbn: string | null,
    series = '3 Adım Soru Bankası',
  ) =>
    ({
      id,
      isbn,
      pageCount: 130,
      publisher: 'MEB OGM',
      series,
      subject,
      exam,
    }) satisfies CatalogEdition;
  const catalog = [
    e('1', 'Tarih', 'TYT', '9789751159984'),
    e('2', 'Coğrafya', 'TYT', '9789751159984'),
    e('3', 'Tarih', 'AYT', '9789751160003'),
    e('4', 'Türk Dili ve Edebiyatı', 'AYT', null, 'Dört Dörtlük Konu Pekiştirme Testleri'),
  ];

  it("takım ISBN'inde tüm dersleri döndürür", () => {
    expect(searchCatalog(catalog, '978-975-11-5998-4').map((x) => x.id)).toEqual(['2', '1']);
  });

  it('kelimelerle ve Türkçe karakter olmadan arar', () => {
    expect(searchCatalog(catalog, 'tarih').map((x) => x.id)).toEqual(['1', '3']);
    expect(searchCatalog(catalog, 'ayt tarih').map((x) => x.id)).toEqual(['3']);
    expect(searchCatalog(catalog, 'edebiyat pekistirme').map((x) => x.id)).toEqual(['4']);
    expect(searchCatalog(catalog, '  ')).toEqual([]);
  });
});

describe('quickAdd', () => {
  it('tek birimlik özel baskı üretir', () => {
    const input = quickAddSchema.parse({
      title: ' Yayınevi X Fizik ',
      kind: 'tests',
      count: 40,
      minutesPerItem: 15,
    });
    expect(quickAddEdition(input)).toEqual({
      title: 'Yayınevi X Fizik',
      units: [{ key: '1', kind: 'tests', first: 1, last: 40 }],
    });
  });

  it('geçersiz girişi reddeder', () => {
    for (const bad of [
      { title: 'X', kind: 'pages', count: 10, minutesPerItem: 3 },
      { title: 'Kitap', kind: 'pages', count: 0, minutesPerItem: 3 },
      { title: 'Kitap', kind: 'videos', count: 10, minutesPerItem: 3 },
    ]) {
      expect(quickAddSchema.safeParse(bad).success).toBe(false);
    }
  });
});

describe('editionFromToc', () => {
  const rows = [
    { title: 'Tarih ve Zaman', start: '11' },
    { title: 'İlk Türk Devletleri', start: '17' },
    { title: 'İslamiyet', start: '23' },
  ];

  it('artan sayfalardan birimler; son birim kitabın son sayfasında biter', () => {
    const r = editionFromToc(' 3 Adım TYT Tarih ', rows, 125);
    expect(r.edition?.title).toBe('3 Adım TYT Tarih');
    expect(r.edition?.units.map((u) => [u.first, u.last])).toEqual([
      [11, 16],
      [17, 22],
      [23, 125],
    ]);
    expect(r.edition?.units[1]!.title).toBe('İlk Türk Devletleri');
  });

  it('boş, azalan ve son sayfa sorunlarını satır bazında döner', () => {
    expect(
      editionFromToc('Kitap', [{ title: 'A', start: '' }, ...rows.slice(1)], 125).issues,
    ).toEqual([{ index: 0, issue: 'missing' }]);
    expect(editionFromToc('Kitap', [rows[0]!, { title: 'B', start: '11' }], 125).issues).toEqual([
      { index: 1, issue: 'not_ascending' },
    ]);
    expect(editionFromToc('Kitap', rows, 20).issues).toEqual([{ index: 3, issue: 'missing' }]);
    expect(editionFromToc('K', rows, 125).edition).toBeNull();
  });
});
