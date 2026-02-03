import type { DeepPartial, GetFieldType, PlainObject } from '~/utilities/types';
import { isArray, isObject, isPlainObject } from '~/utilities/generic';

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
 */
export const getValue = <TData, TPath extends string, TDefault = GetFieldType<TData, TPath>>(
  data: Readonly<TData>,
  path: TPath,
  defaultValue?: TDefault,
): GetFieldType<TData, TPath> | TDefault => {
  const keys = path.split(/[\.\[\]]/).filter(Boolean); // Split by dot or brackets, remove empty parts

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
 */
export const setValue = <TData, TPath extends string, TValue>(data: TData, path: TPath, value: TValue): void => {
  const keys = path.split(/[\.\[\]]/).filter(Boolean); // Split by dot or brackets, remove empty parts

  // biome-ignore lint/suspicious/noExplicitAny: current is unknown territory, this is fine
  let current: any = data; // Start at the root object
  for (let idx = 0; idx < keys.length; idx++) {
    const key = keys[idx];

    // SECURITY: Prevent prototype pollution
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      return;
    }

    // If we are at the last key, assign the value
    if (idx === keys.length - 1) {
      current[key] = value;
    } else {
      // Check if the current key exists and is an object or array
      if (current[key] === null || current[key] === undefined || typeof current[key] !== 'object') {
        // Create an empty object or array if the next key is a number (array-like access)
        const nextKey = keys[idx + 1];
        current[key] = /^\d+$/.test(nextKey) ? [] : {};
      }

      current = current[key]; // Move to the next level
    }
  }
};

type SearchResult<T, P extends boolean> = P extends true ? { path: string; value: T } : T;

/**
 * Recursively searches through an object or array tree, finding all values that match the filter function.
 * Returns a flat array of matching values, optionally with their paths.
 *
 * The return type is inferred dynamically based on the `path` argument. If `path: true`, the return type includes
 * both the path and the value. Otherwise, it returns just the values.
 *
 * @template R - The expected return type of matching values.
 * @template T - The type of values being filtered in the tree.
 * @template P - A boolean, controlling whether the path should be included in the return type.
 * @param obj - The object or array to search through.
 * @param filter - The filter function that returns true for matching values. Receives (key, value, path, parent).
 * @param path - Whether to include the path in the result.
 * If `true`, the path to the matching value is returned alongside the result.
 * @returns A flat array of matching values or matching values with paths (if `path` is true).
 */
