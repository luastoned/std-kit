import { isArray } from '~/utilities/generic';
import type { Container } from '~/utilities/types';

/**
 * Path segments that are blocked to prevent prototype pollution.
 *
 * @internal
 */
const FORBIDDEN_PATH_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Checks whether a property key is unsafe to traverse or merge.
 *
 * @param key - Property key to check.
 * @returns `true` for keys that can mutate an object's prototype chain.
 * @internal
 */
export function isForbiddenPathKey(key: string): boolean {
  return FORBIDDEN_PATH_KEYS.has(key);
}

/**
 * Defines an enumerable own data property without invoking legacy prototype setters.
 *
 * @param target - Object receiving the property.
 * @param key - Property key to define.
 * @param value - Property value.
 * @returns Nothing.
 * @internal
 */
export function setOwnEnumerableProperty(target: Record<PropertyKey, unknown>, key: PropertyKey, value: unknown): void {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  });
}

/**
 * Runs a traversal step while guarding only the active recursion path against cycles.
 * Shared references may therefore still be visited through distinct object paths.
 *
 * @param container - Container currently being traversed.
 * @param visiting - Active recursion-path set.
 * @param onCycle - Fallback used when the container is already active.
 * @param visit - Traversal operation.
 * @returns The traversal result or cycle fallback.
 * @internal
 */
export function withActiveContainer<T>(container: object, visiting: WeakSet<object>, onCycle: () => T, visit: () => T): T {
  if (visiting.has(container)) {
    return onCycle();
  }

  visiting.add(container);
  try {
    return visit();
  } finally {
    visiting.delete(container);
  }
}

/**
 * Shared predicate shape used by object traversal helpers.
 *
 * @internal
 */
export type ObjectTraversalPredicate<T = unknown> = (key: string, value: T, path: string, parent: unknown) => boolean;

/**
 * Filter options for `filterObject`.
 *
 * @internal
 */
type FilterObjectOptions = Readonly<{
  keys?: readonly string[] | ObjectTraversalPredicate;
  values?: ObjectTraversalPredicate;
}>;

/**
 * Normalizes filter input to explicit key/value predicates.
 *
 * @param filterOrOptions - Direct predicate or options object.
 * @returns Normalized key and value predicates.
 * @internal
 */
export function normalizeFilterPredicates(
  filterOrOptions: ObjectTraversalPredicate | FilterObjectOptions,
): Readonly<{ keyFilter?: ObjectTraversalPredicate; valueFilter?: ObjectTraversalPredicate }> {
  if (typeof filterOrOptions === 'function') {
    return { valueFilter: filterOrOptions };
  }

  const keys = filterOrOptions.keys;
  const keyFilter = typeof keys === 'function' ? keys : isArray(keys) ? (key: string): boolean => keys.includes(key) : undefined;
  const normalized: { keyFilter?: ObjectTraversalPredicate; valueFilter?: ObjectTraversalPredicate } = {};

  if (keyFilter !== undefined) {
    normalized.keyFilter = keyFilter;
  }

  if (filterOrOptions.values !== undefined) {
    normalized.valueFilter = filterOrOptions.values;
  }

  return normalized;
}

/**
 * Splits a dot/bracket path into normalized key segments.
 *
 * @param path - The raw path (for example `user.posts[0].title`).
 * @returns A list of path segments.
 * @internal
 */
export function tokenizePath(path: string): string[] {
  return path.split(/[.[\]]/).filter(Boolean);
}

/**
 * Checks whether a parsed path includes forbidden keys.
 *
 * @param keys - Parsed path segments.
 * @returns `true` when the path contains blocked keys.
 * @internal
 */
export function hasForbiddenPathKeys(keys: readonly string[]): boolean {
  return keys.some((key) => isForbiddenPathKey(key));
}

/**
 * Checks whether a path segment represents an array index.
 *
 * @param key - The path segment to check.
 * @returns `true` when the segment is an integer-like index.
 * @internal
 */
export function isArrayIndexSegment(key: string): boolean {
  return /^\d+$/.test(key);
}

/**
 * Builds a child path segment from a parent path and key.
 *
 * @param currentPath - Parent path.
 * @param key - Child key/index segment.
 * @param isParentArray - Whether the parent container is an array.
 * @returns The normalized child path.
 * @internal
 */
export function buildChildPath(currentPath: string, key: string, isParentArray: boolean): string {
  if (isParentArray) {
    return `${currentPath}[${key}]`;
  }

  return currentPath ? `${currentPath}.${key}` : key;
}

/**
 * Iterates all entries of a container and provides normalized child paths.
 *
 * @param container - Container to iterate.
 * @param currentPath - Parent path.
 * @param visitor - Visitor called for each entry.
 * @returns Nothing.
 * @internal
 */
export function forEachContainerEntry(container: Container, currentPath: string, visitor: (key: string, childValue: unknown, childPath: string) => void): void {
  const isParentArray = isArray(container);
  for (const [key, childValue] of Object.entries(container)) {
    visitor(key, childValue, buildChildPath(currentPath, key, isParentArray));
  }
}
