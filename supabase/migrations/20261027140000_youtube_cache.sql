-- YouTube oynatma listesi önbelleği (T31, rapor 2.8). Herkese açık liste verisi (başlık, kanal, süre,
-- gömülebilirlik, "çocuklara özel"); kullanıcıya bağlı değil, ortak. YouTube API Hizmetleri politikası:
--   * III.E.4.c-e: API verisi en fazla 30 gün saklanır. `youtube-import` 25 günden eskiyse yeniden çeker;
--     günlük temizlik (run_retention) 30 günü geçeni siler.
--   * III.E.4.h: türetilmiş veri ya da metrik yok; süre yalnız görev hesabında kullanılır.
-- Öğrencinin hangi listeyi eklediği yalnız kendi library_item satırında (yt_playlist_id); burada yok.
-- Tablolar istemciye kapalı; yalnız youtube-import (service role) okur ve yazar.
create table public.yt_playlist (
  id text primary key check (id ~ '^[A-Za-z0-9_-]{13,64}$'),
  title text not null,
  channel_title text not null,
  fetched_at timestamptz not null default now()
);

create table public.yt_video (
  playlist_id text not null references public.yt_playlist (id) on delete cascade,
  position integer not null check (position >= 0),
  video_id text not null check (video_id ~ '^[A-Za-z0-9_-]{6,20}$'),
  title text not null,
  channel_title text not null,
  duration_seconds integer not null check (duration_seconds > 0),
  embeddable boolean not null,
  made_for_kids boolean not null,
  primary key (playlist_id, position)
);

alter table public.yt_playlist enable row level security;
alter table public.yt_video enable row level security;
revoke all on public.yt_playlist from anon, authenticated;
revoke all on public.yt_video from anon, authenticated;

-- Liste ekleme de günlük kotaya bağlı (YouTube kotası ortak: günde 10.000 birim).
alter table public.ai_usage drop constraint ai_usage_kind_check;
alter table public.ai_usage add constraint ai_usage_kind_check
  check (kind in ('toc', 'chat', 'safety', 'youtube'));

-- Günlük temizliğe YouTube önbelleği eklenir (30 gün).
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

  return jsonb_build_object(
    'chat_message', v_chat,
    'safety_event', v_events,
    'report_link', v_links,
    'consent_request', v_requests,
    'ai_usage', v_usage,
    'yt_playlist', v_youtube
  );
end;
$$;

revoke execute on function public.run_retention() from public, anon, authenticated;
