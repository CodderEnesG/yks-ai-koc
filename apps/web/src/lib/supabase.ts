import { createClient } from '@supabase/supabase-js';

// Tarayıcı istemcisi. Veli oturumu (e-posta OTP) tarayıcıda saklanır; veri erişimi yalnız güvenlik
// tanımlı fonksiyonlarla (supabase/migrations/*_consent.sql).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL ve _PUBLISHABLE_KEY apps/web/.env.local içinde olmalı');
}

export const supabase = createClient(url, key);
