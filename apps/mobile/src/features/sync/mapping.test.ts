import { describe, expect, it } from 'vitest';

import {
  canSync,
  libraryItemFromServer,
  libraryItemToServer,
  planTaskFromServer,
  planTaskToServer,
  profileFromServer,
  profileToServer,
} from './mapping';

const ts = '2026-10-26T08:00:00.000Z';

describe('canSync', () => {
  it('yalnız onay gerekmeyen ya da onay veren öğrenci', () => {
    expect(canSync('not_required')).toBe(true);
    expect(canSync('granted')).toBe(true);
    expect(canSync('pending')).toBe(false);
    expect(canSync('withdrawn')).toBe(false);
  });
});

describe('eşleme gidiş-dönüş', () => {
  it('profil', () => {
    const p = {
      id: 'p1',
      birthYear: 2008,
      birthMonth: 3,
      grade: '12' as const,
      field: 'SAY' as const,
      targetKind: 'puan' as const,
      targetValue: 450.5,
      examDate: '2027-06-19',
      weekdayMinutes: [120, 120, 120, 120, 120, 240, 240],
      consentStatus: 'not_required' as const,
      createdAt: ts,
      updatedAt: ts,
    };
    const server = profileToServer(p);
    expect(server).not.toHaveProperty('user_id');
    // Sunucu numeric'i metin döndürebilir.
    expect(profileFromServer({ ...server, target_value: '450.50' as unknown as number })).toEqual(
      p,
    );
  });

  it('kütüphane ve görev; katalog birimi unit_id, özel baskı custom_unit_key', () => {
    const item = {
      id: 'i1',
      sourceKind: 'book' as const,
      editionId: null,
      customEdition: {
        title: 'X',
        units: [{ key: '1', kind: 'tests' as const, first: 1, last: 40 }],
      },
      minutesPerItem: 15,
      sortOrder: 0,
      priority: 0,
      status: 'active' as const,
      createdAt: ts,
      updatedAt: ts,
      deletedAt: null,
    };
    expect(libraryItemFromServer(libraryItemToServer(item))).toEqual(item);

    const task = {
      id: 't1',
      libraryItemId: 'i1',
      day: '2026-10-26',
      kind: 'pages' as const,
      unitKey: 'unit-uuid',
      rangeFirst: 11,
      rangeLast: 16,
      estSeconds: 1800,
      status: 'skipped' as const,
      reason: 'konu_zor' as const,
      createdAt: ts,
      updatedAt: ts,
      deletedAt: null,
    };
    expect(planTaskToServer(task, true)).toMatchObject({
      unit_id: 'unit-uuid',
      custom_unit_key: null,
    });
    expect(planTaskToServer(task, false)).toMatchObject({
      unit_id: null,
      custom_unit_key: 'unit-uuid',
    });
    expect(planTaskFromServer(planTaskToServer(task, true))).toEqual(task);
    expect(planTaskFromServer(planTaskToServer(task, false))).toEqual(task);
  });
});
