import { isArray, isFunction } from '~/utilities/generic';

/**
 * Values removed by {@link compact}. `NaN` is also removed at runtime but cannot be represented as a distinct TypeScript type.
 */
export type Falsy = false | 0 | 0n | '' | null | undefined;

/**
 * Property names whose values can safely be used as record keys.
 */
export type KeyableProperty<T> = { [P in keyof T]-?: T[P] extends PropertyKey ? P : never }[keyof T];

/**
 * Selects a record key from an array item.
 */
export type KeySelector<T, K extends PropertyKey = PropertyKey> = { [P in keyof T]-?: T[P] extends K ? P : never }[keyof T] | ((item: T) => K);

/**
 * Selects a directly orderable value from an array item.
 */
export type OrderSelector<T> = keyof T | ((item: T) => string | number | null | undefined);

/**
 * Options for eagerly collecting combinations.
 */
export interface CombinationsOptions {
  /**
   * Maximum number of combinations to allocate. Defaults to 100,000.
   */
  readonly maxResults?: number;
}

const DEFAULT_MAX_COMBINATION_RESULTS = 100_000;

/**
 * Defines a safe enumerable record entry, including reserved keys such as `__proto__`.
 */
function setRecordEntry<T>(record: Record<PropertyKey, T>, key: PropertyKey, value: T): void {
  Object.defineProperty(record, key, {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  });
}

/**
 * Builds a normalized key selector function.
 *
 * @internal
 */
function toSelectorFn<T, Value>(selector: keyof T | ((item: T) => Value)): (item: T) => Value {
  if (isFunction(selector)) {
    return selector as (item: T) => Value;
  }

  return function valueSelector(item: T): Value {
    return item[selector as keyof T] as Value;
  };
}

/**
 * Returns a new array with unique elements from the input array.
 *
 * @example
 *   ```ts
 *   import { unique } from 'std-kit';
 *
 *   unique([1, 2, 2, 3, 1]);
 *   // [1, 2, 3]
 *   ```;
 *
 * @template T - The type of elements in the array.
 * @param array - The input array.
 * @returns A new array with unique elements.
 */
export function unique<T>(array: readonly T[]): T[] {
  return Array.from(new Set(array));
}

/**
 * Returns a new array with all falsy values removed. Falsy values include: false, null, 0, "", undefined, and NaN.
 *
 * @template T - The type of elements in the array.
 * @param array - The input array.
 * @returns A new array with only truthy values. Literal falsy members are excluded from the element type.
 */
export function compact<T>(array: readonly T[]): Array<Exclude<T, Falsy>> {
  return array.filter(Boolean) as Array<Exclude<T, Falsy>>;
}

/**
 * Reverses the elements of an array.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to be reversed.
 * @param inPlace - Specifies whether to reverse the array in place or create a new reversed array. Readonly arrays only support the default non-mutating mode.
 * @returns The reversed array.
 */
export function reverse<T, const InPlace extends boolean = false>(array: readonly T[] & (true extends InPlace ? T[] : unknown), inPlace?: InPlace): T[] {
  const result: T[] = inPlace ? (array as T[]) : [...array];
  return result.reverse();
}

/**
 * Shuffles the elements of an array using the Fisher-Yates algorithm.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to shuffle.
 * @param inPlace - Specifies whether to shuffle the array in place or create a new shuffled array. Readonly arrays only support the default non-mutating mode.
 * @returns The shuffled array.
 */
export function shuffle<T, const InPlace extends boolean = false>(array: readonly T[] & (true extends InPlace ? T[] : unknown), inPlace?: InPlace): T[] {
  const result: T[] = inPlace ? (array as T[]) : [...array];

  // Fisher-Yates shuffle algorithm
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const current = result[i];
    const swapValue = result[j];
    result[i] = swapValue as T;
    result[j] = current as T;
  }

  return result;
}

/**
 * Flattens a nested array up to the specified depth.
 *
 * @template T - The type of elements in the flattened array.
 * @param array - The array to flatten.
 * @param depth - The maximum depth to flatten. Defaults to Infinity for full flattening.
 * @returns The flattened array.
 */
