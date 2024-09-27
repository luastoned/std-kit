import { isArray, isFunction } from '~/utilities/generic';

/**
 * Returns a new array with unique elements from the input array.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The input array.
 * @returns {T[]} - A new array with unique elements.
 */
export const unique = <T>(array: T[]): T[] => Array.from(new Set(array));

/**
 * Reverses the elements of an array.
 *
 * @template T - The type of elements in the array.
 * @param {T[]} array - The array to be reversed.
 * @param {boolean} [inPlace=false] - Specifies whether to reverse the array in place or create a new reversed array.
 * @returns {T[]} - The reversed array.
 */
export const reverse = <T>(array: T[], inPlace = false): T[] => (inPlace ? array : [...array]).reverse();

/**
 * Shuffles the elements of an array.
 *
 * @template T The type of elements in the array.
 * @param {T[]} array The array to shuffle.
 * @param {boolean} [inPlace=false] Specifies whether to shuffle the array in place or create a new shuffled array.
 * @returns {T[]} The shuffled array.
 */
export const shuffle = <T>(array: T[], inPlace = false): T[] => (inPlace ? array : [...array]).sort(() => Math.random() - 0.5);

/**
 * Flattens a nested array of type T.
 *
 * @param array - The array to flatten.
 * @returns {T[]} The flattened array.
 */
export const flatten = <T extends T[]>(array: T[]): T[] => array.reduce((acc, item) => acc.concat(isArray(item) ? flatten(item) : item), [] as T[]);

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
 * Counts the occurrences of each unique key in an array.
 * If a key function is provided, it will be used to extract the key from each element.
 * If a key property is provided, it will be used to extract the key from each element.
 *
 * @template T - The type of elements in the array.
 * @template K - The type of the key used for counting.
 * @param {T[]} array - The array to count the occurrences in.
 * @param {K | ((item: T) => K)} key - The key used for counting. Can be a property name or a function that returns the key.
 * @returns {Record<K, number>} - An object that maps each unique key to its count.
 */
export const countBy = <T, K extends PropertyKey>(array: T[], key: K | ((item: T) => K)): Record<K, number> => {
  const keyFn = isFunction(key) ? key : (item: T): K => item[key as unknown as keyof T] as K;
  return array.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<K, number>);
};

/**
 * Groups the elements of an array by a specified key.
 * If a key function is provided, it will be used to extract the key from each element.
 * If a key property is provided, it will be used to extract the key from each element.
 *
 * @template T - The type of the elements in the array.
 * @template K - The type of the key used for grouping.
 * @param {T[]} array - The array to group.
 * @param {K | ((item: T) => K)} key - The key used for grouping. Can be a property name or a function that returns the key.
 * @returns {Record<K, T[]>} - An object where the keys are the grouped values and the values are arrays of elements that belong to each group.
 */
export const groupBy = <T, K extends PropertyKey>(array: T[], key: K | ((item: T) => K)): Record<K, T[]> => {
  const result = {} as Record<K, T[]>;
  const keyFn = isFunction(key) ? key : (item: T): K => item[key as unknown as keyof T] as K;

  for (const item of array) {
    const key = keyFn(item);
    if (!isArray(result[key])) {
      result[key] = [];
    }

    result[key].push(item);
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
 * @param {T[]} array - The array to be sorted.
 * @param {Array<K | ((item: T) => K)>} keys - The keys or functions used for sorting.
 * @param {Array<'asc' | 'desc'>} orders - The sort orders for each key.
 * @param {boolean} [inPlace=false] - Indicates whether to sort the array in place or return a new sorted array.
 * @returns {T[]} - The sorted array.
 */
export const orderBy = <T, K extends string | number>(array: T[], keys: Array<K | ((item: T) => K)>, orders: Array<'asc' | 'desc'>, inPlace = false): T[] => {
  const keyFns = keys.map((key) => (isFunction(key) ? key : (item: T): K => item[key as unknown as keyof T] as K));
  return (inPlace ? array : [...array]).slice().sort((a, b) => {
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
 * @param {T[]} array - The input array.
 * @param {K | ((item: T) => K)} key - The key property or function used to extract the key from each element.
 * @returns {T[]} - A new array containing unique elements based on the specified key.
 */
export const uniqueBy = <T, K extends PropertyKey>(array: T[], key: K | ((item: T) => K)): T[] => {
  const itemMap = new Map<K, T>();
  const keyFn = isFunction(key) ? key : (item: T): K => item[key as unknown as keyof T] as K;

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
function* cartesianIt<T>(items: T[][]): IterableIterator<T[]> {
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
 * Generates the cartesian product of the given arrays.
 *
 * @param items - An array of arrays containing the items.
 * @returns The cartesian product of the given arrays.
 */
export const cartesian = <T>(items: T[][]): T[][] => [...cartesianIt(items)];
