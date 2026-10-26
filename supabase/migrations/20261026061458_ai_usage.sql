-- AI kullanım kotası (T11 içindekiler okuma; T17 sohbet de kullanacak). Kullanıcı başına gün başına sayaç.
-- Tablo istemciye kapalı; yalnız consume_ai_quota ile artırılır. Gün İstanbul saatine göre.
create table public.ai_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  kind text not null check (kind in ('toc', 'chat')),
  count integer not null default 0 check (count >= 0),
  primary key (user_id, day, kind)
);
alter table public.ai_usage enable row level security;
revoke all on public.ai_usage from anon, authenticated;

-- Kota varsa bir artırır ve true döner; doluysa false. Tek ifadede, eşzamanlı çağrılarda da sınır aşılmaz.
create function public.consume_ai_quota(p_kind text, p_limit integer) returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user uuid := auth.uid();
  v_day date := (now() at time zone 'Europe/Istanbul')::date;
  v_count integer;
begin
  if v_user is null then
    return false;
  end if;
  insert into public.ai_usage as u (user_id, day, kind, count)
  values (v_user, v_day, p_kind, 1)
  on conflict (user_id, day, kind) do update set count = u.count + 1
    where u.count < p_limit
  returning count into v_count;
  return v_count is not null and v_count <= p_limit;
end;
$$;
revoke execute on function public.consume_ai_quota(text, integer) from public, anon;
grant execute on function public.consume_ai_quota(text, integer) to authenticated;
