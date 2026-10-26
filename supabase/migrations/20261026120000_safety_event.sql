-- Güvenlik olay kaydı (T18, rapor 2.5 ve 2.10 katman 7). Riskli bulunan her öğrenci mesajı için bir satır:
-- seviye, kategori, riski kimin gördüğü, alınan aksiyon. Mesaj metni burada tutulmaz; sohbet mesajı T17'de
-- `chat_message`'ta, olay `message_id` ile ona bağlanır (yabancı anahtar T17'de eklenir). Kurucular
-- kayıtları 24 saat içinde inceler (kürasyon paneli ayrı iş); yalnız işaretlenen mesajlar açılır.
--
-- Tablo istemciye kapalı: öğrenci ne okur ne yazar. Kayıt yalnız Edge Function'dan, öğrencinin oturumuyla
-- record_safety_event ile düşer. 18 yaş altı onaysız kullanıcı için kayıt kabul edilmez (değişmez kural).
-- Saklama: incelemeden sonra 1 yıl (rapor 2.11, avukat teyidiyle); silme işi pg_cron gelince (henüz yok).
create table public.safety_event (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  message_id uuid,
  level text not null check (level in ('yuksek', 'akut')),
  category text not null check (category in ('kendine_zarar', 'istismar', 'yeme', 'madde', 'diger')),
  -- list: deterministik liste, classifier: Haiku sınıflandırıcı, output: çıktı denetimi (T17),
  -- report: öğrencinin "bildir" düğmesi (T20).
  sources text[] not null check (
    cardinality(sources) > 0 and sources <@ array['list', 'classifier', 'output', 'report']
  ),
  -- fixed: sabit metin gösterildi (akut), support: güvenli mod + destekleyici yanıt,
  -- replaced: LLM yanıtı sabit metinle değiştirildi, reported: bildirim alındı.
  action text not null check (action in ('fixed', 'support', 'replaced', 'reported')),
  -- Gösterilen sabit metnin sürümü (PDR onayı izlenebilsin).
  text_version text not null check (length(text_version) between 1 and 40),
  created_at timestamptz not null default now(),
  -- İnceleyen kurucu (auth kullanıcısı değil, yabancı anahtar yok: hesap silme cascade kuralının dışında).
  reviewed_by uuid,
  reviewed_at timestamptz
);
create index safety_event_unreviewed_idx on public.safety_event (created_at) where reviewed_at is null;
create index safety_event_user_idx on public.safety_event (user_id);

alter table public.safety_event enable row level security;
revoke all on public.safety_event from anon, authenticated;

create function public.record_safety_event(
  p_level text,
  p_category text,
  p_sources text[],
  p_action text,
  p_text_version text,
  p_message_id uuid default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if auth.uid() is null or not public.my_consent_ok() then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  insert into public.safety_event (user_id, message_id, level, category, sources, action, text_version)
  values (auth.uid(), p_message_id, p_level, p_category, p_sources, p_action, p_text_version)
  returning id into v_id;
  return v_id;
end;
$$;
revoke execute on function public.record_safety_event(text, text, text[], text, text, uuid) from public, anon;
grant execute on function public.record_safety_event(text, text, text[], text, text, uuid) to authenticated;

-- Sınıflandırma kotası (`classify` fonksiyonu). Sohbet (T17) sınıflandırıcıyı kendi içinde çağırır,
-- ayrıca bu kotadan düşmez.
alter table public.ai_usage drop constraint ai_usage_kind_check;
alter table public.ai_usage add constraint ai_usage_kind_check check (kind in ('toc', 'chat', 'safety'));
