import type { Container, MutableContainer } from '~/utilities/types';

/**
 * Checks if the given item is an array.
 *
 * @param item - The item to check.
 * @returns `true` if the item is an array, `false` otherwise.
 *
 * @example
 * ```ts
 * import { isArray } from 'std-kit';
 *
 * isArray([1, 2, 3]);
 * // true
 * ```
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
 * @param item - The item to check.
 * @returns `true` if the item is a Date object, `false` otherwise.
 */
export const isDate = (item: unknown): item is Date => item instanceof Date;

/**
 * Checks if the given item is defined.
 *
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is defined or not.
 */
export const isDefined = <T = unknown>(item: T): item is Exclude<T, undefined> => item !== undefined;

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
export const isFunction = (item: unknown): item is (...args: unknown[]) => unknown => typeof item === 'function';

/**
 * Checks if the given item is an infinity number.
 *
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
 * @param item - The item to check.
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
 *
 * @example
 * ```ts
 * import { isObject } from 'std-kit';
 *
 * isObject({ name: 'Ada' });
 * // true
 * ```
 */
export const isObject = (item: unknown): item is Record<PropertyKey, unknown> => typeof item === 'object' && !Array.isArray(item) && item !== null;

/**
 * Checks if the given item is an object or array container.
 *
 * @param item - The item to check.
 * @returns `true` if the item is an object or array container.
 *
 * @example
 * ```ts
 * import { isContainer } from 'std-kit';
 *
 * isContainer(['a', 'b']);
 * // true
 * ```
 */
export const isContainer = (item: unknown): item is Container => isObject(item) || isArray(item);

/**
 * Checks if the given item can be treated as a mutable container.
 *
 * @param item - The item to check.
 * @returns `true` if the item is an object or array suitable for mutation.
 */
export const isMutableContainer = (item: unknown): item is MutableContainer => isContainer(item);

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
 *
 * @example
 * ```ts
 * import { isPromise } from 'std-kit';
 *
 * isPromise(Promise.resolve(42));
 * // true
 * ```
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
 * Creates a deep clone of an item using JSON.parse/JSON.stringify serialization.
 * Supports most JSON-compatible types including objects, arrays, strings, numbers, booleans, and null.
 * Cannot clone functions, Dates, RegExps, Maps, Sets, ArrayBuffers, typed arrays, or circular references.
 * For more complex cloning needs, consider using structuredClone() which supports additional types.
 *
 * @param item - The item to clone.
 * @returns The cloned item or undefined if the input is undefined.
 *
 * @example
 * ```ts
 * import { cloneObject } from 'std-kit';
 *
 * const original = { user: { name: 'Ada' } };
 * const cloned = cloneObject(original);
 *
 * cloned.user.name = 'Grace';
 * // original.user.name is still 'Ada'
 * ```
 */
export const cloneObject = <T>(item: T): T extends undefined ? undefined : T =>
  (item !== undefined ? JSON.parse(JSON.stringify(item)) : undefined) as T extends undefined ? undefined : T;
