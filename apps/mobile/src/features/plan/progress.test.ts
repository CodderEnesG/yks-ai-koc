import { describe, expect, it } from 'vitest';

import { doneItemsByLibraryItem, percent } from './progress';

describe('doneItemsByLibraryItem', () => {
  it('birim içinde aralıkları birleştirir, çakışanı bir kez sayar', () => {
    const m = doneItemsByLibraryItem([
      { libraryItemId: 'a', unitKey: 'u1', first: 11, last: 16 },
      { libraryItemId: 'a', unitKey: 'u1', first: 14, last: 20 },
      { libraryItemId: 'a', unitKey: 'u2', first: 21, last: 22 },
      { libraryItemId: 'b', unitKey: '1', first: 1, last: 5 },
    ]);
    expect(m.get('a')).toBe(10 + 2);
    expect(m.get('b')).toBe(5);
  });
});

describe('percent', () => {
  it('aşağı yuvarlar, 100le sınırlar, sıfır toplamda 0', () => {
    expect(percent(1, 3)).toBe(33);
    expect(percent(130, 130)).toBe(100);
    expect(percent(5, 0)).toBe(0);
  });
});
