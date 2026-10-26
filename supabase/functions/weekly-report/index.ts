// Haftalık veli raporu (T22, rapor 2.12). Veli hesapsız: istek gövdesindeki rapor linki kodu kimliktir
// (report_link; rıza geri çekilince ya da süre dolunca geçersiz). Rapor o anki veriden hesaplanır ve
// saklanmaz. Sayıları plan motoru üretir (öğrencinin ekranıyla aynı kural); sohbet içeriği hiçbir zaman
// okunmaz ve dönmez.
import { createClient } from '@supabase/supabase-js';
import {
  addDays,
  istanbulDate,
  type ReportBook,
  type ReportTask,
  type UnitKind,
  weeklySummary,
} from '@yks/plan-engine';
import { z } from 'zod';

// Seri için geriye bakılan gün sayısı; daha uzun seri raporda bu sınırda kalır.
const HISTORY_DAYS = 180;

const RequestSchema = z.object({ token: z.string().regex(/^[0-9a-f]{64}$/) });

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

interface CustomEdition {
  title: string;
  units: { kind: UnitKind; first: number; last: number }[];
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });
  const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(404, { error: 'not_found' });

  const db = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    {
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
  const { data: owner, error: ownerError } = await db.rpc('report_owner', {
    p_token: parsed.data.token,
  });
  if (ownerError) return json(500, { error: 'server_error' });
  if (!owner) return json(404, { error: 'not_found' });

  const today = istanbulDate(Date.now());
  const [tasks, items] = await Promise.all([
    db
      .from('plan_task')
      .select(
        'day, status, est_seconds, library_item_id, unit_id, custom_unit_key, range_first, range_last',
      )
      .eq('user_id', owner)
      .is('deleted_at', null)
      .gte('day', addDays(today, -HISTORY_DAYS))
      .lte('day', today),
    db
      .from('library_item')
      .select(
        'id, custom_edition, edition:edition_id(work:work_id(series, subject, exam), unit(page_start, page_end))',
      )
      .eq('user_id', owner)
      .eq('source_kind', 'book')
      .is('deleted_at', null)
      .order('sort_order'),
  ]);
  if (tasks.error || items.error) return json(500, { error: 'server_error' });

  const books: ReportBook[] = items.data.map((item) => {
    const edition = item.edition as unknown as {
      work: { series: string | null; subject: string; exam: string };
      unit: { page_start: number; page_end: number }[];
    } | null;
    if (edition) {
      // apps/mobile editionTitle ile aynı biçim.
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

  const reportTasks: ReportTask[] = tasks.data.map((t) => ({
    day: t.day,
    status: t.status,
    seconds: t.est_seconds,
    libraryItemId: t.library_item_id,
    unitKey: t.unit_id ?? t.custom_unit_key ?? '',
    first: t.range_first,
    last: t.range_last,
  }));

  return json(200, weeklySummary({ today, tasks: reportTasks, books }));
});
