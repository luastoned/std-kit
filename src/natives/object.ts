import type { Container, DeepPartial, GetFieldType, MutableContainer, PlainObject } from '~/utilities/types';
import { isArray, isContainer, isMutableContainer, isObject } from '~/utilities/generic';
import { mergePlainObjects, normalizeMergeOptions } from '~/natives/object/merge.internal';
import {
  buildChildPath,
  forEachContainerEntry,
  hasForbiddenPathKeys,
  isArrayIndexSegment,
  normalizeFilterPredicates,
  tokenizePath,
} from '~/natives/object/shared.internal';

/**
 * Creates a new object with only the specified keys from the source object.
 *
 * @template T - The type of the source object.
 * @template K - The keys to pick from the source object.
 * @param obj - The source object.
 * @param keys - The keys to include in the result.
 * @returns A new object containing only the specified keys.
 */
export const pick = <T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }

  return result;
};

/**
 * Creates a new object with all keys from the source object except the specified ones.
 *
 * @template T - The type of the source object.
 * @template K - The keys to omit from the source object.
 * @param obj - The source object.
 * @param keys - The keys to exclude from the result.
 * @returns A new object without the specified keys.
 */
export const omit = <T extends object, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> => {
  const result = { ...obj } as Omit<T, K>;
  for (const key of keys) {
    delete (result as T)[key];
  }

  return result;
};

/**
 * Retrieves a value from a nested object or array using a dot/bracket notation path.
 * If the value at the specified path doesn't exist, returns a default value.
 *
 * Supports accessing both object properties and array indices using a path such as 'user.posts[0].title'.
 *
 * @template TData - The type of the data object.
 * @template TPath - The dot/bracket notation path to the property in the object.
 * @template TDefault - The type of the default value to be returned if the path does not exist.
 * @param data - The object or array from which to retrieve the value.
 * @param path - The string path specifying the property to retrieve.
 * Supports dot notation (e.g., 'user.name') and bracket notation (e.g., 'user.posts[0]').
 * @param defaultValue - The value to return if the specified path does not exist or is undefined.
 * @returns The value at the specified path, or the default value if the path does not exist.
 *
 * @example
 * ```ts
 * import { getValue } from 'std-kit';
 *
 * const settings = { ui: { theme: 'dark' } };
 *
 * getValue(settings, 'ui.theme', 'light');
 * // 'dark'
 *
 * getValue(settings, 'ui.locale', 'en');
 * // 'en'
 * ```
 */
