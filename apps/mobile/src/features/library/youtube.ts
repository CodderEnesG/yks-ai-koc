// YouTube oynatma listesi (T31, T34). Liste `youtube-import` fonksiyonundan gelir (telefon YouTube'u
// doğrudan çağırmaz); videolar cihazda `yt_playlist`'te durur. YouTube API Hizmetleri III.E.4: API verisi
// en fazla 30 gün; 25 günü geçen liste açılışta yenilenir, yenilenemezse 30. günde silinir ve liste
// yenilenene kadar plana girmez.
import { and, eq, isNull, lt } from 'drizzle-orm';
import { randomUUID } from 'expo-crypto';

import { db } from '@/db/client';
import { libraryItem, ytPlaylist } from '@/db/schema';
import { supabase } from '@/lib/supabase';

import { nextSortOrder } from './repo';

export type PlaylistVideo = (typeof ytPlaylist.$inferSelect)['videos'][number];

export interface ImportedPlaylist {
  playlist: { id: string; title: string; channelTitle: string };
  videos: PlaylistVideo[];
  fetchedAt: string;
}

export type ImportError =
  'invalid_link' | 'not_found' | 'empty' | 'quota' | 'consent' | 'unavailable' | 'network';

export class YouTubeImportError extends Error {
  constructor(readonly code: ImportError) {
    super(code);
  }
}

const REFRESH_DAYS = 25;
const MAX_AGE_DAYS = 30;
const DAY_MS = 86_400_000;

export async function importPlaylist(input: string): Promise<ImportedPlaylist> {
  const { data, error } = await supabase.functions.invoke('youtube-import', { body: { input } });
  if (error) {
    const status = (error as { context?: { status?: number } }).context?.status;
    throw new YouTubeImportError(
      status === 400
        ? 'invalid_link'
        : status === 404
          ? 'not_found'
          : status === 422
            ? 'empty'
            : status === 429
              ? 'quota'
              : status === 403
                ? 'consent'
                : status === 503
                  ? 'unavailable'
                  : 'network',
    );
  }
  return data as ImportedPlaylist;
}

function saveCache(p: ImportedPlaylist): void {
  const row = {
    title: p.playlist.title,
    channelTitle: p.playlist.channelTitle,
    videos: p.videos,
    fetchedAt: p.fetchedAt,
  };
  db.insert(ytPlaylist)
    .values({ id: p.playlist.id, ...row })
    .onConflictDoUpdate({ target: ytPlaylist.id, set: row })
    .run();
}

export function addPlaylist(
  p: ImportedPlaylist,
  watchSpeed: number,
  noteRatio: number,
  now: Date,
): void {
  const timestamp = now.toISOString();
  db.transaction(() => {
    saveCache(p);
    db.insert(libraryItem)
      .values({
        id: randomUUID(),
        sourceKind: 'playlist',
        ytPlaylistId: p.playlist.id,
        watchSpeed,
        noteRatio,
        sortOrder: nextSortOrder(),
        status: 'active',
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .run();
  });
}

/**
 * Açılışta ve geri yüklemeden sonra: önbelleği olmayan ya da 25 günü geçen listeleri yeniler; yenilenemeyen
 * ve 30 günü geçen önbelleği siler. Oturum yoksa yalnız siler. Kütüphanede olmayan önbellek de silinir.
 */
export async function refreshPlaylists(now: Date, signedIn: boolean): Promise<void> {
  const ids = [
    ...new Set(
      db
        .select({ id: libraryItem.ytPlaylistId })
        .from(libraryItem)
        .where(and(eq(libraryItem.sourceKind, 'playlist'), isNull(libraryItem.deletedAt)))
        .all()
        .flatMap((r) => (r.id ? [r.id] : [])),
    ),
  ];
  const cached = new Map(
    db
      .select({ id: ytPlaylist.id, fetchedAt: ytPlaylist.fetchedAt })
      .from(ytPlaylist)
      .all()
      .map((r) => [r.id, r.fetchedAt]),
  );
  for (const id of cached.keys()) {
    if (!ids.includes(id)) db.delete(ytPlaylist).where(eq(ytPlaylist.id, id)).run();
  }

  const stale = new Date(now.getTime() - REFRESH_DAYS * DAY_MS).toISOString();
  if (signedIn) {
    for (const id of ids) {
      const fetchedAt = cached.get(id);
      if (fetchedAt && fetchedAt > stale) continue;
      try {
        saveCache(await importPlaylist(id));
      } catch {
        // Ağ ya da kota: sonraki açılışta yeniden denenir; 30 gün sınırı aşağıda uygulanır.
      }
    }
  }
  const expired = new Date(now.getTime() - MAX_AGE_DAYS * DAY_MS).toISOString();
  db.delete(ytPlaylist).where(lt(ytPlaylist.fetchedAt, expired)).run();
}
