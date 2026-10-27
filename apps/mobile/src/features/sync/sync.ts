// Senkron (T16, karar 14: cihaz asıl kaynak, sunucu kopya). Son gönderimden beri değişen satırlar
// sunucuya yüklenir (upsert, sıra: profil → kütüphane → görev → check-in); tam çekme yalnız telefonda
// profil yokken (yeni telefon / yeniden kurulum). Gönderim imleci app_meta'da.
import { eq, gte } from 'drizzle-orm';

import { db } from '@/db/client';
import { appMeta, catalogEdition, checkin, libraryItem, planTask, profile } from '@/db/schema';
import { fetchCatalog, fetchUnits } from '@/features/library/catalog';
import { refreshPlaylists } from '@/features/library/youtube';
import { supabase } from '@/lib/supabase';

import {
  canSync,
  checkinFromServer,
  checkinToServer,
  libraryItemFromServer,
  libraryItemToServer,
  planTaskFromServer,
  planTaskToServer,
  profileFromServer,
  profileToServer,
} from './mapping';

const CURSOR_KEY = 'sync_pushed_until';

function readCursor(): string {
  const [row] = db.select().from(appMeta).where(eq(appMeta.key, CURSOR_KEY)).all();
  return row?.value ?? '';
}

function writeCursor(value: string): void {
  db.insert(appMeta)
    .values({ key: CURSOR_KEY, value })
    .onConflictDoUpdate({ target: appMeta.key, set: { value } })
    .run();
}

async function upsert(table: string, rows: object[]): Promise<void> {
  if (rows.length === 0) return;
  const { error } = await supabase.from(table).upsert(rows, { onConflict: 'id' });
  if (error) throw new Error(`${table}: ${error.message}`);
}

let inflight: Promise<number> | null = null;

/**
 * Değişenleri gönderir; gönderilen satır sayısını döner. Giriş yoksa ya da onay yoksa 0. Aynı anda tek
 * gönderim: çalışırken gelen çağrı aynı işi bekler (eşzamanlı upsert'ler profil benzersizliğine takılıyordu).
 */
export function push(): Promise<number> {
  inflight ??= pushOnce().finally(() => {
    inflight = null;
  });
  return inflight;
}

async function pushOnce(): Promise<number> {
  const [p] = db.select().from(profile).limit(1).all();
  const { data } = await supabase.auth.getSession();
  if (!p || !data.session || !canSync(p.consentStatus)) return 0;

  // İmleçle aynı zamanlı satırlar da gönderilir (upsert tekrar zararsız); saat geri giderse kaçabilir,
  // tek cihaz kabulünde yeterli.
  const since = readCursor();
  const items = db.select().from(libraryItem).all();
  const catalogItems = new Set(items.filter((i) => i.editionId).map((i) => i.id));
  const rows = {
    profile: db.select().from(profile).where(gte(profile.updatedAt, since)).all(),
    library_item: items.filter((i) => i.updatedAt >= since),
    plan_task: db.select().from(planTask).where(gte(planTask.updatedAt, since)).all(),
    checkin: db.select().from(checkin).where(gte(checkin.updatedAt, since)).all(),
  };
  await upsert('profile', rows.profile.map(profileToServer));
  await upsert('library_item', rows.library_item.map(libraryItemToServer));
  await upsert(
    'plan_task',
    rows.plan_task.map((t) => planTaskToServer(t, catalogItems.has(t.libraryItemId))),
  );
  await upsert('checkin', rows.checkin.map(checkinToServer));

  const all = [...rows.profile, ...rows.library_item, ...rows.plan_task, ...rows.checkin];
  if (all.length > 0) writeCursor(all.reduce((m, r) => (r.updatedAt > m ? r.updatedAt : m), since));
  return all.length;
}

/**
 * Yeni telefonda geri yükleme: sunucudaki profil, kütüphane, görev ve check-in'ler cihaza yazılır;
 * katalog kitaplarının birimleri katalogdan çekilir. Cihazda profil varsa dokunulmaz. Profil geldiyse true.
 */
export async function restore(): Promise<boolean> {
  if (db.select().from(profile).limit(1).all().length > 0) return true;
  const fetchAll = async (table: string) => {
    const { data, error } = await supabase.from(table).select('*');
    if (error) throw new Error(`${table}: ${error.message}`);
    return data;
  };
  const [profiles, items, tasks, checkins] = await Promise.all([
    fetchAll('profile'),
    fetchAll('library_item'),
    fetchAll('plan_task'),
    fetchAll('checkin'),
  ]);
  if (profiles.length === 0) return false;

  const editionIds = [
    ...new Set(items.map((i) => i.edition_id).filter((id): id is string => !!id)),
  ];
  const catalog = editionIds.length > 0 ? await fetchCatalog() : [];
  const editions = await Promise.all(
    editionIds.map(async (id) => ({
      edition: catalog.find((e) => e.id === id)!,
      units: await fetchUnits(id),
    })),
  );

  const now = new Date().toISOString();
  db.transaction((tx) => {
    tx.insert(profile).values(profileFromServer(profiles[0])).run();
    for (const { edition, units } of editions.filter((e) => e.edition)) {
      tx.insert(catalogEdition)
        .values({ ...edition, units, fetchedAt: now })
        .onConflictDoNothing()
        .run();
    }
    for (const i of items) tx.insert(libraryItem).values(libraryItemFromServer(i)).run();
    for (const t of tasks) tx.insert(planTask).values(planTaskFromServer(t)).run();
    for (const c of checkins) tx.insert(checkin).values(checkinFromServer(c)).run();
  });
  // Geri yüklenenler sunucuda zaten var; imleç ileri alınır.
  writeCursor(now);
  // YouTube listelerinin videoları senkronlanmaz (API verisi); sunucu önbelleğinden yeniden gelir.
  await refreshPlaylists(new Date(), true).catch(() => undefined);
  return true;
}

/** Giriş yapılmış ve senkron açıksa son gönderim zamanı (Ayarlar'da gösterilir). */
export function lastPushedAt(): string | null {
  return readCursor() || null;
}
