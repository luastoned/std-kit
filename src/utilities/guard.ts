import { isPromise } from '~/utilities/generic';

/**
 * Wraps a function to safely execute it and catch any errors.
 * Works with both synchronous and asynchronous functions.
 *
 * @template F - The type of the function to guard.
 * @param fn - The function to execute safely.
 * @param shouldGuard - Optional predicate to determine if an error should be caught.
 *   If provided and returns false for an error, the error will be re-thrown.
 *   If not provided, all errors are caught and undefined is returned.
 * @returns The result of the function, or undefined if an error is caught.
 *   For async functions, returns a Promise that resolves to the result or undefined.
 *
 * @example
 * // Synchronous function
 * const result = guard(() => JSON.parse('invalid')); // returns undefined
 *
 * @example
 * // Asynchronous function
 * const data = await guard(async () => await fetch('/api')); // returns Response or undefined
 *
 * @example
 * // Selective error guarding
 * const value = guard(
 *   () => someOperation(),
 *   (err) => err instanceof TypeError // only catch TypeError, re-throw others
 * );
 */
export const guard = <F extends (...args: never[]) => unknown>(
  fn: F,
  shouldGuard?: (error: unknown) => boolean,
): ReturnType<F> extends Promise<infer T> ? Promise<T | undefined> : ReturnType<F> | undefined => {
  const handleError = (error: unknown): undefined => {
    if (shouldGuard && !shouldGuard(error)) {
      throw error;
    }

    return undefined;
  };

  try {
    const result = fn();

    if (isPromise(result)) {
      return result.catch(handleError) as ReturnType<F> extends Promise<infer T> ? Promise<T | undefined> : never;
    }

    return result as ReturnType<F> | undefined as ReturnType<F> extends Promise<infer T> ? Promise<T | undefined> : ReturnType<F> | undefined;
  } catch (error) {
    return handleError(error) as ReturnType<F> extends Promise<infer T> ? Promise<T | undefined> : ReturnType<F> | undefined;
  }
};
