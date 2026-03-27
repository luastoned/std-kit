import { expect, describe, it } from 'vitest';
import { unique, compact, reverse, shuffle, flatten, fill, chunk, cluster, countBy, groupBy, orderBy, uniqueBy, cartesian, combinations } from './array';

describe('unique', () => {
  it('should remove duplicate numbers from array', () => {
    expect(unique([1, 2, 3, 3, 3])).toEqual([1, 2, 3]);
  });

  it('should remove duplicate strings from array', () => {
    expect(unique(['a', 'b', 'a', 'c', 'b'])).toEqual(['a', 'b', 'c']);
  });

  it('should return empty array when input is empty', () => {
    expect(unique([])).toEqual([]);
  });
});

describe('compact', () => {
  it('should remove all falsy values', () => {
    expect(compact([0, 1, false, 2, '', 3, null, undefined, NaN])).toEqual([1, 2, 3]);
  });

  it('should keep all truthy values', () => {
    expect(compact([1, 'a', true, {}, []])).toEqual([1, 'a', true, {}, []]);
  });

  it('should return empty array when all values are falsy', () => {
    expect(compact([null, undefined, false, 0, ''])).toEqual([]);
  });

  it('should return empty array when input is empty', () => {
    expect(compact([])).toEqual([]);
  });

  it('should handle mixed types correctly', () => {
    expect(compact([null, 'hello', 0, 'world', false, 42])).toEqual(['hello', 'world', 42]);
  });
});

describe('reverse', () => {
  it('should create new reversed array by default', () => {
    const original = [1, 2, 3];
    const reversed = reverse(original);
    expect(reversed).toEqual([3, 2, 1]);
    expect(original).toEqual([1, 2, 3]); // original unchanged
  });

  it('should reverse array in place when inPlace is true', () => {
    const array = [1, 2, 3];
    const reversed = reverse(array, true);
    expect(reversed).toEqual([3, 2, 1]);
    expect(array).toEqual([3, 2, 1]); // original changed
  });
});

describe('shuffle', () => {
  it('should create new shuffled array by default', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffle(original);
    expect(shuffled).toHaveLength(5);
    expect(original).toEqual([1, 2, 3, 4, 5]); // original unchanged
  });

  it('should shuffle array in place when inPlace is true', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffle(array, true);
    expect(shuffled).toHaveLength(5);
    expect(shuffled).toBe(array); // same reference
  });
});

describe('flatten', () => {
  it('should flatten nested arrays', () => {
    expect(flatten([[1, 2], [3, 4], [5]])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should flatten deeply nested arrays', () => {
    expect(flatten([[[1]], [2, [3, 4]], [5]])).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return empty array when input is empty', () => {
    expect(flatten([])).toEqual([]);
  });

  it('should flatten to specified depth', () => {
    expect(flatten([[[1, 2]], [[3, 4]]], 1)).toEqual([
      [1, 2],
      [3, 4],
    ]);
    expect(flatten([[[1, 2]], [[3, 4]]], 2)).toEqual([1, 2, 3, 4]);
  });

  it('should not flatten when depth is 0', () => {
    expect(
      flatten(
        [
          [1, 2],
          [3, 4],
        ],
        0,
      ),
    ).toEqual([
      [1, 2],
      [3, 4],
    ]);
  });
});

describe('fill', () => {
  it('should create array of specified size with given value', () => {
    expect(fill(3, 'x')).toEqual(['x', 'x', 'x']);
  });

  it('should create array filled with numbers', () => {
    expect(fill(4, 0)).toEqual([0, 0, 0, 0]);
  });

  it('should return empty array when size is zero', () => {
    expect(fill(0, 'test')).toEqual([]);
  });
});

describe('chunk', () => {
  it('should chunk array into pairs by default', () => {
    expect(chunk([1, 2, 3, 4, 5, 6])).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
    ]);
  });

  it('should chunk array with custom size', () => {
    expect(chunk([1, 2, 3, 4, 5, 6], 3)).toEqual([
      [1, 2, 3],
      [4, 5, 6],
    ]);
  });

  it('should handle incomplete last chunk', () => {
    expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
  });

  it('should return empty array when input is empty', () => {
    expect(chunk([])).toEqual([]);
  });

  it('should clamp invalid size values to 1', () => {
    expect(chunk([1, 2, 3], 0)).toEqual([[1], [2], [3]]);
    expect(chunk([1, 2, 3], -2)).toEqual([[1], [2], [3]]);
    expect(chunk([1, 2, 3], 0.5)).toEqual([[1], [2], [3]]);
    expect(chunk([1, 2, 3], Number.NaN)).toEqual([[1], [2], [3]]);
  });
});

describe('cluster (deprecated)', () => {
  it('should work as alias for chunk', () => {
    expect(cluster([1, 2, 3, 4])).toEqual(chunk([1, 2, 3, 4]));
  });
});

