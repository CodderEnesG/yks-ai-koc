-- Veli onayı (T21, rapor 2.11). Onaydan önce öğrencinin sunucuda hesabı yok: telefon rastgele bir onay
-- kodu (token) üretir, sunucuda yalnız kodun SHA-256'sı ve veli e-postası durur. Veli linki web'de açar,
-- e-posta koduyla (Supabase Auth OTP) doğrular ve rızaları ayrı ayrı verir. Onaydan sonra öğrenci hesap
-- bağlar ve isteği hesabına bağlar (claim). Tablolar istemciye kapalı; erişim yalnız aşağıdaki fonksiyonlarla.
--
-- Rıza kayıtları hesap silinse de kalır (rapor 2.11: sürüm, zaman, hash; avukat teyidiyle). Bu yüzden
-- auth.users'a bağlantılar cascade değil `set null` (account_delete.test.sql'de bilinçli istisna).

create table public.consent_request (
  id uuid primary key default gen_random_uuid(),
  token_hash bytea not null unique,
  parent_email text not null check (
    length(parent_email) <= 254 and parent_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  ),
  status text not null default 'pending' check (status in ('pending', 'granted', 'withdrawn')),
  report_consent boolean not null default false,
  created_at timestamptz not null default now(),
  -- Link süresi: 7 gün (rapor tanımlamıyor, DECISION TO TEST).
  expires_at timestamptz not null default now() + interval '7 days',
  decided_at timestamptz,
  parent_user_id uuid references auth.users (id) on delete set null,
  student_user_id uuid unique references auth.users (id) on delete set null
);

-- Her rıza ayrı satır. Velinin adı açık tutulmaz: ad, e-posta, tür, metin sürümü ve zamanın hash'i ispat
-- için yeter (veli aynı bilgilerle hash'i yeniden üretebilir).
create table public.consent (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.consent_request (id),
  kind text not null check (kind in ('aydinlatma', 'ai_yurt_disi', 'veli_raporu')),
  text_version text not null check (length(text_version) between 1 and 40),
  giver text not null default 'veli' check (giver in ('veli')),
  evidence_hash text not null,
  ip_hash text,
  given_at timestamptz not null,
  withdrawn_at timestamptz
);
create index consent_request_id_idx on public.consent (request_id);

alter table public.consent_request enable row level security;
alter table public.consent enable row level security;
revoke all on public.consent_request from anon, authenticated;
revoke all on public.consent from anon, authenticated;

------------------------------------------------------------------------------------------------------
-- Yardımcılar
------------------------------------------------------------------------------------------------------

create function public.consent_token_hash(p_token text) returns bytea
language sql
immutable
set search_path = ''
as $$
  select extensions.digest(p_token, 'sha256');
$$;

-- İstemcideki isMinor ile aynı kural: 18 yaşına girdiği ayın ertesi ayından itibaren reşit (İstanbul).
create function public.is_adult(p_birth_year integer, p_birth_month integer) returns boolean
language sql
stable
set search_path = ''
as $$
  select (extract(year from now() at time zone 'Europe/Istanbul')::integer - p_birth_year) * 12
       + (extract(month from now() at time zone 'Europe/Istanbul')::integer - p_birth_month) > 18 * 12;
$$;

-- Kişisel veri sunucuda tutulabilir mi: reşit ya da onaylı ve hesabına bağlanmış veli onayı var.
create function public.consent_ok(p_user uuid, p_birth_year integer, p_birth_month integer) returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select public.is_adult(p_birth_year, p_birth_month)
      or exists (
        select 1 from public.consent_request r
        where r.student_user_id = p_user and r.status = 'granted'
      );
$$;

-- Oturumdaki öğrencinin profili var ve onay şartı sağlanıyor.
create function public.my_consent_ok() returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profile p
    where p.user_id = auth.uid() and public.consent_ok(p.user_id, p.birth_year, p.birth_month)
  );
$$;

