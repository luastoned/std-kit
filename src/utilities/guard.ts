import { isPromise } from '~/utilities/generic';

/**
 * Wraps a function to safely execute it and catch any errors.
 * Works with both synchronous and asynchronous functions.
 *
 * @template T - The result type of the guarded function.
 * @param fn - The function to execute safely.
 * @param shouldGuard - Optional predicate to determine if an error should be caught.
 *   If provided and returns false for an error, the error will be re-thrown.
 *   If not provided, all errors are caught and undefined is returned.
 * @returns The result of the function, or undefined if an error is caught.
 *   For async functions, returns a Promise that resolves to the result or undefined.
 *
 * @example
 * ```ts
 * import { guard } from 'std-kit';
 *
 * const parsed = guard(() => JSON.parse('{"ok":true}'));
 * // { ok: true }
 *
 * const invalid = guard(() => JSON.parse('invalid'));
 * // undefined
 * ```
 */
export function guard<T>(fn: () => Promise<T>, shouldGuard?: (error: unknown) => boolean): Promise<T | undefined>;
export function guard<T>(fn: () => T, shouldGuard?: (error: unknown) => boolean): T | undefined;
export function guard<T>(fn: () => T | Promise<T>, shouldGuard?: (error: unknown) => boolean): T | Promise<T | undefined> | undefined {
  const handleError = (error: unknown): undefined => {
    if (shouldGuard && !shouldGuard(error)) {
      throw error;
    }

    return undefined;
  };

  try {
    const result = fn();

    if (isPromise(result)) {
      return result.catch(handleError);
    }

    return result;
  } catch (error) {
    return handleError(error);
  }
}
