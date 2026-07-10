import type { Container, MutableContainer } from '~/utilities/types';

/**
 * Checks if the given item is an array.
 *
 * @example
 *   ```ts
 *   import { isArray } from 'std-kit';
 *
 *   isArray([1, 2, 3]);
 *   // true
 *   ```;
 *
 * @param item - The item to check.
 * @returns `true` if the item is an array, `false` otherwise.
 */
export function isArray<T = unknown>(item: unknown): item is T[] | readonly T[] {
  return typeof item === 'object' && Array.isArray(item);
}

/**
 * Checks if the given item is a boolean.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a boolean, `false` otherwise.
 */
export function isBoolean(item: unknown): item is boolean {
  return typeof item === 'boolean';
}

/**
 * Checks if the given item is a Date object.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a Date object, `false` otherwise.
 */
export function isDate(item: unknown): item is Date {
  return item instanceof Date;
}

/**
 * Checks if the given item is defined.
 *
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is defined or not.
 */
export function isDefined<T = unknown>(item: T): item is Exclude<T, undefined> {
  return item !== undefined;
}

/**
 * Checks if the given item is an instance of the Error class.
 *
 * @param item - The item to check.
 * @returns `true` if the item is an instance of Error, `false` otherwise.
 */
export function isError(item: unknown): item is Error {
  return item instanceof Error;
}

/**
 * Checks if the given item is a function.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a function, `false` otherwise.
 */
export function isFunction(item: unknown): item is (...args: unknown[]) => unknown {
  return typeof item === 'function';
}

/**
 * Checks if the given item is an infinity number.
 *
 * @param item - The item to be checked.
 * @returns A boolean indicating whether the item is an infinity number.
 */
export function isInfinity(item: unknown): item is number {
  return item === Number.POSITIVE_INFINITY || item === Number.NEGATIVE_INFINITY;
}

/**
 * Checks if the given item is an instance of Map.
 *
 * @template K - The type of keys in the Map.
 * @template V - The type of values in the Map.
 * @param item - The item to check.
 * @returns `true` if the item is a Map, `false` otherwise.
 */
export function isMap<K = unknown, V = unknown>(item: unknown): item is Map<K, V> {
  return item instanceof Map;
}

/**
 * Checks if the given item is null.
 *
 * @param item - The item to check.
 * @returns `true` if the item is null, `false` otherwise.
 */
export function isNull(item: unknown): item is null {
  return item === null;
}

/**
 * Checks if the given item is a number.
 *
 * @param item - The item to be checked.
 * @returns `true` if the item is a number, `false` otherwise.
 */
export function isNumber(item: unknown): item is number {
  return typeof item === 'number' && Number.isFinite(item);
}

/**
 * Checks if the given item is an object.
 *
 * @example
 *   ```ts
 *   import { isObject } from 'std-kit';
 *
 *   isObject({ name: 'Ada' });
 *   // true
 *   ```;
 *
 * @param item - The item to check.
 * @returns `true` if the item is an object, `false` otherwise.
 */
export function isObject(item: unknown): item is Record<PropertyKey, unknown> {
  return typeof item === 'object' && !Array.isArray(item) && item !== null;
}

/**
 * Checks if the given item is an object or array container.
 *
 * @example
 *   ```ts
 *   import { isContainer } from 'std-kit';
 *
 *   isContainer(['a', 'b']);
 *   // true
 *   ```;
 *
 * @param item - The item to check.
 * @returns `true` if the item is an object or array container.
 */
export function isContainer(item: unknown): item is Container {
  return isObject(item) || isArray(item);
}

/**
 * Checks if the given item can be treated as a mutable container.
 *
 * @param item - The item to check.
 * @returns `true` if the item is an object or array suitable for mutation.
 */
export function isMutableContainer(item: unknown): item is MutableContainer {
  return isContainer(item);
}

/**
 * Checks if the given item is a plain object.
 *
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is a plain object.
 */
export function isPlainObject(item: unknown): item is Record<PropertyKey, unknown> {
  if (!isObject(item)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(item);
  return prototype === null || prototype === Object.prototype;
}

/**
 * Checks if the given item is a Promise.
 *
 * @example
 *   ```ts
 *   import { isPromise } from 'std-kit';
 *
 *   isPromise(Promise.resolve(42));
 *   // true
 *   ```;
 *
 * @param item - The item to check.
 * @returns `true` if the item is a Promise, `false` otherwise.
 */
export function isPromise<T = unknown>(item: unknown): item is Promise<T> {
  return item instanceof Promise;
}

/**
 * Checks if the given item is a regular expression.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a regular expression, `false` otherwise.
 */
export function isRegExp(item: unknown): item is RegExp {
  return item instanceof RegExp;
}

/**
 * Checks if the given item is a Set.
 *
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is a Set.
 */
export function isSet<T = unknown>(item: unknown): item is Set<T> {
  return item instanceof Set;
}

/**
 * Checks if the given item is a string.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a string, `false` otherwise.
 */
export function isString(item: unknown): item is string {
  return typeof item === 'string';
}

/**
 * Checks if the given item is a symbol.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a symbol, `false` otherwise.
 */
export function isSymbol(item: unknown): item is symbol {
  return typeof item === 'symbol';
}

/**
 * Checks if the given item is undefined.
 *
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is undefined or not.
 */
export function isUndefined(item: unknown): item is undefined {
  return item === undefined;
}

/**
 * Checks if the given item is an instance of WeakMap.
 *
 * @template K - The type of the keys in the WeakMap.
 * @template V - The type of the values in the WeakMap.
 * @param item - The item to be checked.
 * @returns A boolean indicating whether the item is an instance of WeakMap.
 */
export function isWeakMap<K extends WeakKey, V = unknown>(item: unknown): item is WeakMap<K, V> {
  return item instanceof WeakMap;
}

/**
 * Checks if the given item is a WeakSet.
 *
 * @template T - The type of the WeakSet keys.
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is a WeakSet.
 */
export function isWeakSet<T extends WeakKey>(item: unknown): item is WeakSet<T> {
  return item instanceof WeakSet;
}

/**
 * Creates a deep clone of an item using JSON.parse/JSON.stringify serialization. Supports most JSON-compatible types including objects, arrays, strings,
 * numbers, booleans, and null. Cannot clone functions, Dates, RegExps, Maps, Sets, ArrayBuffers, typed arrays, or circular references. For more complex cloning
 * needs, consider using structuredClone() which supports additional types.
 *
 * @example
 *   ```ts
 *   import { cloneObject } from 'std-kit';
 *
 *   const original = { user: { name: 'Ada' } };
 *   const cloned = cloneObject(original);
 *
 *   cloned.user.name = 'Grace';
 *   // original.user.name is still 'Ada'
 *   ```;
 *
 * @param item - The item to clone.
 * @returns The cloned item or undefined if the input is undefined.
 */
export function cloneObject<T>(item: T): T extends undefined ? undefined : T {
  return (item !== undefined ? JSON.parse(JSON.stringify(item)) : undefined) as T extends undefined ? undefined : T;
}
