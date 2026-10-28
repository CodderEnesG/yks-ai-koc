-- Geri bildirim toplama (T numarası almadı; karar: lamba-design DECISIONS.md ve PROJECT-STATE
-- "Owner kararları", 2026-10-28). Özel bir panel ekranı yok: yanıtlar burada toplanır, ekip
-- Supabase Studio'nun tablo görünümünden okur. Uygulama tarafı tasarımı lamba-design'da
-- (src/feedback/FeedbackScreens.tsx): FeedbackSheet (yıldız/metin/anket, "scope" ile kapsam) ve
-- InlineFeedback (bölüm bazlı mikro geri bildirim, bu tabloya aynı şekilde yazar).
--
-- Kurallar:
-- * Yalnız girişli ve onaylı kullanıcı kendi satırını ekler (değişmez kural: 18 altı onaysız
--   kullanıcının verisi sunucuya gitmez). Okuma, güncelleme, silme istemciye kapalı; gönderilen
--   yanıt değiştirilemez (chat_message'taki "bildir" gibi sonradan işaretlenmez).
-- * Saklama günlük temizliğe (run_retention) eklenmedi: ürün geri bildirimi, checkin/library_item
--   gibi hesap silinene kadar kalır (cascade).
create table public.feedback_response (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  scope text not null check (char_length(scope) between 1 and 60),
  kind text not null check (kind in ('rating', 'text', 'poll')),
  question text not null check (char_length(question) between 1 and 300),
  value text not null check (char_length(value) between 1 and 1000),
  app_version text,
  created_at timestamptz not null default now(),
  check (kind <> 'rating' or value ~ '^[1-5]$')
);
create index feedback_response_scope_idx on public.feedback_response (scope, created_at desc);

alter table public.feedback_response enable row level security;
revoke all on public.feedback_response from anon, authenticated;
grant insert on public.feedback_response to authenticated;

create policy feedback_response_insert_own on public.feedback_response for insert to authenticated
  with check ((select auth.uid()) = user_id);
-- İkinci katman: içerik kuralından bağımsız, consent olmadan satır hiç yazılamaz (profile/library_item'daki
-- kalıpla aynı).
create policy feedback_response_consent_insert on public.feedback_response as restrictive for insert to authenticated
  with check (public.my_consent_ok());