-- "Veli onayı gelmeden 18 yaş altı kullanıcının verisi sunucuya gitmez" (değişmez kural): istemci zaten
-- göndermez; sunucu da kabul etmez. Profil yeni satırın doğum bilgisiyle, diğer tablolar profille denetlenir.
create policy profile_consent_insert on public.profile as restrictive for insert to authenticated
  with check (public.consent_ok(user_id, birth_year, birth_month));
create policy profile_consent_update on public.profile as restrictive for update to authenticated
  using (true) with check (public.consent_ok(user_id, birth_year, birth_month));

do $$
declare
  t text;
begin
  foreach t in array array['library_item', 'plan_task', 'checkin'] loop
    execute format(
      'create policy %1$s_consent_insert on public.%1$I as restrictive for insert to authenticated
         with check (public.my_consent_ok())',
      t
    );
    execute format(
      'create policy %1$s_consent_update on public.%1$I as restrictive for update to authenticated
         using (true) with check (public.my_consent_ok())',
      t
    );
  end loop;
end;
$$;

------------------------------------------------------------------------------------------------------
-- Öğrenci (onaydan önce hesapsız: anon)
------------------------------------------------------------------------------------------------------

-- Telefon kodu üretir ve isteği açar. Sunucuya giden tek kişisel veri veli e-postası (rapor 2.11 adım 2).
create function public.create_consent_request(p_token text, p_parent_email text) returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if p_token is null or length(p_token) not between 32 and 128 then
    raise exception 'invalid_token' using errcode = '22023';
  end if;
  insert into public.consent_request (token_hash, parent_email)
  values (public.consent_token_hash(p_token), lower(trim(p_parent_email)));
end;
$$;

-- pending | granted | withdrawn | expired; bilinmeyen kodda satır dönmez.
create function public.consent_request_status(p_token text)
returns table (status text, report_consent boolean)
language sql
stable
security definer
set search_path = ''
as $$
  select case when r.status = 'pending' and r.expires_at < now() then 'expired' else r.status end,
         r.report_consent
  from public.consent_request r
  where r.token_hash = public.consent_token_hash(p_token);
$$;

-- Onaydan sonra giriş yapan öğrenci isteği kendi hesabına bağlar. Veli hesabıyla bağlanamaz.
create function public.claim_consent(p_token text) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  r public.consent_request;
begin
  if auth.uid() is null then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  select * into r from public.consent_request
  where token_hash = public.consent_token_hash(p_token)
  for update;
  if not found or r.status <> 'granted' or r.parent_user_id = auth.uid() then
    return false;
  end if;
  if r.student_user_id is not null then
    return r.student_user_id = auth.uid();
  end if;
  update public.consent_request set student_user_id = auth.uid() where id = r.id;
  return true;
end;
$$;

------------------------------------------------------------------------------------------------------
-- Veli (web sayfası)
------------------------------------------------------------------------------------------------------

