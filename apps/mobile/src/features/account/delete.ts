// Hesap ve veri silme (T28; Apple zorunluluğu, rapor 2.11). Önce sunucu: hesap bağlıysa account-delete
// auth kullanıcısını siler, kişisel tablolar cascade ile gider. Sunucu başarısızsa cihazda hiçbir şey
// silinmez (öğrenci tekrar dener). Sonra cihaz: kişisel tablolar, ayarlar ve bildirimler. Katalog önbelleği
// kişisel değil, kalır.
import * as Notifications from 'expo-notifications';

import { db } from '@/db/client';
import { appMeta, checkin, libraryItem, planTask, profile } from '@/db/schema';
import { useOnboarding } from '@/features/onboarding/store';
import { supabase } from '@/lib/supabase';

export async function deleteAccountAndData(): Promise<void> {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    const { error } = await supabase.functions.invoke('account-delete', { method: 'POST' });
    if (error) throw error;
    // Kullanıcı sunucuda yok; yalnız cihazdaki oturumu kapat.
    await supabase.auth.signOut({ scope: 'local' });
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
  db.transaction((tx) => {
    tx.delete(checkin).run();
    tx.delete(planTask).run();
    tx.delete(libraryItem).run();
    tx.delete(profile).run();
    tx.delete(appMeta).run();
  });
  useOnboarding.getState().reset();
}
