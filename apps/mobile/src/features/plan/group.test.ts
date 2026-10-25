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
});
