/**
 * Creates a function that can only be called once. Subsequent calls return the result of the first invocation.
 *
 * @example
 *   ```ts
 *   import { once } from 'std-kit';
 *
 *   const initialize = once(() => Math.random());
 *
 *   const first = initialize();
 *   const second = initialize();
 *   // `first` and `second` are the same value
 *   ```
 *
 * @template Args - The argument tuple type.
 * @template Ret - The return type.
 * @param fn - The function to execute once.
 * @returns A new function that executes the original function only on the first call.
 */
export function once<Args extends unknown[], Ret>(fn: (...args: Args) => Ret): (...args: Args) => Ret {
  let called = false;
  let result: Ret;

  return function onceWrapper(...args: Args): Ret {
    if (!called) {
      const firstResult = fn(...args);
      result = firstResult;
      called = true;
      return result;
    }

    return result;
  };
}

/**
 * Creates a memoized version of a function that caches results based on arguments. Uses a Map to store cached results with the serialized arguments as the key.
 *
 * @example
 *   ```ts
 *   import { memoize } from 'std-kit';
 *
 *   const square = memoize((value: number) => value * value);
 *
 *   square(4);
 *   // 16
 *   ```;
 *
 * @template Args - The argument tuple type.
 * @template Ret - The return type.
 * @param fn - The function to memoize.
 * @param options - Memoization options.
 * @param options.keyFn - Optional function to generate cache key from arguments. Defaults to JSON.stringify.
 * @returns A memoized version of the function.
 */
export function memoize<Args extends unknown[], Ret>(
  fn: (...args: Args) => Ret,
  options: {
    keyFn?: (...args: Args) => string;
  } = {},
): (...args: Args) => Ret {
  const cache = new Map<string, Ret>();
  const keyFn = options.keyFn || ((...args: Args): string => JSON.stringify(args));

  return function memoized(...args: Args): Ret {
    const key = keyFn(...args);

    if (cache.has(key)) {
      return cache.get(key) as Ret;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
