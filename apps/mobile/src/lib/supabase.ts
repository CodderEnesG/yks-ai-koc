import { createClient } from '@supabase/supabase-js';

// Şimdilik yalnız katalog okuması (herkese açık, kişisel veri yok; rapor 2.11 onay öncesine izin verir).
// Oturum, senkron ve onay öncesi çağrı yasağı T16'da: o zamana kadar oturum saklanmaz.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key)
  throw new Error('EXPO_PUBLIC_SUPABASE_URL ve _PUBLISHABLE_KEY apps/mobile/.env içinde olmalı');

export const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
});
