import { and, asc, eq, isNull, max } from 'drizzle-orm';
import { useLiveQuery } from 'drizzle-orm/expo-sqlite/query';
import { randomUUID } from 'expo-crypto';

import { db } from '@/db/client';
import { catalogEdition, libraryItem } from '@/db/schema';

import {
  type CatalogEdition,
  editionTitle,
  type ItemKind,
  type QuickAdd,
  quickAddEdition,
} from './rules';

export interface LibraryEntry {
  id: string;
  title: string;
  kind: ItemKind;
  /** Toplam sayfa ya da test sayısı. */
  total: number;
  unitCount: number;
  minutesPerItem: number;
  fromCatalog: boolean;
}

/** Silinmemiş kaynaklar, öğrencinin sırasıyla; `undefined` yükleniyor. */
export function useLibrary(): LibraryEntry[] | undefined {
  const { data, updatedAt } = useLiveQuery(
    db
      .select({ item: libraryItem, edition: catalogEdition })
      .from(libraryItem)
      .leftJoin(catalogEdition, eq(libraryItem.editionId, catalogEdition.id))
      .where(and(isNull(libraryItem.deletedAt), eq(libraryItem.sourceKind, 'book')))
      .orderBy(asc(libraryItem.sortOrder)),
  );
  if (updatedAt === undefined) return undefined;
  return data.map(({ item, edition }) => {
    if (edition) {
      const pages = edition.units.reduce((a, u) => a + u.pageEnd - u.pageStart + 1, 0);
      return {
        id: item.id,
        title: editionTitle(edition),
        kind: 'pages',
        total: pages,
        unitCount: edition.units.length,
        minutesPerItem: item.minutesPerItem ?? 0,
        fromCatalog: true,
      };
    }
    const units = item.customEdition?.units ?? [];
    return {
      id: item.id,
      title: item.customEdition?.title ?? '',
      kind: units[0]?.kind ?? 'pages',
      total: units.reduce((a, u) => a + u.last - u.first + 1, 0),
      unitCount: units.length,
      minutesPerItem: item.minutesPerItem ?? 0,
      fromCatalog: false,
    };
  });
}

function nextSortOrder(): number {
  const [row] = db
    .select({ value: max(libraryItem.sortOrder) })
    .from(libraryItem)
    .all();
  return (row?.value ?? -1) + 1;
}

export function addCatalogBook(
  edition: CatalogEdition,
  units: { id: string; seq: number; pageStart: number; pageEnd: number }[],
  minutesPerItem: number,
  now: Date,
): void {
  const timestamp = now.toISOString();
  db.transaction((tx) => {
    tx.insert(catalogEdition)
      .values({ ...edition, units, fetchedAt: timestamp })
      .onConflictDoUpdate({ target: catalogEdition.id, set: { units, fetchedAt: timestamp } })
      .run();
    tx.insert(libraryItem)
      .values({
        id: randomUUID(),
        sourceKind: 'book',
        editionId: edition.id,
        minutesPerItem,
        sortOrder: nextSortOrder(),
        status: 'active',
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .run();
  });
}

export function addQuickBook(input: QuickAdd, now: Date): void {
  const timestamp = now.toISOString();
  db.insert(libraryItem)
    .values({
      id: randomUUID(),
      sourceKind: 'book',
      customEdition: quickAddEdition(input),
      minutesPerItem: input.minutesPerItem,
      sortOrder: nextSortOrder(),
      status: 'active',
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .run();
}

/** Silme yok; işaretlenir (sunucuyla aynı kural). */
export function removeLibraryItem(id: string, now: Date): void {
  const timestamp = now.toISOString();
  db.update(libraryItem)
    .set({ deletedAt: timestamp, updatedAt: timestamp })
    .where(eq(libraryItem.id, id))
    .run();
}