export function flatten<T>(array: readonly unknown[], depth = Infinity): T[] {
  if (depth < 1) {
    return array.slice() as T[];
  }

  return array.reduce((acc: T[], item: unknown) => acc.concat(isArray(item) && depth > 1 ? flatten(item, depth - 1) : (item as T)), [] as T[]);
}

/**
 * Creates a new array of a specified size and fills it with the provided value.
 *
 * @template T - The type of elements in the array.
 * @param size - The size of the array to create. Positive fractional sizes are floored; invalid or non-positive sizes return an empty array.
 * @param value - The value to fill the array with.
 * @returns An array of the specified size filled with the provided value.
 */
export function fill<T>(size: number, value: T): T[] {
  const normalizedSize = size <= 0 || !Number.isFinite(size) ? 0 : Math.floor(size);
  return Array(normalizedSize).fill(value);
}

/**
 * Splits an array into chunks of a specified size.
 *
 * @example
 *   ```ts
 *   import { chunk } from 'std-kit';
 *
 *   chunk(['a', 'b', 'c', 'd', 'e'], 2);
 *   // [['a', 'b'], ['c', 'd'], ['e']]
 *   ```;
 *
 * @template T - The type of elements in the array.
 * @param array - The array to be chunked.
 * @param size - The size of each chunk. Default is 2.
 * @returns An array of chunks, each containing elements from the original array.
 */
export function chunk<T>(array: readonly T[], size = 2): T[][] {
  const normalizedSize = size <= 0 || !Number.isFinite(size) ? 1 : Math.max(1, Math.floor(size));
  const chunks: T[][] = [];
  for (let idx = 0; idx < array.length; idx += normalizedSize) {
    chunks.push(array.slice(idx, idx + normalizedSize));
  }

  return chunks;
}

/**
 * Counts the occurrences of each unique key in an array. If a key function is provided, it will be used to extract the key from each element. If a key property
 * is provided, it will be used to extract the key from each element.
 *
 * @template T - The type of elements in the array.
 * @template K - The type of the key used for counting.
 * @param array - The array to count the occurrences in.
 * @param key - The key used for counting. Can be a property name or a function that returns the key.
 * @returns An object that maps each unique key to its count.
 */
export function countBy<T, K extends PropertyKey>(array: readonly T[], key: (item: T) => K): Record<K, number>;
export function countBy<T, P extends KeyableProperty<T>>(array: readonly T[], key: P): Record<Extract<T[P], PropertyKey>, number>;
export function countBy<T>(array: readonly T[], key: KeySelector<T>): Record<PropertyKey, number> {
  const keyFn = toSelectorFn<T, PropertyKey>(key);
  return array.reduce(
    (acc, item) => {
      const itemKey = keyFn(item);
      const count = Object.hasOwn(acc, itemKey) ? acc[itemKey] : 0;
      setRecordEntry(acc, itemKey, (count ?? 0) + 1);
      return acc;
    },
    {} as Record<PropertyKey, number>,
  );
}

/**
 * Groups the elements of an array by a specified key. If a key function is provided, it will be used to extract the key from each element. If a key property is
 * provided, it will be used to extract the key from each element.
 *
 * @example
 *   ```ts
 *   import { groupBy } from 'std-kit';
 *
 *   groupBy(
 *     [
 *       { id: 1, role: 'admin' },
 *       { id: 2, role: 'user' },
 *       { id: 3, role: 'admin' },
 *     ],
 *     'role',
 *   );
 *   // { admin: [{ id: 1, role: 'admin' }, { id: 3, role: 'admin' }], user: [{ id: 2, role: 'user' }] }
 *   ```;
 *
 * @template T - The type of the elements in the array.
 * @template K - The type of the key used for grouping.
 * @param array - The array to group.
 * @param key - The key used for grouping. Can be a property name or a function that returns the key.
 * @returns An object where the keys are the grouped values and the values are arrays of elements that belong to each group.
 */
