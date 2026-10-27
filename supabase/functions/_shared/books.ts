// Öğrencinin kitapları: ad, birim türü ve toplam sayfa/test (weekly-report ve chat ortak kullanır).
// Ad biçimi apps/mobile editionTitle ile aynı. Sorgu service role istemcisiyle, verilen öğrenci için.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ReportBook, UnitKind } from '@yks/plan-engine';

interface CustomEdition {
  title: string;
  units: { kind: UnitKind; first: number; last: number }[];
}

interface CatalogEdition {
  work: { series: string | null; subject: string; exam: string };
  unit: { page_start: number; page_end: number }[];
}

/** Kütüphane sırasıyla kitaplar; hata olursa null. */
export async function loadBooks(db: SupabaseClient, userId: string): Promise<ReportBook[] | null> {
  const { data, error } = await db
    .from('library_item')
    .select(
      'id, custom_edition, edition:edition_id(work:work_id(series, subject, exam), unit(page_start, page_end))',
    )
    .eq('user_id', userId)
    .eq('source_kind', 'book')
    .is('deleted_at', null)
    .order('sort_order');
  if (error) return null;
  return data.map((item) => {
    const edition = item.edition as unknown as CatalogEdition | null;
    if (edition) {
      const w = edition.work;
      return {
        id: item.id,
        title: `${w.series ?? w.subject} · ${w.exam} ${w.subject}`,
        kind: 'pages',
        total: edition.unit.reduce((a, u) => a + u.page_end - u.page_start + 1, 0),
      };
    }
    const custom = item.custom_edition as CustomEdition | null;
    const units = custom?.units ?? [];
    return {
      id: item.id,
      title: custom?.title ?? '',
      kind: units[0]?.kind ?? 'pages',
      total: units.reduce((a, u) => a + u.last - u.first + 1, 0),
    };
  });
}