export const getValue = <TData, TPath extends string, TDefault = GetFieldType<TData, TPath>>(
  data: Readonly<TData>,
  path: TPath,
  defaultValue?: TDefault,
): GetFieldType<TData, TPath> | TDefault => {
  const keys = tokenizePath(path);

  let result: unknown = data; // Use `unknown` to ensure strict type checking
  for (const key of keys) {
    if (result !== null && result !== undefined && typeof result === 'object' && key in result) {
      result = (result as Record<string, unknown>)[key]; // Use indexed access for objects/arrays
    } else {
      return defaultValue as TDefault;
    }
  }

  return result !== undefined ? (result as GetFieldType<TData, TPath>) : (defaultValue as TDefault);
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
 * @param data - The object or array in which the value will be set.
 * @param path - The string path specifying the property to set.
 * Supports dot notation (e.g., 'user.name') and bracket notation (e.g., 'user.posts[0]').
 * @param value - The value to set at the specified path.
 * @returns Nothing.
 *
 * @example
 * ```ts
 * import { setValue } from 'std-kit';
 *
 * const data = { user: { profile: { name: 'Ada' } } };
 * setValue(data, 'user.profile.name', 'Grace');
 * setValue(data, 'user.settings.theme', 'dark');
 *
 * data;
 * // { user: { profile: { name: 'Grace' }, settings: { theme: 'dark' } } }
 * ```
 */
export const setValue = <TData, TPath extends string, TValue>(data: TData, path: TPath, value: TValue): void => {
  const keys = tokenizePath(path);
  if (hasForbiddenPathKeys(keys)) {
    return;
  }

  if (!isMutableContainer(data)) {
    return;
  }

  let current: MutableContainer = data;
  for (let idx = 0; idx < keys.length; idx++) {
    const key = keys[idx];
    if (key === undefined) {
      return;
    }

    const currentRecord = current as Record<string, unknown>;

    // If we are at the last key, assign the value
    if (idx === keys.length - 1) {
      currentRecord[key] = value;
    } else {
      let nextValue = currentRecord[key];

      // Check if the current key exists and is an object or array
      if (!isMutableContainer(nextValue)) {
        // Create an empty object or array if the next key is a number (array-like access)
        const nextKey = keys[idx + 1];
        if (nextKey === undefined) {
          return;
        }

        nextValue = isArrayIndexSegment(nextKey) ? [] : {};
        currentRecord[key] = nextValue;
      }

      if (!isMutableContainer(nextValue)) {
        return;
      }

      current = nextValue; // Move to the next level
    }
  }
};

/**
 * Recursively searches through an object or array tree, finding all values that match the filter function.
 * Returns a flat array of matching values, optionally with their paths.
 *
 * The return type is inferred dynamically based on the `path` argument. If `path: true`, the return type includes
 * both the path and the value. Otherwise, it returns just the values.
 *
 * @template Ret - The expected return type of matching values.
 * @template T - The type of values being filtered in the tree.
 * @template P - A boolean, controlling whether the path should be included in the return type.
 * @param obj - The object or array to search through.
 * @param filter - The filter function that returns true for matching values. Receives (key, value, path, parent).
 * @param path - Whether to include the path in the result.
 * If `true`, the path to the matching value is returned alongside the result.
 * @returns A flat array of matching values or matching values with paths (if `path` is true).
 *
 * @example
 * ```ts
 * import { queryObject } from 'std-kit';
 *
 * queryObject(
 *   { users: [{ id: 1, active: true }, { id: 2, active: false }] },
 *   (_key, value) => typeof value === 'object' && value !== null && 'active' in value && value.active === true,
 *   true,
 * );
 * // [{ path: 'users[0]', value: { id: 1, active: true } }]
 * ```
 */
export const queryObject = <Ret = unknown, T = unknown, P extends boolean = false>(
  obj: unknown,
  filter: (key: string, value: T, path: string, parent: unknown) => boolean,
  path: P = false as P,
): Array<P extends true ? { path: string; value: Ret } : Ret> => {
  const results: Array<P extends true ? { path: string; value: Ret } : Ret> = [];
  const visiting = new WeakSet<object>();

  /**
   * Recursive traversal function to iterate over the object or array.
   *
   * @param value - The current value being visited.
   * @param currentPath - The current traversal path.
   * @param currentKey - The key for the current value.
   * @param parent - The parent container.
   * @returns Nothing.
   */
  const traverse = (value: unknown, currentPath = '', currentKey = '', parent: unknown = null): void => {
    const container = isContainer(value);
    if (container) {
      const containerRef = value as object;
      if (visiting.has(containerRef)) {
        return;
      }
      visiting.add(containerRef);
    }

    // Check if the current node matches criteria
    try {
      if (filter(currentKey, value as T, currentPath, parent)) {
        if (path) {
          results.push({ path: currentPath, value: value as Ret } as P extends true ? { path: string; value: Ret } : Ret);
        } else {
          results.push(value as P extends true ? { path: string; value: Ret } : Ret);
        }
      }

      if (container) {
        forEachContainerEntry(value as Container, currentPath, (key, childValue, childPath) => {
          traverse(childValue, childPath, key, value);
        });
      }
    } finally {
      if (container) {
        visiting.delete(value as object);
      }
    }
  };

  // Early return for non-object values
  if (isContainer(obj)) {
    traverse(obj);
  }

  return results;
};

/**
 * Recursively filters an object or array tree, preserving the original structure but only keeping
 * items that match the provided predicate.
 *
 * @template T - The type of the object or array to filter.
 * @param obj - The object or array to filter.
 * @param filter - Predicate called with `(key, value, path, parent)`.
 * @returns A new object/array with the same structure, containing only matching items.
 *
 * @example
 * ```ts
 * import { filterObject } from 'std-kit';
 *
 * filterObject(
 *   { user: { id: 1, profile: { name: 'Ada', age: 36 } } },
 *   (key) => key === 'name' || key === 'profile',
 * );
 * // { user: { profile: { name: 'Ada' } } }
 * ```
 */
export function filterObject<T>(obj: Readonly<T>, filter: (key: string, value: unknown, path: string, parent: unknown) => boolean): DeepPartial<T> | undefined;

/**
 * Recursively filters an object or array tree, preserving the original structure but only keeping
 * items that match the specified key and/or value filters.
 *
 * @template T - The type of the object or array to filter.
 * @param obj - The object or array to filter.
 * @param options - Filter options:
 *   - `keys`: Array of key names to keep, or a predicate to test keys.
 *   - `values`: Predicate to test values.
 *   If both are provided, both conditions must be satisfied.
 * @returns A new object/array with the same structure, containing only matching items.
 */
export function filterObject<T>(
  obj: Readonly<T>,
  options: Readonly<{
    keys?: readonly string[] | ((key: string, value: unknown, path: string, parent: unknown) => boolean);
    values?: (key: string, value: unknown, path: string, parent: unknown) => boolean;
  }>,
): DeepPartial<T> | undefined;

export function filterObject<T>(
  obj: Readonly<T>,
  filterOrOptions:
    | ((key: string, value: unknown, path: string, parent: unknown) => boolean)
    | Readonly<{
        keys?: readonly string[] | ((key: string, value: unknown, path: string, parent: unknown) => boolean);
        values?: (key: string, value: unknown, path: string, parent: unknown) => boolean;
      }>,
): DeepPartial<T> | undefined {
  const { keyFilter, valueFilter } = normalizeFilterPredicates(filterOrOptions);
  const visiting = new WeakSet<object>();

  /**
   * Checks if a value should be kept based on the value filter.
   *
   * @param key - The property key.
   * @param value - The value to check.
   * @param path - The current path.
   * @param parent - The parent container.
   * @returns Whether the value should be kept.
   */
  const shouldKeepValue = (key: string, value: unknown, path: string, parent: unknown): boolean => {
    return !valueFilter || valueFilter(key, value, path, parent);
  };

  /**
   * Checks if a key should be kept based on the key filter.
   *
   * @param key - The property key.
   * @param propValue - The property value.
   * @param path - The current path.
   * @param parent - The parent container.
   * @returns Whether the key should be kept.
   */
  const shouldKeepKey = (key: string, propValue: unknown, path: string, parent: unknown): boolean => {
    return !keyFilter || keyFilter(key, propValue, path, parent);
  };

  /**
   * Filters an array, recursing into nested structures.
   *
   * @param arr - The array to filter.
   * @param currentPath - The current path.
   * @returns The filtered array or undefined.
   */
  const filterArray = (arr: readonly unknown[], currentPath: string): unknown[] | undefined => {
    const filtered = arr.map((item, index) => recurse(item, buildChildPath(currentPath, String(index), true), arr)).filter((item) => item !== undefined);

    return filtered.length > 0 ? filtered : undefined;
  };

  /**
   * Filters an object, recursing into nested structures.
   *
   * @param obj - The object to filter.
   * @param currentPath - The current path.
   * @param parent - The parent container.
   * @returns The filtered object or undefined.
   */
  const filterObjectProps = (obj: Record<string, unknown>, currentPath: string, parent: unknown): Record<string, unknown> | undefined => {
    const result: Record<string, unknown> = {};
    let hasMatchingItems = false;

    for (const [key, propValue] of Object.entries(obj)) {
      const keyPath = buildChildPath(currentPath, key, false);
      const keyMatches = shouldKeepKey(key, propValue, keyPath, parent);
      const valueMatches = shouldKeepValue(key, propValue, keyPath, parent);

      // Both key and value match - keep as-is
      if (keyMatches && valueMatches) {
        result[key] = propValue;
        hasMatchingItems = true;
        continue;
      }

      // Key matches but value doesn't, or key doesn't match - check if it's a container
      if (isContainer(propValue)) {
        const filteredValue = recurse(propValue, keyPath, parent);
        if (filteredValue !== undefined) {
          result[key] = filteredValue;
          hasMatchingItems = true;
        }
      }
    }

    return hasMatchingItems ? result : undefined;
  };

  /**
   * Recursively filters values based on key and value criteria.
   *
   * @param value - The current value.
   * @param currentPath - The current path.
   * @param parent - The parent container.
   * @returns The filtered subtree or undefined.
   */
  const recurse = (value: unknown, currentPath: string, parent: unknown): unknown => {
    // If the current value matches the value filter, return it as-is (keep entire subtree)
    if (valueFilter && valueFilter('', value, currentPath, parent)) {
      return value;
    }

    // If not a container and doesn't match value filter, exclude it
    const container = isContainer(value);
    if (!container) {
      return undefined;
    }

    if (visiting.has(value as object)) {
      return undefined;
    }
    visiting.add(value as object);

    try {
      // Handle arrays
      if (isArray(value)) {
        return filterArray(value, currentPath);
      }

      // Handle objects
      if (isObject(value)) {
        return filterObjectProps(value as Record<string, unknown>, currentPath, parent);
      }

      return undefined;
    } finally {
      visiting.delete(value as object);
    }
  };

  return recurse(obj, '', null) as DeepPartial<T> | undefined;
}

/**
 * Recursively maps over all values in an object or array tree, allowing transformation
 * of each value while preserving the structure.
 *
 * @template T - The type of the object or array to map.
 * @param obj - The object or array to map over.
 * @param mapper - Function called for each value with (key, value, path).
 *   - key: The property name or array index (as string)
 *   - value: The current value
 *   - path: The full path to this value (e.g., 'user.settings.theme' or 'users[0].name')
 * @returns A new object/array with the same structure but transformed values.
 *
 * @example
 * ```ts
 * import { mapObject } from 'std-kit';
 *
 * mapObject(
 *   { prices: [{ amount: 10 }, { amount: 15 }] },
 *   (key, value) => (key === 'amount' && typeof value === 'number' ? value * 100 : value),
 * );
 * // { prices: [{ amount: 1000 }, { amount: 1500 }] }
 * ```
 */
export const mapObject = <T>(obj: T, mapper: (key: string, value: unknown, path: string, parent: unknown) => unknown): T => {
  const mappedContainers = new WeakMap<object, unknown>();

  const recurse = (value: unknown, currentPath: string): unknown => {
    // Handle arrays
    if (isArray(value)) {
      if (mappedContainers.has(value)) {
        return mappedContainers.get(value) as unknown[];
      }

      const mappedArray: unknown[] = [];
      mappedContainers.set(value, mappedArray);

      value.forEach((item, idx) => {
        const itemPath = buildChildPath(currentPath, String(idx), true);
        const transformed = mapper(String(idx), item, itemPath, value);
        mappedArray[idx] = isContainer(transformed) ? recurse(transformed, itemPath) : transformed;
      });

      return mappedArray;
    }

    // Handle objects
    if (isObject(value)) {
      if (mappedContainers.has(value)) {
        return mappedContainers.get(value) as Record<string, unknown>;
      }

      const result: Record<string, unknown> = {};
      mappedContainers.set(value, result);
      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        const keyPath = buildChildPath(currentPath, key, false);
        const transformed = mapper(key, val, keyPath, value);
        result[key] = isContainer(transformed) ? recurse(transformed, keyPath) : transformed;
      }

      return result;
    }

    // For primitives, return as-is
    return value;
  };

  // Start recursion
  const transformed = mapper('', obj, '', null);
  return recurse(transformed, '') as T;
};

