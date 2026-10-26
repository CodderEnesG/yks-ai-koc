-- Haftalık veli raporu linki (T22, rapor 2.12). Veli hesap açmaz: rapor sayfası süreli ve tahmin edilemez
-- bir linkle açılır. Öğrenci linki uygulamadan alır ve velisine gönderir (wa.me). Rapor her açılışta
-- weekly-report fonksiyonunda o anki veriden hesaplanır; rapor içeriği saklanmaz.
-- Link yalnız veli raporuna rıza verilmişse (consent_request.report_consent) üretilir ve açılır.

create table public.report_link (
  user_id uuid primary key references auth.users (id) on delete cascade,
  -- Öğrenci linki tekrar paylaşabilsin diye açık tutulur; tablo istemciye kapalı.
  token text not null unique,
  created_at timestamptz not null default now(),
  -- 30 gün (rapor süre vermiyor, DECISION TO TEST); süresi dolunca yenisi üretilir.
  expires_at timestamptz not null default now() + interval '30 days'
);
alter table public.report_link enable row level security;
revoke all on public.report_link from anon, authenticated;

-- Oturumdaki öğrencinin geçerli rapor linki kodu; yoksa ya da süresi dolduysa yenisi. Veli raporuna rıza
-- yoksa null.
create function public.my_report_link() returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_token text;
begin
  if auth.uid() is null then
    raise exception 'unauthorized' using errcode = '42501';
  end if;
  if not exists (
    select 1 from public.consent_request r
    where r.student_user_id = auth.uid() and r.status = 'granted' and r.report_consent
  ) then
    return null;
  end if;
  select token into v_token from public.report_link
  where user_id = auth.uid() and expires_at > now() + interval '1 day';
  if v_token is null then
    v_token := encode(extensions.gen_random_bytes(32), 'hex');
    insert into public.report_link (user_id, token) values (auth.uid(), v_token)
    on conflict (user_id) do update
      set token = excluded.token, created_at = now(), expires_at = now() + interval '30 days';
  end if;
  return v_token;
end;
$$;

-- weekly-report fonksiyonu (service role) için: koddan öğrenci; rıza geri çekildiyse ya da rapor rızası
-- yoksa satır dönmez.
create function public.report_owner(p_token text) returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select l.user_id
  from public.report_link l
  join public.consent_request r on r.student_user_id = l.user_id
  where l.token = p_token and l.expires_at > now() and r.status = 'granted' and r.report_consent;
$$;

revoke execute on function public.my_report_link() from public, anon;
revoke execute on function public.report_owner(text) from public, anon, authenticated;
grant execute on function public.my_report_link() to authenticated;
grant execute on function public.report_owner(text) to service_role;
