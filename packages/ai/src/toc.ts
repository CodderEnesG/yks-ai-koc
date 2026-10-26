// İçindekiler sayfası okuma (rapor 2.8, 2.9): istem ve çıktı şeması. T05 ölçüm aracı (tools/toc-eval) ve
// Edge Function `toc-extract` aynı istem ve şemayı kullanır; ölçülen ile üretimde çalışan aynı kalır.
import { z } from 'zod';

export const TOC_MODEL = 'claude-haiku-5-5';

export const TocSchema = z.object({
  birimler: z.array(
    z.object({
      numara: z.number().int().nullable(),
      baslik: z.string(),
      sayfa: z.number().int().nullable(),
    }),
  ),
});
export type Toc = z.infer<typeof TocSchema>;

export const TOC_PROMPT = `Bu görüntü bir YKS hazırlık kitabının içindekiler sayfası.
Her birim (ünite, konu, test) satırını sayfadaki sırasıyla çıkar:
- numara: satırın başındaki basılı numara; numara yoksa null
- baslik: başlığı sayfada yazdığı gibi, Türkçe karakterleri koruyarak
- sayfa: satırın sonundaki başlangıç sayfa numarası; okunmuyorsa null, tahmin etme
"Cevap Anahtarı", "Kaynakça", "Sözlük" gibi birim olmayan satırları alma.`;

export type TocIssue = 'empty' | 'missing_page' | 'not_ascending' | 'beyond_book';

/**
 * Kod doğrulaması (rapor 2.8): sayfalar okunmuş ve artan sırada mı, son sayfa kitabın sayfa sayısını
 * aşıyor mu. Model çıktısı düzeltilmez; sorunlar öğrencinin onay ekranında gösterilir.
 */
export function validateToc(toc: Toc, pageCount?: number): { index: number; issue: TocIssue }[] {
  if (toc.birimler.length === 0) return [{ index: -1, issue: 'empty' }];
  const issues: { index: number; issue: TocIssue }[] = [];
  let previous = 0;
  toc.birimler.forEach((u, index) => {
    if (u.sayfa === null) issues.push({ index, issue: 'missing_page' });
    else {
      if (u.sayfa <= previous) issues.push({ index, issue: 'not_ascending' });
      if (pageCount !== undefined && u.sayfa > pageCount)
        issues.push({ index, issue: 'beyond_book' });
      previous = u.sayfa;
    }
  });
  return issues;
}