export function groupBy<T, K extends PropertyKey>(array: readonly T[], key: (item: T) => K): Record<K, T[]>;
export function groupBy<T, P extends KeyableProperty<T>>(array: readonly T[], key: P): Record<Extract<T[P], PropertyKey>, T[]>;
export function groupBy<T>(array: readonly T[], key: KeySelector<T>): Record<PropertyKey, T[]> {
  const result = {} as Record<PropertyKey, T[]>;
  const keyFn = toSelectorFn<T, PropertyKey>(key);

  for (const item of array) {
    const itemKey = keyFn(item);
    if (!Object.hasOwn(result, itemKey)) {
      setRecordEntry(result, itemKey, []);
    }

    (result[itemKey] as T[]).push(item);
  }

  return result;
}

/**
 * Sorts an array of objects based on the specified keys and orders. If a key function is provided, it will be used to extract the key from each element. If a
 * key property is provided, it will be used to extract the key from each element. `null` and `undefined` sort after defined values in ascending order and
 * before defined values in descending order. Missing values remain tied and can be ordered by subsequent keys.
 *
 * @example
 *   ```ts
 *   import { orderBy } from 'std-kit';
 *
 *   orderBy(
 *     [
 *       { name: 'Ada', score: 20 },
 *       { name: 'Grace', score: 40 },
 *       { name: 'Ada', score: 10 },
 *     ],
 *     ['name', 'score'],
 *     ['asc', 'desc'],
 *   );
 *   // [{ name: 'Ada', score: 20 }, { name: 'Ada', score: 10 }, { name: 'Grace', score: 40 }]
 *   ```;
 *
 * @template T - The type of the array elements.
 * @template K - The type of the keys used for sorting.
 * @param array - The array to be sorted.
 * @param keys - The keys or functions used for sorting.
 * @param orders - The sort orders for each key.
 * @param inPlace - Indicates whether to sort the array in place or return a new sorted array. Readonly arrays only support the default non-mutating mode.
 * @returns The sorted array.
 */
export function orderBy<T, const InPlace extends boolean = false>(
  array: readonly T[] & (true extends InPlace ? T[] : unknown),
  keys: ReadonlyArray<OrderSelector<T>>,
  orders: ReadonlyArray<'asc' | 'desc'>,
  inPlace?: InPlace,
): T[] {
  const keyFns = keys.map((key) => toSelectorFn<T, string | number | null | undefined>(key));
  const result: T[] = inPlace ? (array as T[]) : [...array];
  return result.sort((a, b) => {
    for (const [idx, keyFn] of keyFns.entries()) {
      const order = orders[idx] ?? 'asc';

      // Determine the value for each item based on the key or function
      const aValue = keyFn(a);
      const bValue = keyFn(b);

      const aIsMissing = aValue === null || aValue === undefined;
      const bIsMissing = bValue === null || bValue === undefined;
      if (aIsMissing && bIsMissing) {
        continue;
      }

      if (aIsMissing || bIsMissing) {
        const comparison = aIsMissing ? 1 : -1;
        return order === 'asc' ? comparison : -comparison;
      }

      if (aValue < bValue) {
        return order === 'asc' ? -1 : 1;
      }

      if (aValue > bValue) {
        return order === 'asc' ? 1 : -1;
      }

      // If the values are equal, continue to the next key
    }

    return 0;
  });
}

/**
 * Returns a new array containing unique elements from the input array based on the specified key. If a key function is provided, it will be used to extract the
 * key from each element. If a key property is provided, it will be used to extract the key from each element.
 *
 * @example
 *   ```ts
 *   import { uniqueBy } from 'std-kit';
 *
 *   uniqueBy(
 *     [
 *       { id: 1, name: 'Ada' },
 *       { id: 1, name: 'Ada Lovelace' },
 *       { id: 2, name: 'Grace' },
 *     ],
 *     'id',
 *   );
 *   // [{ id: 1, name: 'Ada Lovelace' }, { id: 2, name: 'Grace' }]
 *   ```;
 *
 * @template T - The type of elements in the input array.
 * @template K - The type of the key used for uniqueness.
 * @param array - The input array.
 * @param key - The key property or function used to extract the key from each element.
 * @returns A new array containing unique elements based on the specified key.
 */
