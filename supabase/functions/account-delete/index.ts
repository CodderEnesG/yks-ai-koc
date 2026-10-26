// Hesap ve sunucudaki tüm kişisel veriyi siler (T28, rapor 2.11: talepten sonra en geç 7 gün; burada
// hemen). Kullanıcı tabloları auth.users'a `on delete cascade` ile bağlı (pgTAP: account_delete.test.sql);
// auth kullanıcısını silmek hepsini siler. Rıza kayıtları (T21) bu kuralın bilinçli istisnası olacak.
import { createClient } from '@supabase/supabase-js';

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });
  const authorization = req.headers.get('Authorization');
  if (!authorization) return json(401, { error: 'unauthorized' });

  // Kimlik isteği yapan oturumdan alınır; gövdeden kullanıcı kimliği kabul edilmez.
  const url = Deno.env.get('SUPABASE_URL')!;
  const asUser = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authorization } },
  });
  const { data, error } = await asUser.auth.getUser();
  if (error || !data.user) return json(401, { error: 'unauthorized' });

  const admin = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { error: deleteError } = await admin.auth.admin.deleteUser(data.user.id);
  if (deleteError) {
    console.error('account-delete', deleteError.name);
    return json(500, { error: 'delete_failed' });
  }
  return json(200, { deleted: true });
});