describe('countBy', () => {
  it('should count by property key', () => {
    const items = [{ type: 'a' }, { type: 'b' }, { type: 'a' }, { type: 'c' }];
    expect(countBy(items, 'type')).toEqual({ a: 2, b: 1, c: 1 });
  });

  it('should count by function result', () => {
    const items = ['apple', 'banana', 'apricot', 'blueberry'];
    expect(countBy(items, (item) => item.charAt(0))).toEqual({ a: 2, b: 2 });
  });

  it('should count numbers correctly', () => {
    expect(countBy([1, 2, 1, 3, 2, 1], (x) => x)).toEqual({ 1: 3, 2: 2, 3: 1 });
  });
});

describe('groupBy', () => {
  it('should group by property key', () => {
    const items = [
      { type: 'fruit', name: 'apple' },
      { type: 'vegetable', name: 'carrot' },
      { type: 'fruit', name: 'banana' },
    ];
    expect(groupBy(items, 'type')).toEqual({
      fruit: [
        { type: 'fruit', name: 'apple' },
        { type: 'fruit', name: 'banana' },
      ],
      vegetable: [{ type: 'vegetable', name: 'carrot' }],
    });
  });

  it('should group by function result', () => {
    const items = [1, 2, 3, 4, 5, 6];
    expect(groupBy(items, (x) => (x % 2 === 0 ? 'even' : 'odd'))).toEqual({
      odd: [1, 3, 5],
      even: [2, 4, 6],
    });
  });
});

describe('orderBy', () => {
  it('should sort by single key in ascending order', () => {
    const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
    expect(orderBy(items, ['age'], ['asc'])).toEqual([{ age: 20 }, { age: 25 }, { age: 30 }]);
  });

  it('should sort by single key in descending order', () => {
    const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
    expect(orderBy(items, ['age'], ['desc'])).toEqual([{ age: 30 }, { age: 25 }, { age: 20 }]);
  });

  it('should sort by multiple keys with different orders', () => {
    const items = [
      { name: 'John', age: 30 },
      { name: 'Jane', age: 25 },
      { name: 'John', age: 20 },
    ];
    expect(orderBy(items, ['name', 'age'], ['asc', 'desc'])).toEqual([
      { name: 'Jane', age: 25 },
      { name: 'John', age: 30 },
      { name: 'John', age: 20 },
    ]);
  });

  it('should sort by function result', () => {
    const items = ['apple', 'pie', 'banana'];
    expect(orderBy(items, [(item) => item.length], ['asc'])).toEqual(['pie', 'apple', 'banana']);
  });

  it('should sort array in place when inPlace is true', () => {
    const items = [{ age: 30 }, { age: 20 }, { age: 25 }];
    const sorted = orderBy(items, ['age'], ['asc'], true);
    expect(sorted).toEqual([{ age: 20 }, { age: 25 }, { age: 30 }]);
    expect(items).toEqual([{ age: 20 }, { age: 25 }, { age: 30 }]); // original changed
  });
});

describe('uniqueBy', () => {
  it('should return unique items by property key', () => {
    const items = [
      { id: 1, name: 'John' },
      { id: 2, name: 'Jane' },
      { id: 1, name: 'Johnny' },
    ];
    expect(uniqueBy(items, 'id')).toEqual([
      { id: 1, name: 'Johnny' },
      { id: 2, name: 'Jane' },
    ]);
  });

  it('should return unique items by function result', () => {
    const items = ['apple', 'apricot', 'banana', 'blueberry'];
    expect(uniqueBy(items, (item) => item.charAt(0))).toEqual(['apricot', 'blueberry']);
  });
});

describe('cartesian', () => {
  it('should calculate cartesian product of two arrays', () => {
    expect(
      cartesian<number | string>([
        [1, 2],
        ['a', 'b'],
      ]),
    ).toEqual([
      [1, 'a'],
      [2, 'a'],
      [1, 'b'],
      [2, 'b'],
    ]);
  });

  it('should calculate cartesian product of three arrays', () => {
    expect(cartesian<number | string>([[1], ['a', 'b'], ['x']])).toEqual([
      [1, 'a', 'x'],
      [1, 'b', 'x'],
    ]);
  });

  it('should return empty array when input is empty', () => {
    expect(cartesian([])).toEqual([]);
  });

  it('should return empty array when any sub-array is empty', () => {
    expect(cartesian([[], [1, 2]])).toEqual([]);
  });
});

describe('combinations', () => {
  it('should generate all combinations of two elements', () => {
    expect(combinations([1, 2])).toEqual([[1], [2], [1, 2]]);
  });

  it('should generate all combinations of three elements', () => {
    const result = combinations([1, 2, 3]);
    expect(result).toHaveLength(7); // 2^3 - 1
    expect(result).toContainEqual([1]);
    expect(result).toContainEqual([2]);
    expect(result).toContainEqual([3]);
    expect(result).toContainEqual([1, 2]);
    expect(result).toContainEqual([1, 3]);
    expect(result).toContainEqual([2, 3]);
    expect(result).toContainEqual([1, 2, 3]);
  });

  it('should return empty array when input is empty', () => {
    expect(combinations([])).toEqual([]);
  });

  it('should return single combination for single element', () => {
    expect(combinations(['x'])).toEqual([['x']]);
  });
});
