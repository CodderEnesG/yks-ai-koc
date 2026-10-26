import 'expo-sqlite/localStorage/install';

import { createClient } from '@supabase/supabase-js';
import { AppState } from 'react-native';

// Katalog okuması onaydan önce de yapılır (kişisel veri yok; rapor 2.11). Oturum yalnız onay gerekmeyen
// ya da onay veren öğrencide açılır (T16); 18 yaş altında onaydan önce giriş ekranı gösterilmez.
const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key)
  throw new Error('EXPO_PUBLIC_SUPABASE_URL ve _PUBLISHABLE_KEY apps/mobile/.env içinde olmalı');

export const supabase = createClient(url, key, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

// Uygulama arka plandayken oturum yenileme durur (Supabase + Expo önerisi).
AppState.addEventListener('change', (state) => {
  if (state === 'active') supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});
