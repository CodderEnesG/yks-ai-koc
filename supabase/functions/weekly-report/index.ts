// Haftalık veli raporu (T22, rapor 2.12). Veli hesapsız: istek gövdesindeki rapor linki kodu kimliktir
// (report_link; rıza geri çekilince ya da süre dolunca geçersiz). Rapor o anki veriden hesaplanır ve
// saklanmaz. Sayıları plan motoru üretir (öğrencinin ekranıyla aynı kural); sohbet içeriği hiçbir zaman
// okunmaz ve dönmez.
import { createClient } from '@supabase/supabase-js';
import { addDays, istanbulDate, type ReportTask, weeklySummary } from '@yks/plan-engine';
import { z } from 'zod';

import { loadBooks } from '../_shared/books.ts';

// Seri için geriye bakılan gün sayısı; daha uzun seri raporda bu sınırda kalır.
const HISTORY_DAYS = 180;

const RequestSchema = z.object({ token: z.string().regex(/^[0-9a-f]{64}$/) });

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

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
  const [tasks, books] = await Promise.all([
    db
      .from('plan_task')
      .select(
        'day, status, est_seconds, library_item_id, unit_id, custom_unit_key, range_first, range_last',
      )
      .eq('user_id', owner)
      .is('deleted_at', null)
      .gte('day', addDays(today, -HISTORY_DAYS))
      .lte('day', today),
    loadBooks(db, owner),
  ]);
  if (tasks.error || !books) return json(500, { error: 'server_error' });

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
