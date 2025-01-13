/**
 * Checks if the given item is an array.
 *
 * @param item - The item to check.
 * @returns `true` if the item is an array, `false` otherwise.
 */
export const isArray = <T = unknown>(item: unknown): item is T[] | readonly T[] => typeof item === 'object' && Array.isArray(item);

/**
 * Checks if the given item is a boolean.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a boolean, `false` otherwise.
 */
export const isBoolean = (item: unknown): item is boolean => typeof item === 'boolean';

/**
 * Checks if the given item is a Date object.
 *
 * @param item The item to check.
 * @returns `true` if the item is a Date object, `false` otherwise.
 */
export const isDate = (item: unknown): item is Date => item instanceof Date;

/**
 * Checks if the given item is defined.
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is defined or not.
 */
export const isDefined = (item: unknown): boolean => item !== undefined;

/**
 * Checks if the given item is an instance of the Error class.
 *
 * @param item - The item to check.
 * @returns `true` if the item is an instance of Error, `false` otherwise.
 */
export const isError = (item: unknown): item is Error => item instanceof Error;

/**
 * Checks if the given item is a function.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a function, `false` otherwise.
 */
// biome-ignore lint/complexity/noBannedTypes: Allow Function for Type
export const isFunction = (item: unknown): item is Function => typeof item === 'function';

/**
 * Checks if the given item is an infinity number.
 * @param item - The item to be checked.
 * @returns A boolean indicating whether the item is an infinity number.
 */
export const isInfinity = (item: unknown): item is number => item === Number.POSITIVE_INFINITY || item === Number.NEGATIVE_INFINITY;

/**
 * Checks if the given item is an instance of Map.
 *
 * @template K - The type of keys in the Map.
 * @template V - The type of values in the Map.
 * @param item - The item to check.
 * @returns `true` if the item is a Map, `false` otherwise.
 */
export const isMap = <K = unknown, V = unknown>(item: unknown): item is Map<K, V> => item instanceof Map;

/**
 * Checks if the given item is null.
 *
 * @param item The item to check.
 * @returns `true` if the item is null, `false` otherwise.
 */
export const isNull = (item: unknown): item is null => item === null;

/**
 * Checks if the given item is a number.
 *
 * @param item - The item to be checked.
 * @returns `true` if the item is a number, `false` otherwise.
 */
export const isNumber = (item: unknown): item is number => typeof item === 'number' && Number.isFinite(item);

/**
 * Checks if the given item is an object.
 *
 * @param item - The item to check.
 * @returns `true` if the item is an object, `false` otherwise.
 */
export const isObject = (item: unknown): item is object => typeof item === 'object' && !Array.isArray(item) && item !== null;

/**
 * Checks if the given item is a plain object.
 *
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is a plain object.
 */
export const isPlainObject = (item: unknown): item is Record<PropertyKey, unknown> => isObject(item) && item.constructor === Object;

/**
 * Checks if the given item is a Promise.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a Promise, `false` otherwise.
 */
export const isPromise = <T = unknown>(item: unknown): item is Promise<T> => item instanceof Promise;

/**
 * Checks if the given item is a regular expression.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a regular expression, `false` otherwise.
 */
export const isRegExp = (item: unknown): item is RegExp => item instanceof RegExp;

/**
 * Checks if the given item is a Set.
 *
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is a Set.
 */
export const isSet = <T = unknown>(item: unknown): item is Set<T> => item instanceof Set;

/**
 * Checks if the given item is a string.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a string, `false` otherwise.
 */
export const isString = (item: unknown): item is string => typeof item === 'string';

/**
 * Checks if the given item is a symbol.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a symbol, `false` otherwise.
 */
export const isSymbol = (item: unknown): item is symbol => typeof item === 'symbol';

/**
 * Checks if the given item is undefined.
 *
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is undefined or not.
 */
export const isUndefined = (item: unknown): item is undefined => item === undefined;