export const queryObject = <R = unknown, T = unknown, P extends boolean = false>(
  obj: unknown,
  filter: (key: string, value: T, path: string, parent: unknown) => boolean,
  path: P = false as P,
): Array<SearchResult<R, P>> => {
  const results: Array<SearchResult<R, P>> = [];

  /**
   * Helper function to build the new path based on the current path, key, and parent type.
   */
  const buildPath = (currentPath: string, key: string, isParentArray: boolean): string => {
    if (isParentArray) {
      return `${currentPath}[${key}]`;
    }

    return currentPath ? `${currentPath}.${key}` : key;
  };

  /**
   * Recursive traversal function to iterate over the object or array.
   */
  const traverse = (value: unknown, currentPath = '', currentKey = '', parent: unknown = null): void => {
    // Check if the current node matches criteria
    if (filter(currentKey, value as T, currentPath, parent)) {
      if (path) {
        results.push({ path: currentPath, value: value as T } as SearchResult<R, P>);
      } else {
        results.push(value as SearchResult<R, P>);
      }
    }

    if (typeof value === 'object' && value !== null) {
      // Determine if current container is an array to format child paths correctly
      const isArrayContainer = Array.isArray(value);

      for (const [key, childValue] of Object.entries(value)) {
        const newPath = buildPath(currentPath, key, isArrayContainer);
        traverse(childValue, newPath, key, value);
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
 * Recursively filters an object or array tree, preserving the original structure but only keeping
 * items that match the specified key and/or value filters.
 *
 * @template T - The type of the object or array to filter.
 * @param obj - The object or array to filter.
 * @param options - Filter options:
 *   - `keys`: Array of key names to keep, or a function to test keys with access to both key and value
 *   - `values`: Function to test values with access to both key and value
 *   If both are provided, both conditions must be satisfied.
 * @returns A new object/array with the same structure, containing only matching items.
 *
 * @example
 * // Keep only specific keys
 * filterTree(obj, { keys: ['color', 'background'] })
 *
 * @example
 * // Keep only string values
 * filterTree(obj, { values: (key, value) => typeof value === 'string' })
 *
 * @example
 * // Keep keys containing 'color' in parent objects with type 'theme'
 * filterTree(obj, {
 *   keys: (key, value, path, parent) =>
 *     key.includes('color') && parent?.type === 'theme'
 * })
 *
 * @example
 * // Combine both filters with path awareness
 * filterObject(obj, {
 *   keys: ['color', 'name'],
 *   values: (key, value, path) =>
 *     typeof value === 'string' && !path.includes('internal')
 * })
 */
export const filterObject = <T>(
  obj: Readonly<T>,
  options: Readonly<{
    keys?: readonly string[] | ((key: string, value: unknown, path: string, parent: unknown) => boolean);
    values?: (key: string, value: unknown, path: string, parent: unknown) => boolean;
  }>,
): DeepPartial<T> | undefined => {
  const { keys, values } = options;

  const recurse = (value: unknown, currentPath: string, parent: unknown): unknown => {
    // Create key filter function
    let keyFilter: ((key: string, val: unknown, path: string, par: unknown) => boolean) | undefined;
    if (keys) {
      if (Array.isArray(keys)) {
        keyFilter = (key: string) => keys.includes(key);
      } else if (typeof keys === 'function') {
        keyFilter = keys;
      }
    }

    // If the current value matches the value filter, return it as-is (keep entire subtree)
    if (values && values('', value, currentPath, parent)) {
      return value;
    }

    // If no container and doesn't match value filter, exclude it
    if (!isObject(value) && !isArray(value)) {
      return undefined;
    }

    // Handle arrays - recursively filter children
    if (Array.isArray(value)) {
      const filtered = value
        .map((item, index) => {
          const itemPath = `${currentPath}[${index}]`;
          return recurse(item, itemPath, value);
        })
        .filter((item) => item !== undefined);

      return filtered.length > 0 ? filtered : undefined;
    }

    // Handle objects
    if (isObject(value)) {
      const result: Record<string, unknown> = {};
      let hasMatchingItems = false;

      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        const keyPath = currentPath ? `${currentPath}.${key}` : key;

        // Check if key matches (if key filter exists)
        const keyMatches = !keyFilter || keyFilter(key, val, keyPath, value);

        if (keyMatches) {
          // Check if value matches (if value filter exists)
          const valueMatches = !values || values(key, val, keyPath, value);

          if (valueMatches) {
            // Both key and value match (or no filter for that dimension)
            result[key] = val;
            hasMatchingItems = true;
          } else if (isObject(val) || Array.isArray(val)) {
            // Value doesn't match but is a container, recurse into it
            const filteredValue = recurse(val, keyPath, value);
            if (filteredValue !== undefined) {
              result[key] = filteredValue;
              hasMatchingItems = true;
            }
          }
        } else {
          // Key doesn't match - if it's a container, still recurse to check children
          if (isObject(val) || Array.isArray(val)) {
            const filteredValue = recurse(val, keyPath, value);
            if (filteredValue !== undefined) {
              result[key] = filteredValue;
              hasMatchingItems = true;
            }
          }
        }
      }

      return hasMatchingItems ? result : undefined;
    }

    return undefined;
  };

  return recurse(obj, '', null) as DeepPartial<T> | undefined;
};

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
 * // Double all numbers
 * mapTree({ a: 1, b: { c: 2 } }, (key, value) =>
 *   typeof value === 'number' ? value * 2 : value
 * )
 *
 * @example
 * // Uppercase all strings, with path and parent context
 * mapTree(obj, (key, value, path, parent) => {
 *   console.log(`At ${path}: ${value}`);
 *   return typeof value === 'string' ? value.toUpperCase() : value;
 * })
 *
 * @example
 * // Format values based on sibling properties in parent
 * mapTree(obj, (key, value, path, parent) => {
 *   if (key === 'amount' && parent?.currency === 'EUR') {
 *     return `€${value}`;
 *   }
 *   return value;
 * })
 */
export const mapObject = <T>(obj: T, mapper: (key: string, value: unknown, path: string, parent: unknown) => unknown): T => {
  const recurse = (value: unknown, currentPath: string, parent: unknown): unknown => {
    // Handle arrays
    if (Array.isArray(value)) {
      return value.map((item, index) => {
        const itemPath = currentPath ? `${currentPath}[${index}]` : `[${index}]`;
        const transformed = mapper(String(index), item, itemPath, value);
        return isObject(transformed) || Array.isArray(transformed) ? recurse(transformed, itemPath, transformed) : transformed;
      });
    }

    // Handle objects
    if (isObject(value)) {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        const keyPath = currentPath ? `${currentPath}.${key}` : key;
        const transformed = mapper(key, val, keyPath, value);
        result[key] = isObject(transformed) || Array.isArray(transformed) ? recurse(transformed, keyPath, transformed) : transformed;
      }
      return result;
    }

    // For primitives, return as-is
    return value;
  };

  // Start recursion
  const transformed = mapper('', obj, '', null);
  return recurse(transformed, '', transformed) as T;
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
 *
 * @template TSource - Type of the source object.
 * @template TPatch - Type of the patch object (can be any object, not necessarily related to TSource).
 * @param source - The original object to be merged into.
 * @param patch - The object containing updates or new keys to be merged.
 * @param options - Merge options controlling immutability and undefined handling.
 * @returns A new object that is the result of deeply merging the patch into the source.
 */
export const mergeObject = <TSource extends object, TPatch extends object>(
  source: TSource,
  patch: Readonly<TPatch>,
  options: Readonly<{
    immutable?: boolean;
    mergeArrays?: boolean | string | ((item: unknown, index: number) => unknown);
    replaceIfUndefined?: boolean;
  }> = {},
): TSource & TPatch => {
  const { immutable = true, mergeArrays = true, replaceIfUndefined = false } = options;
  /**
   * Recursively merges two objects.
   *
   * @param src - The source object being updated.
   * @param patchObj - The patch object providing updates.
   * @returns The merged object.
   */
  const merge = (src: PlainObject, patchObj: PlainObject): PlainObject => {
    const target = immutable ? { ...src } : src; // Create a copy if immutable, or work directly on the source

    for (const [key, patchValue] of Object.entries(patchObj)) {
      const srcValue = target[key];

      if (patchValue !== null && patchValue !== undefined && isPlainObject(patchValue)) {
        if (!isPlainObject(srcValue)) {
          target[key] = {}; // Initialize as an object if `srcValue` is undefined or not an object
        }

        target[key] = merge(target[key] as PlainObject, patchValue as PlainObject);
      } else if (isArray(patchValue)) {
        // Handle array merging based on strategy
        if (mergeArrays && isArray(srcValue) && patchValue.length > 0) {
          // Check if patch array contains objects (check first element as sample)
          const hasObjects = patchValue.some((item) => isPlainObject(item));

          if (hasObjects) {
            // Determine merge strategy based on mergeArrays type
            if (typeof mergeArrays === 'string' || typeof mergeArrays === 'function') {
              // Merge by key field or key extractor function
              const getKey =
                typeof mergeArrays === 'string'
                  ? (item: unknown, idx: number) => (isPlainObject(item) ? (item as PlainObject)[mergeArrays] : undefined)
                  : mergeArrays;

              // Create a map of source items by their key
              const srcMap = new Map<unknown, unknown>();
              const srcItemsWithoutKey: unknown[] = [];

              for (let idx = 0; idx < srcValue.length; idx++) {
                const srcItem = srcValue[idx];
                if (isPlainObject(srcItem)) {
                  const key = getKey(srcItem, idx);
                  if (key !== undefined && key !== null) {
                    srcMap.set(key, srcItem);
                  } else {
                    // Source item has no key, preserve it
                    srcItemsWithoutKey.push(srcItem);
                  }
                } else {
                  // Non-object source item, preserve it
                  srcItemsWithoutKey.push(srcItem);
                }
              }

              // Merge patch items with source items by key
              const mergedArray: unknown[] = [];
              const usedKeys = new Set<unknown>();

              for (let idx = 0; idx < patchValue.length; idx++) {
                const patchItem = patchValue[idx];
                if (isPlainObject(patchItem)) {
                  const key = getKey(patchItem, idx);
                  if (key !== undefined && key !== null && srcMap.has(key)) {
                    // Found matching source item, merge them
                    const srcItem = srcMap.get(key);
                    mergedArray.push(merge(srcItem as PlainObject, patchItem as PlainObject));
                    usedKeys.add(key);
                  } else {
                    // No matching source item, add patch item
                    mergedArray.push(isPlainObject(patchItem) ? { ...patchItem } : patchItem);
                  }
                } else {
                  // Patch item is not an object, use it directly
                  mergedArray.push(patchItem);
                }
              }

              // Add remaining source items that weren't matched
              for (let idx = 0; idx < srcValue.length; idx++) {
                const srcItem = srcValue[idx];
                if (isPlainObject(srcItem)) {
                  const key = getKey(srcItem, idx);
                  if (key !== undefined && key !== null && !usedKeys.has(key)) {
                    mergedArray.push(srcItem);
                  }
                }
              }

              // Add source items without keys
              mergedArray.push(...srcItemsWithoutKey);

              target[key] = mergedArray;
            } else {
              // Merge arrays index-by-index for object arrays (mergeArrays === true)
              const maxLength = Math.max(srcValue.length, patchValue.length);
              const mergedArray: unknown[] = [];

              for (let idx = 0; idx < maxLength; idx++) {
                if (idx < patchValue.length) {
                  const patchItem = patchValue[idx];
                  const srcItem = idx < srcValue.length ? srcValue[idx] : undefined;

                  if (isPlainObject(patchItem)) {
                    // Merge objects at this index
                    if (isPlainObject(srcItem)) {
                      mergedArray[idx] = merge(srcItem as PlainObject, patchItem as PlainObject);
                    } else {
                      // Source doesn't have an object at this index, use patch value
                      mergedArray[idx] = isPlainObject(patchItem) ? { ...patchItem } : patchItem;
                    }
                  } else {
                    // Patch item is not an object, use it directly
                    mergedArray[idx] = patchItem;
                  }
                } else {
                  // Patch is shorter, keep source items
                  mergedArray[idx] = srcValue[idx];
                }
              }

              target[key] = mergedArray;
            }
          } else {
            // Primitive array - replace entirely
            target[key] = [...patchValue];
          }
        } else {
          // mergeArrays disabled or source is not an array - replace entirely
          target[key] = [...patchValue];
        }
      } else {
        // Standard merge: If key exists in patch, overwrite source
        // Only skip if patchValue is undefined AND replaceIfUndefined is false
        if (patchValue !== undefined || replaceIfUndefined) {
          target[key] = patchValue;
        }
      }
    }

    return target;
  };

  return merge(source as PlainObject, patch as PlainObject) as TSource & TPatch;
};

/** @deprecated Use mergeObject instead */
export const deepMerge = mergeObject;

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