/**
 * Deeply merges a patch object into a source object.
 *
 * - New keys in the patch object will be added to the source.
 * - Nested objects are recursively merged.
 * - Arrays behavior depends on `mergeArrays` option:
 *   - If false: All arrays are replaced entirely.
 *   - If true: Arrays containing objects are merged index-by-index, primitive arrays are replaced.
 *   - If string: Arrays are merged by matching the specified key field (e.g., 'id').
 *   - If function: Arrays are merged by matching the result of the key extractor function (item, index) => key.
 * - Strict mode: When `strict` is true, only keys/items that exist in the source will be merged.
 *   New keys from the patch and non-matching array items will be ignored.
 *
 * @template TSource - Type of the source object.
 * @template TPatch - Type of the patch object (can be any object, not necessarily related to TSource).
 * @param source - The original object to be merged into.
 * @param patch - The object containing updates or new keys to be merged.
 * @param options - Merge options controlling immutability and undefined handling.
 * @returns A new object that is the result of deeply merging the patch into the source.
 *
 * @example
 * ```ts
 * import { mergeObject } from 'std-kit';
 *
 * mergeObject(
 *   { user: { name: 'Ada', tags: ['admin'] } },
 *   { user: { name: 'Grace', tags: ['editor'] } },
 * );
 * // { user: { name: 'Grace', tags: ['editor'] } }
 * ```
 */