/**
 * Checks if the given item is an instance of WeakMap.
 *
 * @template K - The type of the keys in the WeakMap.
 * @template V - The type of the values in the WeakMap.
 * @param item - The item to be checked.
 * @returns A boolean indicating whether the item is an instance of WeakMap.
 */
export const isWeakMap = <K extends WeakKey, V = unknown>(item: unknown): item is WeakMap<K, V> => item instanceof WeakMap;

/**
 * Checks if the given item is a WeakSet.
 *
 * @template T - The type of the WeakSet keys.
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is a WeakSet.
 */
export const isWeakSet = <T extends WeakKey>(item: unknown): item is WeakSet<T> => item instanceof WeakSet;

/**
 * Creates a deep clone of an item.
 *
 * @param item - The item to clone.
 * @returns The cloned item.
 */
export const cloneObject = <T>(item: T): T => (item !== undefined ? JSON.parse(JSON.stringify(item)) : undefined);

/**
 * Represents a type that prettifies another type by preserving its properties.
 * @template T - The type to be prettified.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Represents a type that can be either a value of type T, null, or undefined.
 *
 * @template T - The type of the value.
 */
export type Maybe<T> = T | null | undefined;

/**
 * Represents a function that extracts a key from a value.
 * @template T The type of the value.
 * @param arg The value from which to extract the key.
 * @returns The key extracted from the value.
 */
export type KeyFn<T> = (arg: T) => keyof T; // PropertyKey

/**
 * Represents a generic function type.
 * @template T - The type of arguments accepted by the function.
 */
export type GenericFn<T> = (...args: T[]) => unknown;

/**
 * Represents a generic object with dynamic keys and unknown values.
 */
export type GenericObject = Record<PropertyKey, unknown>;

/**
 * Represents a plain object with string keys and unknown values.
 */
export type PlainObject = Record<string, unknown>;

/**
 * Represents a generic function type.
 * @template TFunc - The type of the function.
 */
export type GenericFunction<TFunc extends (...args: unknown[]) => unknown> = (...args: Parameters<TFunc>) => ReturnType<TFunc>;

// Utility to handle array/tuple indexing
type GetIndexedField<T, Idx> = T extends readonly unknown[] | unknown[]
  ? T[number] // Safely access array or tuple element by number
  : undefined;

// Utility to handle direct object field access
type GetDirectField<T, Path extends keyof T> = T[Path];

// Utility to handle undefined or potentially missing properties
type FieldOrUndefined<T, Key> = Key extends keyof T
  ? T[Key] | Extract<T, undefined> // Handle field or undefined
  : undefined;

// Main recursive type to infer the type from a dot notation or array path
export type GetFieldType<T, Path> = Path extends `${infer Left}.${infer Right}` ? GetNestedField<T, Left, Right> : GetDirectOrIndexedField<T, Path>;

// Handle direct field access or array indexing (e.g., 'user.name' or 'user.posts[0]')
type GetDirectOrIndexedField<T, Path> = Path extends `${infer FieldKey}[${infer IdxKey}]`
  ? FieldKey extends keyof T
    ? GetIndexedField<T[FieldKey], IdxKey>
    : undefined
  : Path extends keyof T
  ? GetDirectField<T, Path> // Direct object field access
  : undefined;

// Handle nested fields, i.e., recursively process the path (e.g., 'user.posts[0].title')
type GetNestedField<T, Left extends string, Right extends string> = Left extends `${infer FieldKey}[${infer IdxKey}]`
  ? FieldKey extends keyof T
    ? GetFieldType<GetIndexedField<T[FieldKey], IdxKey>, Right>
    : undefined
  : GetFieldType<FieldOrUndefined<T, Left>, Right>;

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
 * Clusters an array into subarrays of a specified size.
 *
 * @param array - The array to be clustered.
 * @param size - The size of each subarray. Default is 2.
 * @returns An array of subarrays, each containing elements from the original array.
 */
