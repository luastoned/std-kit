/**
 * Checks for the minimal interoperable promise contract across realms.
 */
function isPromiseLike<T>(value: T | PromiseLike<T>): value is PromiseLike<T> {
  return ((typeof value === 'object' && value !== null) || typeof value === 'function') && typeof (value as PromiseLike<T>).then === 'function';
}

/**
 * Wraps a function to safely execute it and catch any errors. Works with synchronous results, Promises from any realm, and generic thenables.
 *
 * @example
 *   ```ts
 *   import { guard } from 'std-kit';
 *
 *   const parsed = guard(() => JSON.parse('{"ok":true}'));
 *   // { ok: true }
 *
 *   const invalid = guard(() => JSON.parse('invalid'));
 *   // undefined
 *   ```;
 *
 * @template T - The result type of the guarded function.
 * @param fn - The function to execute safely.
 * @param shouldGuard - Optional predicate to determine if an error should be caught. If provided and returns false for an error, the error will be re-thrown.
 *   If not provided, all errors are caught and undefined is returned.
 * @returns The result of the function, or undefined if an error is caught.
 *   For Promise-like results, returns a native Promise that resolves to the result or undefined.
 */
export function guard<T>(fn: () => PromiseLike<T>, shouldGuard?: (error: unknown) => boolean): Promise<T | undefined>;
export function guard<T>(fn: () => T, shouldGuard?: (error: unknown) => boolean): T | undefined;
export function guard<T>(fn: () => T | PromiseLike<T>, shouldGuard?: (error: unknown) => boolean): T | Promise<T | undefined> | undefined {
  function handleError(error: unknown): undefined {
    if (shouldGuard && !shouldGuard(error)) {
      throw error;
    }

    return undefined;
  }

  try {
    const result = fn();

    if (isPromiseLike(result)) {
      return Promise.resolve(result).catch(handleError);
    }

    return result;
  } catch (error) {
    return handleError(error);
  }
}
