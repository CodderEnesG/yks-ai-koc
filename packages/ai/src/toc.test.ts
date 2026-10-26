import { describe, expect, it } from 'vitest';

import { type Toc, TocSchema, validateToc } from './toc.ts';

const toc = (...pages: (number | null)[]): Toc => ({
  birimler: pages.map((sayfa, i) => ({ numara: i + 1, baslik: `Ünite ${i + 1}`, sayfa })),
});

describe('validateToc', () => {
  it('artan ve okunmuş sayfalar sorunsuz', () => {
    expect(validateToc(toc(11, 17, 23), 130)).toEqual([]);
  });

  it('boş, okunmayan, azalan ve kitap dışı sayfayı işaretler', () => {
    expect(validateToc({ birimler: [] })).toEqual([{ index: -1, issue: 'empty' }]);
    expect(validateToc(toc(11, null, 23))).toEqual([{ index: 1, issue: 'missing_page' }]);
    expect(validateToc(toc(11, 35, 35))).toEqual([{ index: 2, issue: 'not_ascending' }]);
    expect(validateToc(toc(11, 140), 130)).toEqual([{ index: 1, issue: 'beyond_book' }]);
  });
});

describe('TocSchema', () => {
  it('model çıktısını doğrular', () => {
    expect(TocSchema.safeParse(toc(11)).success).toBe(true);
    expect(
      TocSchema.safeParse({ birimler: [{ numara: 1, baslik: 'x', sayfa: 'on bir' }] }).success,
    ).toBe(false);
  });
});