export const mergeObject = <TSource extends object, TPatch extends object>(
  source: TSource,
  patch: Readonly<TPatch>,
  options: Readonly<{
    strict?: boolean;
    immutable?: boolean;
    mergeArrays?: boolean | string | ((item: unknown, index: number) => unknown);
    applyUndefined?: boolean;
  }> = {},
): TSource & TPatch => {
  const normalizedOptions = normalizeMergeOptions(options);
  const merge = (src: PlainObject, patchObj: PlainObject, isStrictAtThisLevel: boolean): PlainObject =>
    mergePlainObjects({
      src,
      patch: patchObj,
      options: normalizedOptions,
      isStrictAtThisLevel,
      mergeNested: merge,
    });

  return merge(source as PlainObject, patch as PlainObject, normalizedOptions.strict) as TSource & TPatch;
};

/**
 * Deeply merges a patch object into a source object.
 *
 * @deprecated Use mergeObject instead.
 * @template TSource - Type of the source object.
 * @template TPatch - Type of the patch object.
 * @param source - The original object to be merged into.
 * @param patch - The object containing updates or new keys to be merged.
 * @param options - Merge options controlling immutability and undefined handling.
 * @returns A new object that is the result of deeply merging the patch into the source.
 */
export const deepMerge = mergeObject;