export const cluster = <T>(array: T[], size = 2): T[][] => {
  const clusters: T[][] = [];
  for (let idx = 0; idx < array.length; idx += size) {
    clusters.push(array.slice(idx, idx + size));
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
 * Calculates the cartesian product of the given array of arrays.
 *
 * @param items - The array of arrays to calculate the cartesian product from.
 * @returns The cartesian product as a 2D array.
 */
export const cartesian = <T>(items: T[][]): T[][] => [...cartesianIt(items)];

/**
 * Generates all possible non-empty combinations of the elements in an array.
 *
 * @template T - The type of the array elements.
 * @param {T[]} items - The array of elements.
 * @returns {T[][]} - An array of arrays representing the combinations.
 */
export const combinations = <T>(items: T[]): T[][] => {
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

/**
 * Clamps a value between a specified range.
 *
 * @param value - The value to be clamped.
 * @param rangeA - The first value of the range.
 * @param rangeB - The second value of the range.
 * @returns The clamped value.
 */
export const clamp = (value: number, rangeA: number, rangeB: number): number => Math.max(Math.min(value, Math.max(rangeA, rangeB)), Math.min(rangeA, rangeB));

/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param value - The number to round.
 * @param decimals - The number of decimal places to round to. Default is 2.
 * @returns The rounded number.
 */
export const roundTo = (value: number, decimals = 2): number => Math.round(value * 10 ** decimals) / 10 ** decimals;

/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 *
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns A random integer between the minimum and maximum values.
 */
export const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generates a random number between the specified minimum and maximum values.
 *
 * @param min - The minimum value of the range (inclusive).
 * @param max - The maximum value of the range (exclusive).
 * @returns A random number between the minimum and maximum values.
 */
export const randomNum = (min: number, max: number): number => Math.random() * (max - min) + min;

/**
 * Converts degrees to radians.
 * @param degrees The number of degrees to convert.
 * @returns The equivalent value in radians.
 */
export const deg2rad = (degrees: number): number => degrees * (Math.PI / 180);

/**
 * Converts radians to degrees.
 * @param radians The value in radians to be converted.
 * @returns The value in degrees.
 */
export const rad2deg = (radians: number): number => radians * (180 / Math.PI);

/**
 * Generates an array of numbers within a specified range.
 *
 * @param start - The starting number of the range.
 * @param end - The ending number of the range.
 * @param step - The increment value between numbers in the range. Default is 1.
 * @returns An array of numbers within the specified range.
 */
export const range = (start: number, end: number, step = 1): number[] =>
  Array.from(Array(Math.floor((end - start + 1) / step)).keys()).map((num) => start + num * step);

/**
 * Calculates the sum of an array of numbers.
 *
 * @param values - An array of numbers.
 * @returns The sum of the numbers in the array.
 */
export const sum = (values: number[]): number => values.reduce((acc, cur) => acc + cur, 0);

/**
 * Calculates the mean of an array of numbers.
 *
 * @param values - The array of numbers.
 * @returns The mean value of the numbers.
 */
export const mean = (values: number[]): number => (values.length === 0 ? 0 : sum(values) / values.length);

/**
 * Linearly interpolates between two numbers.
 *
 * @param from - The starting value.
 * @param to - The ending value.
 * @param t - The interpolation factor.
 * @returns The interpolated value.
 */
export const lerp = (from: number, to: number, t: number): number => from + t * (to - from);

/**
 * Retrieves a value from a nested object or array using a dot/bracket notation path.
 * If the value at the specified path doesn't exist, returns a default value.
 *
 * Supports accessing both object properties and array indices using a path such as 'user.posts[0].title'.
 *
 * @template TData - The type of the data object.
 * @template TPath - The dot/bracket notation path to the property in the object.
 * @template TDefault - The type of the default value to be returned if the path does not exist.
 *
 * @param {TData} data - The object or array from which to retrieve the value.
 * @param {TPath} path - The string path specifying the property to retrieve.
 * Supports dot notation (e.g., 'user.name') and bracket notation (e.g., 'user.posts[0]').
 * @param {TDefault} defaultValue - The value to return if the specified path does not exist or is undefined.
 *
 * @returns {GetFieldType<TData, TPath> | TDefault} - The value at the specified path, or the default value if the path does not exist.
 */
export const getValue = <TData, TPath extends string, TDefault = GetFieldType<TData, TPath>>(
  data: TData,
  path: TPath,
  defaultValue: TDefault,
): GetFieldType<TData, TPath> | TDefault => {
  const keys = path.split(/[\.\[\]]/).filter(Boolean) as Array<string | number>; // Split by dot or brackets, remove empty parts

  let result: unknown = data; // Use `unknown` to ensure strict type checking
  for (const key of keys) {
    if (result && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]; // Use indexed access for objects/arrays
    } else {
      return defaultValue;
    }
  }

  return result !== undefined ? (result as GetFieldType<TData, TPath>) : defaultValue;
};

/**
 * Sets a value in a nested object or array using a dot/bracket notation path.
 * If the path does not exist, it will create intermediate objects or arrays as needed.
 *
 * Supports both object properties and array indices in the path, such as 'user.posts[0].title'.
 *
 * @template TData - The type of the data object being modified.
 * @template TPath - The dot/bracket notation path to the property where the value will be set.
 * @template TValue - The type of the value to set at the specified path.
 *
 * @param {TData} data - The object or array in which the value will be set.
 * @param {TPath} path - The string path specifying the property to set.
 * Supports dot notation (e.g., 'user.name') and bracket notation (e.g., 'user.posts[0]').
 * @param {TValue} value - The value to set at the specified path.
 *
 * @returns {void}
 */
export const setValue = <TData, TPath extends string, TValue>(data: TData, path: TPath, value: TValue): void => {
  const keys = path.split(/[\.\[\]]/).filter(Boolean) as Array<string | number>; // Split by dot or brackets, remove empty parts

  // biome-ignore lint/suspicious/noExplicitAny: current is unknown territory, this is fine
  let current: any = data; // Start at the root object
  for (let idx = 0; idx < keys.length; idx++) {
    const key = keys[idx];

    // If we are at the last key, assign the value
    if (idx === keys.length - 1) {
      current[key] = value;
    } else {
      // Check if the current key exists and is an object or array
      if (typeof current[key] !== 'object' || current[key] === null) {
        // Create an empty object or array if the next key is a number (array-like access)
        current[key] = Number.isNaN(Number(keys[idx + 1])) ? {} : [];
      }

      current = current[key]; // Move to the next level
    }
  }
};

type FilterFunction<T> = (obj: T) => boolean;

type FilterResult<T, P extends boolean> = P extends true ? { path: string; value: T } : T;

/**
 * Recursively filters a JSON-like object or array, applying the filter function to each sub-object or sub-array.
 * Returns matching objects, and optionally, the paths where the matches were found.
 *
 * The return type is inferred dynamically based on the `path` argument. If `path: true`, the return type includes
 * both the path and the value. Otherwise, it returns just the values.
 *
 * @template R - The expected return type of the object.
 * @template T - The type of the object or array to filter.
 * @template P - A boolean, controlling whether the path should be included in the return type.
 *
 * @param {T} obj - The JSON-like object or array to filter.
 * @param {FilterFunction<any>} filter - The filter function that returns true for a matching sub-object.
 * @param {P} [path=false] - Whether to include the path in the result.
 * If `true`, the path to the matching sub-object is returned alongside the result.
 *
 * @returns {Array<FilterResult<T, P>>} - An array of matching sub-objects or matching objects with paths (if `path` is true).
 */
export const filterObject = <R = unknown, T = unknown, P extends boolean = false>(
  obj: T,
  filter: FilterFunction<unknown>,
  path: P = false as P,
): Array<FilterResult<R, P>> => {
  const results: Array<FilterResult<R, P>> = [];

  /**
   * Helper function to build the new path based on the current path and key.
   */
  const buildPath = (currentPath: string, key: string): string => {
    return currentPath ? (Array.isArray(obj) ? `${currentPath}[${key}]` : `${currentPath}.${key}`) : key;
  };

  /**
   * Recursive traversal function to iterate over the object or array.
   */
  const traverse = (o: unknown, currentPath = ''): void => {
    // Ensure `o` is an object or array
    if (filter(o as T)) {
      if (path) {
        results.push({ path: currentPath, value: o as T } as FilterResult<R, P>);
      } else {
        results.push(o as FilterResult<R, P>);
      }
    }

    if (typeof o === 'object' && o !== null) {
      for (const key in o as Record<string, unknown>) {
        if (Object.hasOwn(o, key)) {
          const newPath = buildPath(currentPath, key);
          traverse((o as Record<string, unknown>)[key], newPath); // Ensure proper indexing
        }
      }
    }
  };

  // Early return for non-object values
  if (isArray(obj) || isObject(obj)) {
    traverse(obj);
  }

  return results;
};

/**
 * Deeply merges a patch object into a source object.
 *
 * - New keys in the patch object will be added to the source.
 * - Nested objects are recursively merged.
 * - Arrays are replaced entirely rather than merged.
 *
 * @template TSource - Type of the source object.
 * @template TPatch - Type of the patch object.
 * @param source - The original object to be merged into.
 * @param patch - The object containing updates or new keys to be merged.
 *
 * @returns A new object that is the result of deeply merging the patch into the source.
 */
export const deepMerge = <TSource extends PlainObject, TPatch extends PlainObject>(source: TSource, patch: TPatch): TSource & TPatch => {
  /**
   * Recursively merges two objects.
   *
   * @param src - The source object being updated.
   * @param patchObj - The patch object providing updates.
   * @returns The merged object.
   */
  const merge = (src: PlainObject, patchObj: PlainObject): PlainObject => {
    for (const key in patchObj) {
      // Ensure the key exists on the patch object itself (not inherited)
      if (Object.hasOwn(patchObj, key)) {
        const srcValue = src[key];
        const patchValue = patchObj[key];

        // If the patch value is an object, recursively merge
        if (isPlainObject(patchValue)) {
          if (!isPlainObject(srcValue)) {
            src[key] = {};
          }

          src[key] = merge(srcValue as PlainObject, patchValue);
        } else if (isArray(patchValue)) {
          // Replace arrays entirely
          src[key] = [...patchValue];
        } else {
          // Directly assign primitive values or other types
          src[key] = patchValue;
        }
      }
    }

    return src;
  };

  // Start the merge process with a shallow copy of the source object
  return merge({ ...source }, patch) as TSource & TPatch;
};

/**
 * Pauses the execution for the specified number of milliseconds.
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified number of milliseconds.
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a debounced version of the provided callback function.
 * The debounced function will delay invoking the callback until after a specified amount of time has passed since the last time it was invoked.
 *
 * @template F - The type of the original callback function.
 * @param {F} callback - The original callback function to debounce.
 * @param {number} waitFor - The amount of time (in milliseconds) to wait before invoking the debounced callback.
 * @returns {(...args: Parameters<F>) => void} - The debounced callback function.
 */
export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(callback: F, waitFor: number): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), waitFor);
  };
};

/**
 * Throttles a function and returns a promise that resolves with the result of the function.
 * The function will be called at most once within the specified time interval.
 *
 * @template F - The type of the function to throttle.
 * @param {F} callback - The function to throttle.
 * @param {number} waitFor - The time interval in milliseconds.
 * @returns {(...args: Parameters<F>) => Promise<ReturnType<F>>} - A throttled function that returns a promise.
 */
export const throttle = <F extends (...args: Parameters<F>) => ReturnType<F>>(callback: F, waitFor: number) => {
  const now = () => Date.now();
  const resetStartTime = () => {
    startTime = now();
  };

  let timeout: number | NodeJS.Timeout;
  let startTime: number = now() - waitFor;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      const timeLeft = startTime + waitFor - now();
      if (timeout) {
        clearTimeout(timeout);
      }

      if (startTime + waitFor <= now()) {
        resetStartTime();
        resolve(callback(...args));
      } else {
        timeout = setTimeout(() => {
          resetStartTime();
          resolve(callback(...args));
        }, timeLeft);
      }
    });
};

