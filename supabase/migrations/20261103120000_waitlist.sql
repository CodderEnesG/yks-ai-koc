-- Bekleme listesi (T40, docs/PLAN-2026-11-03-tanitim-sitesi-t40.md). Tanıtım sitesindeki form buraya yazar.
--
-- Kurallar:
-- * 18 yaş altı öğrenci kendi e-postasını bırakamaz (değişmez kural: veli onayı olmadan 18 yaş altının verisi
--   sunucuya gitmez). Roller yalnız 18 yaş ve üstü öğrenci, veli ve öğretmen/koç; 18 yaş altı seçeneği formda
--   gönderim yapmaz, veliye link paylaştırır.
-- * Tablolar istemciye kapalı; yazma yalnız join_waitlist ile. Okuma ekipte (Studio).
-- * Aynı e-posta ikinci kez gelirse hata dönmez ve satır açılmaz: e-postanın listede olup olmadığı sızmaz.
-- * Kötüye kullanım: bal tuzağı alanı, IP başına saatte 5, toplamda saatte 300 kayıt. IP açık tutulmaz; günlük
--   rastgele tuzla hash'lenir, hash 2 gün sonra silinir (run_retention).
-- * Kaydın kendisinin saklama süresi tanımlı değil (NOT DEFINED; öneri: davetten sonra 6 ay, avukata sorulacak).
--   Listeden çıkmak isteyen iletişim adresine yazar, ekip elle siler.
-- * Çift onaylı kayıt yok: e-posta sağlayıcı (karar 13) gelene kadar davetler elle gönderilir.

create table public.waitlist_entry (
  id uuid primary key default gen_random_uuid(),
  -- Küçük harfe çevrilmiş halde tutulur; tekillik buna göre.
  email text not null unique check (
    email = lower(email)
    and length(email) <= 254
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  role text not null check (role in ('ogrenci_18', 'veli', 'ogretmen')),
  -- Öğrencinin ya da velinin çocuğunun sınıfı; isteğe bağlı, öğretmende yok.
  grade text check (grade in ('11', '12', 'mezun')),
  notice_version text not null check (length(notice_version) between 1 and 40),
  ip_hash text,
  created_at timestamptz not null default now(),
  invited_at timestamptz,
  check (role <> 'ogretmen' or grade is null)
);
create index waitlist_entry_created_idx on public.waitlist_entry (created_at);
create index waitlist_entry_ip_idx on public.waitlist_entry (ip_hash, created_at) where ip_hash is not null;

-- Günlük tuz: aynı gün içinde aynı IP aynı hash'i verir (hız sınırı için), günler arasında eşleşmez.
create table public.waitlist_salt (
  day date primary key,
  salt bytea not null default extensions.gen_random_bytes(32)
);

alter table public.waitlist_entry enable row level security;
alter table public.waitlist_salt enable row level security;
revoke all on public.waitlist_entry from anon, authenticated;
revoke all on public.waitlist_salt from anon, authenticated;

create function public.join_waitlist(
  p_email text,
  p_role text,
  p_grade text,
  p_notice_version text,
  p_trap text default null
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_email text := lower(trim(coalesce(p_email, '')));
  v_ip text := trim(split_part(
    coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1
  ));
  v_salt bytea;
  v_ip_hash text;
begin
  -- Bal tuzağı: insanlar görmez, botlar doldurur. Başarılı gibi döner.
  if coalesce(p_trap, '') <> '' then
    return;
  end if;
  if length(v_email) > 254 or v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'invalid_email' using errcode = '22023';
  end if;
  if p_role is null or p_role not in ('ogrenci_18', 'veli', 'ogretmen') then
    raise exception 'invalid_role' using errcode = '22023';
  end if;
  if p_grade is not null and (p_role = 'ogretmen' or p_grade not in ('11', '12', 'mezun')) then
    raise exception 'invalid_grade' using errcode = '22023';
  end if;
  if p_notice_version is null or length(trim(p_notice_version)) not between 1 and 40 then
    raise exception 'invalid_notice' using errcode = '22023';
  end if;

  if (select count(*) from public.waitlist_entry where created_at > now() - interval '1 hour') >= 300 then
    raise exception 'rate_limited' using errcode = 'P0001';
  end if;
  if v_ip <> '' then
    insert into public.waitlist_salt (day) values (current_date) on conflict (day) do nothing;
    select salt into v_salt from public.waitlist_salt where day = current_date;
    v_ip_hash := encode(extensions.digest(v_salt || convert_to(v_ip, 'UTF8'), 'sha256'), 'hex');
    if (
      select count(*) from public.waitlist_entry
      where ip_hash = v_ip_hash and created_at > now() - interval '1 hour'
    ) >= 5 then
      raise exception 'rate_limited' using errcode = 'P0001';
    end if;
  end if;

  insert into public.waitlist_entry (email, role, grade, notice_version, ip_hash)
  values (v_email, p_role, p_grade, trim(p_notice_version), v_ip_hash)
  on conflict (email) do nothing;
end;
$$;

revoke execute on function public.join_waitlist(text, text, text, text, text) from public;
grant execute on function public.join_waitlist(text, text, text, text, text) to anon, authenticated;

-- Günlük temizliğe IP hash'i ve eski tuzlar eklenir (önceki tanım: 20261027140000_youtube_cache.sql).
create or replace function public.run_retention() returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_chat integer;
  v_events integer;
  v_links integer;
  v_requests integer;
  v_usage integer;
  v_youtube integer;
  v_waitlist_ip integer;
begin
  delete from public.chat_message where created_at < now() - interval '90 days';
  get diagnostics v_chat = row_count;

  delete from public.safety_event where reviewed_at < now() - interval '1 year';
  get diagnostics v_events = row_count;

  delete from public.report_link where expires_at < now();
  get diagnostics v_links = row_count;

  delete from public.consent_request
  where status = 'pending' and expires_at < now() - interval '30 days';
  get diagnostics v_requests = row_count;

  delete from public.ai_usage where day < (now() at time zone 'Europe/Istanbul')::date - 30;
  get diagnostics v_usage = row_count;

  delete from public.yt_playlist where fetched_at < now() - interval '30 days';
  get diagnostics v_youtube = row_count;

  update public.waitlist_entry set ip_hash = null
  where ip_hash is not null and created_at < now() - interval '2 days';
  get diagnostics v_waitlist_ip = row_count;
  delete from public.waitlist_salt where day < current_date - 2;

  return jsonb_build_object(
    'chat_message', v_chat,
    'safety_event', v_events,
    'report_link', v_links,
    'consent_request', v_requests,
    'ai_usage', v_usage,
    'yt_playlist', v_youtube,
    'waitlist_ip', v_waitlist_ip
  );
end;
$$;
revoke execute on function public.run_retention() from public, anon, authenticated;
