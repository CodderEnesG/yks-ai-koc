// Haftalık veli raporu linki (T22). Rapor sunucuda, link açıldığında o anki yedekten hesaplanır; bu yüzden
// link istenmeden önce bekleyen değişiklikler gönderilir.
import { webLink } from '@/features/consent/consent';
import { push } from '@/features/sync/sync';
import { supabase } from '@/lib/supabase';

/** Rapor linki; veli rapora rıza vermediyse null. */
export async function reportLink(): Promise<string | null> {
  await push().catch(() => undefined);
  const { data, error } = await supabase.rpc('my_report_link');
  if (error) throw error;
  return typeof data === 'string' ? webLink(`/rapor/${data}`) : null;
}
