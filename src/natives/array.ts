import { isArray, isFunction } from '~/utilities/generic';

/**
 * Returns a new array with unique elements from the input array.
 *
 * @template T - The type of elements in the array.
 * @param array - The input array.
 * @returns A new array with unique elements.
 */
export const unique = <T>(array: readonly T[]): T[] => Array.from(new Set(array));

/**
 * Reverses the elements of an array.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to be reversed.
 * @param inPlace - Specifies whether to reverse the array in place or create a new reversed array.
 * @returns The reversed array.
 */
export const reverse = <T>(array: readonly T[], inPlace = false): T[] => {
  const result: T[] = inPlace ? (array as T[]) : [...array];
  return result.reverse();
};

/**
 * Shuffles the elements of an array using the Fisher-Yates algorithm.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to shuffle.
 * @param inPlace - Specifies whether to shuffle the array in place or create a new shuffled array.
 * @returns The shuffled array.
 */
export const shuffle = <T>(array: readonly T[], inPlace = false): T[] => {
  const result: T[] = inPlace ? (array as T[]) : [...array];

  // Fisher-Yates shuffle algorithm
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
};

/**
 * Flattens a nested array up to the specified depth.
 *
 * @template T - The type of elements in the flattened array.
 * @param array - The array to flatten.
 * @param depth - The maximum depth to flatten. Defaults to Infinity for full flattening.
 * @returns The flattened array.
 */
export const flatten = <T>(array: readonly unknown[], depth = Infinity): T[] => {
  if (depth < 1) {
    return array.slice() as T[];
  }

  return array.reduce((acc: T[], item: unknown) => acc.concat(isArray(item) && depth > 1 ? flatten(item, depth - 1) : (item as T)), [] as T[]);
};

/**
 * Creates a new array of a specified size and fills it with the provided value.
 *
 * @template T - The type of elements in the array.
 * @param size - The size of the array to create.
 * @param value - The value to fill the array with.
 * @returns An array of the specified size filled with the provided value.
 */
export const fill = <T>(size: number, value: T): T[] => Array(size).fill(value);

/**
 * Clusters an array into subarrays of a specified size.
 *
 * @template T - The type of elements in the array.
 * @param array - The array to be clustered.
 * @param size - The size of each subarray. Default is 2.
 * @returns An array of subarrays, each containing elements from the original array.
 */
export const cluster = <T>(array: readonly T[], size = 2): T[][] => {
  const clusters: T[][] = [];
  for (let idx = 0; idx < array.length; idx += size) {
    clusters.push([...array.slice(idx, idx + size)]);
  }

  return clusters;
};

/**
 * Counts the occurrences of each unique key in an array.
 * If a key function is provided, it will be used to extract the key from each element.
 * If a key property is provided, it will be used to extract the key from each element.
 *
 * @template T - The type of elements in the array.
 * @template K - The type of the key used for counting.
 * @param array - The array to count the occurrences in.
 * @param key - The key used for counting. Can be a property name or a function that returns the key.
 * @returns An object that maps each unique key to its count.
 */
export const countBy = <T, K extends PropertyKey>(array: readonly T[], key: K | ((item: T) => K)): Record<K, number> => {
  const keyFn = isFunction(key) ? key : (item: T): K => item[key as keyof T & K] as K;
  return array.reduce(
    (acc, item) => {
      const itemKey = keyFn(item);
      acc[itemKey] = (acc[itemKey] || 0) + 1;
      return acc;
    },
    {} as Record<K, number>,
  );
};

/**
 * Groups the elements of an array by a specified key.
 * If a key function is provided, it will be used to extract the key from each element.
 * If a key property is provided, it will be used to extract the key from each element.
 *
 * @template T - The type of the elements in the array.
 * @template K - The type of the key used for grouping.
 * @param array - The array to group.
 * @param key - The key used for grouping. Can be a property name or a function that returns the key.
 * @returns An object where the keys are the grouped values and the values are arrays of elements that belong to each group.
 */
export const groupBy = <T, K extends PropertyKey>(array: readonly T[], key: K | ((item: T) => K)): Record<K, T[]> => {
  const result = {} as Record<K, T[]>;
  const keyFn = isFunction(key) ? key : (item: T): K => item[key as keyof T & K] as K;

  for (const item of array) {
    const itemKey = keyFn(item);
    if (!isArray(result[itemKey])) {
      result[itemKey] = [];
    }

    result[itemKey].push(item);
  }

  return result;
};

