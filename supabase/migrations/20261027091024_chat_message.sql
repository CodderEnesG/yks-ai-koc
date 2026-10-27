-- Koç sohbeti mesajları (T17, rapor 2.5 ve 2.11). Sunucudaki kopya koçun kısa geçmişi ve güvenlik
-- incelemesi (safety_event.message_id, "bildir") için; öğrencinin ekranı kendi telefonundaki kopyayı gösterir.
--
-- * Mesajları yalnız `chat` Edge Function yazar (service role); öğrenci yalnız kendi mesajlarını okur.
-- * Sohbet içeriği hiçbir zaman veliye gösterilmez (değişmez kural): rapor fonksiyonu bu tabloyu okumaz,
--   veli rolüne hiçbir politika yok.
-- * Saklama 90 günlük kayan pencere: `chat` her istekte o öğrencinin eski mesajlarını siler
--   (purge_chat_messages). Uzun süre yazmayan öğrencinin eskileri pg_cron gelince temizlenecek (henüz yok).
-- * Hesap silinince ya da veli onayı geri çekilince cascade ile gider.
create table public.chat_message (
  id uuid primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 4000),
  -- Öğrenci mesajında risk seviyesi; koç yanıtında yanıtın nasıl üretildiği.
  risk_level text check (risk_level in ('yok', 'yuksek', 'akut')),
  action text check (action in ('reply', 'check', 'support', 'fixed', 'unavailable', 'replaced')),
  created_at timestamptz not null default now(),
  -- Öğrencinin "bildir" düğmesi (rapor 2.10 katman 8); kurucular inceler.
  reported_at timestamptz,
  check ((role = 'user') = (action is null))
);
create index chat_message_user_idx on public.chat_message (user_id, created_at desc);
create index chat_message_reported_idx on public.chat_message (reported_at) where reported_at is not null;

alter table public.chat_message enable row level security;
revoke all on public.chat_message from anon, authenticated;
grant select on public.chat_message to authenticated;
create policy chat_message_select_own on public.chat_message for select to authenticated
  using ((select auth.uid()) = user_id);

-- Güvenlik olayı mesaja bağlanır (T18'de sütun açılmıştı). Olay 1 yıl, mesaj 90 gün tutulur: mesaj
-- silinince olay kalır, bağlantı boşalır.
alter table public.safety_event
  add constraint safety_event_message_id_fkey
  foreign key (message_id) references public.chat_message (id) on delete set null;

-- "Bildir": öğrenci yalnız kendi aldığı koç yanıtını işaretleyebilir. İkinci kez basmak bir şey değiştirmez.
create function public.report_chat_message(p_id uuid) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  update public.chat_message
  set reported_at = coalesce(reported_at, now())
  where id = p_id and user_id = auth.uid() and role = 'assistant';
  return found;
end;
$$;

-- Kayan pencere: bir öğrencinin 90 günden eski mesajları. Yalnız chat fonksiyonu (service role) çağırır.
create function public.purge_chat_messages(p_user uuid) returns integer
language sql
security definer
set search_path = ''
as $$
  with deleted as (
    delete from public.chat_message
    where user_id = p_user and created_at < now() - interval '90 days'
    returning 1
  )
  select count(*)::integer from deleted;
$$;

revoke execute on function public.report_chat_message(uuid) from public, anon;
revoke execute on function public.purge_chat_messages(uuid) from public, anon, authenticated;
grant execute on function public.report_chat_message(uuid) to authenticated;
grant execute on function public.purge_chat_messages(uuid) to service_role;
