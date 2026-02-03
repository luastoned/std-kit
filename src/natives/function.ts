/**
 * Creates a function that can only be called once.
 * Subsequent calls return the result of the first invocation.
 *
 * @template F - The type of the function to wrap.
 * @param fn - The function to execute once.
 * @returns A new function that executes the original function only on the first call.
 */
export const once = <F extends (...args: never[]) => unknown>(fn: F): ((...args: Parameters<F>) => ReturnType<F> | undefined) => {
  let called = false;
  let result: ReturnType<F>;

  return (...args: Parameters<F>): ReturnType<F> | undefined => {
    if (!called) {
      called = true;
      result = fn(...args) as ReturnType<F>;
      return result;
    }
    return result;
  };
};

/**
 * Creates a memoized version of a function that caches results based on arguments.
 * Uses a Map to store cached results with the serialized arguments as the key.
 *
 * @template F - The type of the function to memoize.
 * @param fn - The function to memoize.
 * @param options - Memoization options.
 * @param options.keyFn - Optional function to generate cache key from arguments. Defaults to JSON.stringify.
 * @returns A memoized version of the function.
 */
export const memoize = <F extends (...args: never[]) => unknown>(
  fn: F,
  options: {
    keyFn?: (...args: Parameters<F>) => string;
  } = {},
): ((...args: Parameters<F>) => ReturnType<F>) => {
  const cache = new Map<string, ReturnType<F>>();
  const keyFn = options.keyFn || ((...args: Parameters<F>): string => JSON.stringify(args));

  return (...args: Parameters<F>): ReturnType<F> => {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return cache.get(key) as ReturnType<F>;
    }

    const result = fn(...args) as ReturnType<F>;
    cache.set(key, result);
    return result;
  };
};