export function uniqueBy<T, K extends PropertyKey>(array: readonly T[], key: (item: T) => K): T[];
export function uniqueBy<T, P extends KeyableProperty<T>>(array: readonly T[], key: P): T[];
export function uniqueBy<T>(array: readonly T[], key: KeySelector<T>): T[] {
  const itemMap = new Map<PropertyKey, T>();
  const keyFn = toSelectorFn<T, PropertyKey>(key);

  for (const item of array) {
    itemMap.set(keyFn(item), item);
  }

  return Array.from(itemMap.values());
}

/**
 * Generates an iterable iterator that produces all possible combinations of elements from the input arrays.
 *
 * @template T - The type of the elements in the input arrays.
 * @param items - An array of arrays containing the elements to combine.
 * @yields The next cartesian-product tuple from the input arrays.
 * @returns An iterable iterator that produces all possible combinations of elements.
 */
function* cartesianIt<T = unknown>(items: readonly T[][]): IterableIterator<T[]> {
  if (items.length === 0) return;

  const [first, ...rest] = items;
  if (first === undefined) {
    return;
  }

  const remainder = rest.length > 0 ? cartesianIt(rest) : [[]];

  for (const rem of remainder) {
    for (const item of first) {
      yield [item, ...rem];
    }
  }
}

/**
 * Calculates the cartesian product of the given array of arrays.
 *
 * @example
 *   ```ts
 *   import { cartesian } from 'std-kit';
 *
 *   cartesian([
 *     ['S', 'M'],
 *     ['red', 'blue'],
 *   ]);
 *   // [['S', 'red'], ['M', 'red'], ['S', 'blue'], ['M', 'blue']]
 *   ```;
 *
 * @param items - The array of arrays to calculate the cartesian product from.
 * @returns The cartesian product as a 2D array.
 */
export function cartesian<T = unknown>(items: readonly T[][]): T[][] {
  return [...cartesianIt(items)];
}

/**
 * Lazily generates all possible non-empty combinations of the elements in an array.
 *
 * @template T - The type of the array elements.
 * @param items - The array of elements.
 * @yields Each non-empty combination in bitmask order.
 * @returns An iterable iterator of combinations.
 */
export function* iterateCombinations<T>(items: readonly T[]): IterableIterator<T[]> {
  const subsetCount = 1n << BigInt(items.length);

  for (let subsetMask = 1n; subsetMask < subsetCount; subsetMask++) {
    const combination: T[] = [];

    for (let bitPosition = 0; bitPosition < items.length; bitPosition++) {
      if (subsetMask & (1n << BigInt(bitPosition))) {
        combination.push(items[bitPosition] as T);
      }
    }

    yield combination;
  }
}

/**
 * Collects all possible non-empty combinations of the elements in an array.
 *
 * @template T - The type of the array elements.
 * @param items - The array of elements.
 * @param options - Allocation limits for the eager result.
 * @returns An array of arrays representing the combinations.
 * @throws RangeError if `maxResults` is invalid or the result would exceed it.
 */
export function combinations<T>(items: readonly T[], options: Readonly<CombinationsOptions> = {}): T[][] {
  const maxResults = options.maxResults ?? DEFAULT_MAX_COMBINATION_RESULTS;
  if (maxResults !== Number.POSITIVE_INFINITY && (!Number.isSafeInteger(maxResults) || maxResults < 0)) {
    throw new RangeError('maxResults must be a non-negative safe integer or Infinity.');
  }

  const resultCount = (1n << BigInt(items.length)) - 1n;
  if (maxResults !== Number.POSITIVE_INFINITY && resultCount > BigInt(maxResults)) {
    throw new RangeError(`combinations would produce ${resultCount} results, exceeding the limit of ${maxResults}.`);
  }

  return Array.from(iterateCombinations(items));
}
