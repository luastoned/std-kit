import type { Container } from '~/utilities/types';
import { isArray } from '~/utilities/generic';

/**
 * Path segments that are blocked to prevent prototype pollution.
 * @internal
 */
const FORBIDDEN_PATH_KEYS = new Set(['__proto__', 'constructor', 'prototype']);

/**
 * Shared predicate shape used by object traversal helpers.
 * @internal
 */
export type ObjectTraversalPredicate<T = unknown> = (key: string, value: T, path: string, parent: unknown) => boolean;

/**
 * Filter options for `filterObject`.
 * @internal
 */
type FilterObjectOptions = Readonly<{
  keys?: readonly string[] | ObjectTraversalPredicate;
  values?: ObjectTraversalPredicate;
}>;

/**
 * Normalizes filter input to explicit key/value predicates.
 * @internal
 * @param filterOrOptions - Direct predicate or options object.
 * @returns Normalized key and value predicates.
 */
export const normalizeFilterPredicates = (
  filterOrOptions: ObjectTraversalPredicate | FilterObjectOptions,
): Readonly<{ keyFilter?: ObjectTraversalPredicate; valueFilter?: ObjectTraversalPredicate }> => {
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
};

/**
 * Splits a dot/bracket path into normalized key segments.
 * @internal
 * @param path - The raw path (for example `user.posts[0].title`).
 * @returns A list of path segments.
 */
export const tokenizePath = (path: string): string[] => path.split(/[.[\]]/).filter(Boolean);

/**
 * Checks whether a parsed path includes forbidden keys.
 * @internal
 * @param keys - Parsed path segments.
 * @returns `true` when the path contains blocked keys.
 */
export const hasForbiddenPathKeys = (keys: readonly string[]): boolean => keys.some((key) => FORBIDDEN_PATH_KEYS.has(key));

/**
 * Checks whether a path segment represents an array index.
 * @internal
 * @param key - The path segment to check.
 * @returns `true` when the segment is an integer-like index.
 */
export const isArrayIndexSegment = (key: string): boolean => /^\d+$/.test(key);

/**
 * Builds a child path segment from a parent path and key.
 * @internal
 * @param currentPath - Parent path.
 * @param key - Child key/index segment.
 * @param isParentArray - Whether the parent container is an array.
 * @returns The normalized child path.
 */
export const buildChildPath = (currentPath: string, key: string, isParentArray: boolean): string => {
  if (isParentArray) {
    return `${currentPath}[${key}]`;
  }

  return currentPath ? `${currentPath}.${key}` : key;
};

/**
 * Iterates all entries of a container and provides normalized child paths.
 * @internal
 * @param container - Container to iterate.
 * @param currentPath - Parent path.
 * @param visitor - Visitor called for each entry.
 * @returns Nothing.
 */
export const forEachContainerEntry = (
  container: Container,
  currentPath: string,
  visitor: (key: string, childValue: unknown, childPath: string) => void,
): void => {
  const isParentArray = isArray(container);
  for (const [key, childValue] of Object.entries(container)) {
    visitor(key, childValue, buildChildPath(currentPath, key, isParentArray));
  }
};
