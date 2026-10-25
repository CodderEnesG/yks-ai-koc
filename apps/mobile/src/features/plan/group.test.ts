import { describe, expect, it } from 'vitest';

import { groupTasks, type TaskLike } from './group';

const t = (
  id: string,
  item: string,
  first: number,
  last: number,
  kind: TaskLike['kind'] = 'pages',
): TaskLike => ({
  id,
  libraryItemId: item,
  unitKey: `${item}-${first}`,
  title: item,
  kind,
  first,
  last,
  estSeconds: (last - first + 1) * 60,
});

describe('groupTasks', () => {
  it('aynı kitabın ardışık birimlerini tek aralıkta toplar', () => {
    const [g] = groupTasks([t('1', 'a', 11, 16), t('2', 'a', 17, 22), t('3', 'a', 23, 28)]);
    expect(g).toMatchObject({
      ranges: [{ first: 11, last: 28 }],
      unitCount: 3,
      estSeconds: 18 * 60,
      taskIds: ['1', '2', '3'],
    });
  });

  it('boşluk varsa ayrı aralık, farklı kitap ayrı kart; sıra korunur', () => {
    const groups = groupTasks([
      t('1', 'a', 11, 16),
      t('2', 'b', 1, 3, 'tests'),
      t('3', 'a', 30, 35),
    ]);
    expect(groups.map((g) => g.libraryItemId)).toEqual(['a', 'b']);
    expect(groups[0]!.ranges).toEqual([
      { first: 11, last: 16 },
      { first: 30, last: 35 },
    ]);
  });

  it('boş girdi boş çıktı', () => {
    expect(groupTasks([])).toEqual([]);
  });

  it('durum: yarım kalan grup karışık, yapılan aralık ve nedenler', () => {
    const tasks: TaskLike[] = [
      { ...t('1', 'a', 11, 16), status: 'done' },
      { ...t('2', 'a', 17, 20), unitKey: 'a-17', status: 'done' },
      { ...t('3', 'a', 21, 22), unitKey: 'a-17', status: 'skipped', reason: 'zaman_yetmedi' },
      { ...t('4', 'b', 1, 3, 'tests'), status: 'skipped', reason: 'konu_zor' },
      { ...t('5', 'c', 1, 5), status: 'done' },
    ];
    const [a, b, c] = groupTasks(tasks);
    expect(a).toMatchObject({
      status: 'mixed',
      doneRanges: [{ first: 11, last: 20 }],
      reasons: ['zaman_yetmedi'],
    });
    expect(a!.ranges).toEqual([{ first: 11, last: 22 }]);
    expect(a!.unitCount).toBe(2); // bölünen birim bir kez sayılır
    expect(b).toMatchObject({ status: 'skipped', doneRanges: [], reasons: ['konu_zor'] });
    expect(c!.status).toBe('done');
    expect(groupTasks([t('6', 'd', 1, 2)])[0]!.status).toBe('planned');
  });
});