-- Sayfanın gösterdiği özet: durum ve maskeli e-posta. Linki bilen herkes görebilir; kişisel veri yok.
create function public.consent_request_view(p_token text)
returns table (status text, parent_email_hint text, report_consent boolean, expires_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select case when r.status = 'pending' and r.expires_at < now() then 'expired' else r.status end,
         left(r.parent_email, 2) || '***' || substring(r.parent_email from position('@' in r.parent_email)),
         r.report_consent,
         r.expires_at
  from public.consent_request r
  where r.token_hash = public.consent_token_hash(p_token);
$$;

-- Veli kendi e-postasıyla giriş yapmış olmalı (e-posta OTP). AI ve yurt dışı aktarım rızası zorunlu,
-- veli raporu isteğe bağlı (rapor 2.11 adım 4: ayrı ayrı).
create function public.grant_consent(
  p_token text,
  p_name text,
  p_ai boolean,
  p_report boolean,
  p_text_version text
) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  r public.consent_request;
  v_email text := lower(auth.jwt() ->> 'email');
  v_now timestamptz := now();
  v_ip text := split_part(
    coalesce(current_setting('request.headers', true)::json ->> 'x-forwarded-for', ''), ',', 1
  );
  v_kind text;
begin
  if auth.uid() is null or v_email is null then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  select * into r from public.consent_request
  where token_hash = public.consent_token_hash(p_token)
  for update;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if v_email <> r.parent_email then
    raise exception 'email_mismatch' using errcode = '42501';
  end if;
  if r.status <> 'pending' then
    raise exception 'not_pending' using errcode = '22023';
  end if;
  if r.expires_at < v_now then
    raise exception 'expired' using errcode = '22023';
  end if;
  if p_ai is not true then
    raise exception 'ai_consent_required' using errcode = '22023';
  end if;
  if p_name is null or length(trim(p_name)) not between 2 and 100 then
    raise exception 'invalid_name' using errcode = '22023';
  end if;

  foreach v_kind in array
    case when p_report then array['aydinlatma', 'ai_yurt_disi', 'veli_raporu']
         else array['aydinlatma', 'ai_yurt_disi'] end
  loop
    insert into public.consent (request_id, kind, text_version, evidence_hash, ip_hash, given_at)
    values (
      r.id,
      v_kind,
      p_text_version,
      encode(extensions.digest(
        concat_ws('|', trim(p_name), v_email, v_kind, p_text_version, v_now::text), 'sha256'), 'hex'),
      -- İsteğe göre tuzlanır; aynı IP farklı istekler arasında eşleştirilemez.
      case when v_ip = '' then null
           else encode(extensions.digest(r.id::text || '|' || trim(v_ip), 'sha256'), 'hex') end,
      v_now
    );
  end loop;

  update public.consent_request
  set status = 'granted', report_consent = coalesce(p_report, false), decided_at = v_now,
      parent_user_id = auth.uid()
  where id = r.id;
end;
$$;

-- Veli rızayı geri çeker (rapor 2.11 adım 6): öğrencinin sunucudaki hesabı ve verisi silinir (cascade),
-- rıza kayıtları geri çekilme zamanıyla kalır. Telefondaki veri öğrencide kalır, senkron ve sohbet kapanır.
create function public.withdraw_consent(p_token text) returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  r public.consent_request;
begin
  if auth.uid() is null then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  select * into r from public.consent_request
  where token_hash = public.consent_token_hash(p_token)
  for update;
  if not found then
    raise exception 'not_found' using errcode = 'P0002';
  end if;
  if lower(auth.jwt() ->> 'email') <> r.parent_email then
    raise exception 'email_mismatch' using errcode = '42501';
  end if;
  if r.status = 'withdrawn' then
    return;
  end if;
  update public.consent set withdrawn_at = now() where request_id = r.id and withdrawn_at is null;
  update public.consent_request set status = 'withdrawn', decided_at = now() where id = r.id;
  if r.student_user_id is not null then
    delete from auth.users where id = r.student_user_id;
  end if;
end;
$$;

------------------------------------------------------------------------------------------------------
-- Yetkiler
------------------------------------------------------------------------------------------------------

revoke execute on function public.consent_token_hash(text) from public, anon, authenticated;
revoke execute on function public.is_adult(integer, integer) from public, anon;
revoke execute on function public.consent_ok(uuid, integer, integer) from public, anon;
revoke execute on function public.my_consent_ok() from public, anon;
revoke execute on function public.create_consent_request(text, text) from public;
revoke execute on function public.consent_request_status(text) from public;
revoke execute on function public.consent_request_view(text) from public;
revoke execute on function public.claim_consent(text) from public, anon;
revoke execute on function public.grant_consent(text, text, boolean, boolean, text) from public, anon;
revoke execute on function public.withdraw_consent(text) from public, anon;

grant execute on function public.is_adult(integer, integer) to authenticated;
grant execute on function public.consent_ok(uuid, integer, integer) to authenticated;
grant execute on function public.my_consent_ok() to authenticated;
grant execute on function public.create_consent_request(text, text) to anon, authenticated;
grant execute on function public.consent_request_status(text) to anon, authenticated;
grant execute on function public.consent_request_view(text) to anon, authenticated;
grant execute on function public.claim_consent(text) to authenticated;
grant execute on function public.grant_consent(text, text, boolean, boolean, text) to authenticated;
grant execute on function public.withdraw_consent(text) to authenticated;
