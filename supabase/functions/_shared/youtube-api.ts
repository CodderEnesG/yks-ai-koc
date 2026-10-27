// YouTube Data API v3 okuması (T31): liste başlığı, videolar, süre ve durum. youtube-import kullanır;
// Supabase'siz denenebilsin diye ayrı. Yalnız herkese açık veri ve API anahtarı (OAuth yok).
import { parseIsoDuration } from '@yks/youtube';

const API = 'https://www.googleapis.com/youtube/v3';
/** Çok uzun listelerde kota ve plan anlamsızlaşır; ilk 500 video. */
export const MAX_VIDEOS = 500;

export interface PlaylistVideo {
  videoId: string;
  title: string;
  channelTitle: string;
  durationSeconds: number;
  embeddable: boolean;
  madeForKids: boolean;
}

export interface FetchedPlaylist {
  title: string;
  channelTitle: string;
  videos: PlaylistVideo[];
}

export class YouTubeError extends Error {
  constructor(readonly status: number) {
    super(`youtube ${status}`);
  }
}

// Kullanılan alanlar; YouTube'un yanıtları çok daha geniş.
interface Snippet {
  title?: string;
  channelTitle?: string;
}
interface Status {
  privacyStatus?: string;
  embeddable?: boolean;
  madeForKids?: boolean;
}
interface PlaylistsResponse {
  items?: { snippet?: Snippet }[];
}
interface PlaylistItemsResponse {
  items?: { contentDetails?: { videoId?: string }; status?: Status }[];
  nextPageToken?: string;
}
interface VideosResponse {
  items?: {
    id: string;
    snippet?: Snippet;
    contentDetails?: { duration?: string };
    status?: Status;
  }[];
}

async function call<T>(apiKey: string, path: string, params: Record<string, string>): Promise<T> {
  const query = new URLSearchParams({ ...params, key: apiKey });
  const res = await fetch(`${API}/${path}?${query}`);
  if (!res.ok) throw new YouTubeError(res.status);
  return (await res.json()) as T;
}

/**
 * Liste ve videoları, liste sırasıyla. Özel, silinmiş ve süresiz (canlı yayın) videolar düşer. Liste
 * yoksa ya da özelse null. Kota: 1 (liste) + sayfa başına 1 + 50 video başına 1 birim.
 */
export async function fetchPlaylist(apiKey: string, id: string): Promise<FetchedPlaylist | null> {
  const meta = await call<PlaylistsResponse>(apiKey, 'playlists', { part: 'snippet', id });
  const snippet = meta.items?.[0]?.snippet;
  if (!snippet) return null;

  const ids: string[] = [];
  let pageToken: string | undefined;
  do {
    const page = await call<PlaylistItemsResponse>(apiKey, 'playlistItems', {
      part: 'contentDetails,status',
      playlistId: id,
      maxResults: '50',
      ...(pageToken ? { pageToken } : {}),
    });
    for (const item of page.items ?? []) {
      if (item.status?.privacyStatus === 'private') continue;
      const videoId = item.contentDetails?.videoId;
      if (typeof videoId === 'string') ids.push(videoId);
    }
    pageToken = page.nextPageToken;
  } while (pageToken && ids.length < MAX_VIDEOS);

  const videos: PlaylistVideo[] = [];
  const wanted = ids.slice(0, MAX_VIDEOS);
  for (let i = 0; i < wanted.length; i += 50) {
    const batch = wanted.slice(i, i + 50);
    const res = await call<VideosResponse>(apiKey, 'videos', {
      part: 'snippet,contentDetails,status',
      id: batch.join(','),
      maxResults: '50',
    });
    // Yanıtta olmayan video silinmiş ya da özeldir; sırayı playlistItems belirler.
    const byId = new Map((res.items ?? []).map((v) => [v.id, v]));
    for (const videoId of batch) {
      const v = byId.get(videoId);
      if (!v || v.status?.privacyStatus === 'private') continue;
      const durationSeconds = parseIsoDuration(v.contentDetails?.duration ?? '');
      if (!durationSeconds) continue;
      videos.push({
        videoId,
        title: v.snippet?.title ?? '',
        channelTitle: v.snippet?.channelTitle ?? '',
        durationSeconds,
        embeddable: v.status?.embeddable !== false,
        madeForKids: v.status?.madeForKids === true,
      });
    }
  }
  return { title: snippet.title ?? '', channelTitle: snippet.channelTitle ?? '', videos };
}
