import { supabase } from '@/lib/supabase';

import type { CatalogEdition } from './rules';

// Katalog küçük (MVP'de ≈35-250 baskı): liste bir kez çekilir, arama cihazda Türkçe katlamayla yapılır
// (Postgres ilike İ/ı ayrımını doğru yapmıyor).
let cache: Promise<CatalogEdition[]> | null = null;

export function fetchCatalog(): Promise<CatalogEdition[]> {
  cache ??= (async () => {
    const { data, error } = await supabase
      .from('edition')
      .select('id, isbn, page_count, work:work_id!inner(publisher, series, subject, exam)');
    if (error) throw error;
    return data.map((row) => {
      const work = row.work as unknown as Omit<CatalogEdition, 'id' | 'isbn' | 'pageCount'>;
      return { id: row.id, isbn: row.isbn, pageCount: row.page_count, ...work };
    });
  })().catch((error: unknown) => {
    cache = null;
    throw error;
  });
  return cache;
}

export async function fetchUnits(editionId: string) {
  const { data, error } = await supabase
    .from('unit')
    .select('id, seq, page_start, page_end')
    .eq('edition_id', editionId)
    .order('seq');
  if (error) throw error;
  return data.map((u) => ({ id: u.id, seq: u.seq, pageStart: u.page_start, pageEnd: u.page_end }));
}
