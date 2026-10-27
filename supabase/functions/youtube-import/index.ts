// YouTube oynatma listesi ekleme (T31, rapor 2.8). Liste linkinden kimlik çıkarılır; ortak önbellek
// (yt_playlist / yt_video) 25 günden yeniyse oradan, değilse YouTube Data API'den okunur:
//   playlists.list (başlık, kanal) + playlistItems.list (50'lik sayfalar) + videos.list (süre,
//   gömülebilirlik, "çocuklara özel", gizlilik). Özel, silinmiş ve süresiz (canlı) videolar düşer.
// API anahtarı yalnız burada (secret YOUTUBE_API_KEY); telefon YouTube'u doğrudan çağırmaz.
// Yalnız girişli ve onaylı öğrenci; günde 20 liste (kota, YouTube'un ortak 10.000 birimini korur).
import { createClient } from '@supabase/supabase-js';
import { parsePlaylistId } from '@yks/youtube';
import { z } from 'zod';

import { type FetchedPlaylist, fetchPlaylist, YouTubeError } from '../_shared/youtube-api.ts';

const DAILY_LIMIT = 20;
/** Bu kadar yeni önbellek yeniden çekilmez; 30 günde silinir (politika III.E.4.c-e). */
const FRESH_DAYS = 25;

const RequestSchema = z.object({ input: z.string().trim().min(1).max(500) });

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'method_not_allowed' });
  const authorization = req.headers.get('Authorization');
  if (!authorization) return json(401, { error: 'unauthorized' });
  const parsed = RequestSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json(400, { error: 'bad_request' });
  const playlistId = parsePlaylistId(parsed.data.input);
  if (!playlistId) return json(400, { error: 'invalid_link' });

  const url = Deno.env.get('SUPABASE_URL')!;
  const asUser = createClient(url, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: consentOk, error: consentError } = await asUser.rpc('my_consent_ok');
  if (consentError) return json(401, { error: 'unauthorized' });
  if (!consentOk) return json(403, { error: 'consent_required' });
  const { data: allowed } = await asUser.rpc('consume_ai_quota', {
    p_kind: 'youtube',
    p_limit: DAILY_LIMIT,
  });
  if (!allowed) return json(429, { error: 'quota_exceeded' });

  const db = createClient(url, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const fresh = new Date(Date.now() - FRESH_DAYS * 86_400_000).toISOString();
  const cached = await db
    .from('yt_playlist')
    .select(
      'title, channel_title, fetched_at, yt_video(video_id, title, channel_title, duration_seconds, embeddable, made_for_kids, position)',
    )
    .eq('id', playlistId)
    .gte('fetched_at', fresh)
    .maybeSingle();
  if (cached.data) {
    const rows = [...cached.data.yt_video].sort((a, b) => a.position - b.position);
    return json(200, {
      playlist: {
        id: playlistId,
        title: cached.data.title,
        channelTitle: cached.data.channel_title,
      },
      videos: rows.map((v) => ({
        videoId: v.video_id,
        title: v.title,
        channelTitle: v.channel_title,
        durationSeconds: v.duration_seconds,
        embeddable: v.embeddable,
        madeForKids: v.made_for_kids,
      })),
      fetchedAt: cached.data.fetched_at,
    });
  }

  let fetched: FetchedPlaylist | null;
  try {
    fetched = await fetchPlaylist(Deno.env.get('YOUTUBE_API_KEY')!, playlistId);
  } catch (error) {
    console.error('youtube-import', error instanceof YouTubeError ? error.status : 'network');
    return json(503, { error: 'youtube_unavailable' });
  }
  if (!fetched) return json(404, { error: 'not_found' });
  if (fetched.videos.length === 0) return json(422, { error: 'empty' });

  const fetchedAt = new Date().toISOString();
  const upsert = await db.from('yt_playlist').upsert({
    id: playlistId,
    title: fetched.title,
    channel_title: fetched.channelTitle,
    fetched_at: fetchedAt,
  });
  const removed = upsert.error
    ? upsert
    : await db.from('yt_video').delete().eq('playlist_id', playlistId);
  const inserted = removed.error
    ? removed
    : await db.from('yt_video').insert(
        fetched.videos.map((v, position) => ({
          playlist_id: playlistId,
          position,
          video_id: v.videoId,
          title: v.title,
          channel_title: v.channelTitle,
          duration_seconds: v.durationSeconds,
          embeddable: v.embeddable,
          made_for_kids: v.madeForKids,
        })),
      );
  // Önbellek yazılamasa da öğrenci listeyi alır; sonraki istek yeniden çeker.
  if (inserted.error) console.error('youtube-import cache', inserted.error.code);

  return json(200, {
    playlist: { id: playlistId, title: fetched.title, channelTitle: fetched.channelTitle },
    videos: fetched.videos,
    fetchedAt,
  });
});
