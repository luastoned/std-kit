import type { GetFieldType, PlainObject } from '~/utilities/types';
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