/**
 * Sorts an array of objects based on the specified keys and orders.
 * If a key function is provided, it will be used to extract the key from each element.
 * If a key property is provided, it will be used to extract the key from each element.
 *
 * @template T - The type of the array elements.
 * @template K - The type of the keys used for sorting.
 * @param array - The array to be sorted.
 * @param keys - The keys or functions used for sorting.
 * @param orders - The sort orders for each key.
 * @param inPlace - Indicates whether to sort the array in place or return a new sorted array.
 * @returns The sorted array.
 */
export const orderBy = <T, K extends string | number>(
  array: readonly T[],
  keys: ReadonlyArray<K | ((item: T) => K)>,
  orders: ReadonlyArray<'asc' | 'desc'>,
  inPlace = false,
): T[] => {
  const keyFns = keys.map((key) => (isFunction(key) ? key : (item: T): K => item[key as keyof T & K] as K));
  const result: T[] = inPlace ? (array as T[]) : [...array];
  return result.sort((a, b) => {
    for (let idx = 0; idx < keys.length; idx++) {
      const keyFn = keyFns[idx];
      const order = orders[idx];

      // Determine the value for each item based on the key or function
      const aValue = keyFn(a);
      const bValue = keyFn(b);

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
};

/**
 * Returns a new array containing unique elements from the input array based on the specified key.
 * If a key function is provided, it will be used to extract the key from each element.
 * If a key property is provided, it will be used to extract the key from each element.
 *
 * @template T - The type of elements in the input array.
 * @template K - The type of the key used for uniqueness.
 * @param array - The input array.
 * @param key - The key property or function used to extract the key from each element.
 * @returns A new array containing unique elements based on the specified key.
 */
export const uniqueBy = <T, K extends PropertyKey>(array: readonly T[], key: K | ((item: T) => K)): T[] => {
  const itemMap = new Map<K, T>();
  const keyFn = isFunction(key) ? key : (item: T): K => item[key as keyof T & K] as K;

  for (const item of array) {
    itemMap.set(keyFn(item), item);
  }

  return Array.from(itemMap.values());
};

/**
 * Generates an iterable iterator that produces all possible combinations of elements from the input arrays.
 *
 * @template T - The type of the elements in the input arrays.
 * @param items - An array of arrays containing the elements to combine.
 * @returns An iterable iterator that produces all possible combinations of elements.
 */
function* cartesianIt<T = unknown>(items: readonly T[][]): IterableIterator<T[]> {
  if (items.length === 0) return;

  const [first, ...rest] = items;
  const remainder = rest.length > 0 ? cartesianIt(rest) : [[]];

  for (const rem of remainder) {
    for (const item of first) {
      yield [item].concat(...rem);
    }
  }
}

/**
 * Calculates the cartesian product of the given array of arrays.
 *
 * @param items - The array of arrays to calculate the cartesian product from.
 * @returns The cartesian product as a 2D array.
 */
export const cartesian = <T = unknown>(items: readonly T[][]): T[][] => [...cartesianIt(items)];

/**
 * Generates all possible non-empty combinations of the elements in an array.
 *
 * @template T - The type of the array elements.
 * @param items - The array of elements.
 * @returns An array of arrays representing the combinations.
 */
export const combinations = <T>(items: readonly T[]): T[][] => {
  const result: T[][] = [];

  // Iterate over each number from 1 to (2^length - 1)
  // This will generate all possible non-empty combinations of the array elements.
  for (let subsetMask = 1; subsetMask < 1 << items.length; subsetMask++) {
    const combination: T[] = [];

    // Check each bit in `subsetMask` to see if the corresponding element should be included
    for (let bitPosition = 0; bitPosition < items.length; bitPosition++) {
      if (subsetMask & (1 << bitPosition)) {
        // If the bitPosition-th bit is set in `subsetMask`, include array[bitPosition] in the current combination
        combination.push(items[bitPosition]);
      }
    }

    // Add the generated combination to the result array
    result.push(combination);
  }

  return result;
};
