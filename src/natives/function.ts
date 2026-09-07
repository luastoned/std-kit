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
 * Options for creating a memoized function.
 */
export interface MemoizeOptions<Args extends unknown[]> {
  /**
   * Resolves all arguments to one cache key. By default, each argument is keyed separately by value or object identity.
   */
  readonly keyFn?: (...args: Args) => unknown;
}

/**
 * A memoized function with explicit cache lifecycle control.
 */
export interface MemoizedFunction<Args extends unknown[], Ret> {
  (...args: Args): Ret;
  /**
   * Clears every cached result.
   */
  clear(): void;
}

interface MemoizeCacheNode<Ret> {
  readonly children: Map<unknown, MemoizeCacheNode<Ret>>;
  hasValue: boolean;
  value?: Ret;
}

function createMemoizeCacheNode<Ret>(): MemoizeCacheNode<Ret> {
  return { children: new Map(), hasValue: false };
}

/**
 * Creates a memoized version of a function that caches results by primitive value and object identity.
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
 * @param options.keyFn - Optional function that resolves all arguments to one cache key.
 * @returns A memoized version of the function with a `clear()` method.
 */
export function memoize<Args extends unknown[], Ret>(fn: (...args: Args) => Ret, options: Readonly<MemoizeOptions<Args>> = {}): MemoizedFunction<Args, Ret> {
  let root = createMemoizeCacheNode<Ret>();

  const memoized = function memoized(...args: Args): Ret {
    const keys: readonly unknown[] = options.keyFn ? [options.keyFn(...args)] : args;
    let node = root;

    for (const key of keys) {
      let child = node.children.get(key);
      if (!child) {
        child = createMemoizeCacheNode<Ret>();
        node.children.set(key, child);
      }
      node = child;
    }

    if (node.hasValue) {
      return node.value as Ret;
    }

    const result = fn(...args);
    node.value = result;
    node.hasValue = true;
    return result;
  } as MemoizedFunction<Args, Ret>;

  memoized.clear = (): void => {
    root = createMemoizeCacheNode<Ret>();
  };

  return memoized;
}
