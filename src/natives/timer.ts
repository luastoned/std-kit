/**
 * Pauses the execution for the specified number of milliseconds.
 *
 * @example
 *   ```ts
 *   import { sleep } from 'std-kit';
 *
 *   await sleep(250);
 *   ```;
 *
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified number of milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a debounced version of the provided callback function. The debounced function will delay invoking the callback until after a specified amount of time
 * has passed since the last time it was invoked.
 *
 * @example
 *   ```ts
 *   import { debounce } from 'std-kit';
 *
 *   const save = debounce((value: string) => console.log(value), 200);
 *   save('draft');
 *   save('draft updated');
 *   // only the last call runs after 200ms
 *   ```;
 *
 * @template Args - The argument tuple type.
 * @template Ret - The callback return type.
 * @param callback - The original callback function to debounce.
 * @param waitFor - The amount of time (in milliseconds) to wait before invoking the debounced callback.
 * @returns The debounced callback function.
 */
export function debounce<Args extends unknown[], Ret>(callback: (...args: Args) => Ret, waitFor: number): (...args: Args) => void {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return function debounced(...args: Args): void {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => callback(...args), waitFor);
  };
}

/**
 * Throttles a function and returns a promise that resolves with the result of the function. The function will be called at most once within the specified time
 * interval. Calls coalesced into the same trailing invocation all settle with that invocation's result.
 *
 * @example
 *   ```ts
 *   import { throttle } from 'std-kit';
 *
 *   const search = throttle((term: string) => term.toUpperCase(), 100);
 *
 *   await search('a');
 *   // 'A'
 *   ```;
 *
 * @template Args - The argument tuple type.
 * @template Ret - The callback return type.
 * @param callback - The function to throttle.
 * @param waitFor - The time interval in milliseconds.
 * @returns A throttled function that returns a promise.
 */
export function throttle<Args extends unknown[], Ret>(callback: (...args: Args) => Ret, waitFor: number): (...args: Args) => Promise<Awaited<Ret>> {
  const normalizedWait = Number.isFinite(waitFor) ? Math.max(0, waitFor) : 0;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let lastInvocation = Number.NEGATIVE_INFINITY;
  let trailingArgs: Args | undefined;
  let trailingWaiters: Array<{
    resolve: (value: Awaited<Ret> | PromiseLike<Awaited<Ret>>) => void;
    reject: (reason?: unknown) => void;
  }> = [];

  function invoke(args: Args): Promise<Awaited<Ret>> {
    lastInvocation = Date.now();
    try {
      return Promise.resolve(callback(...args)) as Promise<Awaited<Ret>>;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  function scheduleTrailing(delay: number): void {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      timeout = undefined;
      const args = trailingArgs;
      const waiters = trailingWaiters;
      trailingArgs = undefined;
      trailingWaiters = [];

      if (!args) {
        return;
      }

      void invoke(args).then(
        (value) => {
          for (const waiter of waiters) waiter.resolve(value);
        },
        (error: unknown) => {
          for (const waiter of waiters) waiter.reject(error);
        },
      );
    }, delay);
  }

  return function throttled(...args: Args): Promise<Awaited<Ret>> {
    const elapsed = Date.now() - lastInvocation;
    if (timeout === undefined && elapsed >= normalizedWait) {
      return invoke(args);
    }

    trailingArgs = args;
    const promise = new Promise<Awaited<Ret>>((resolve, reject) => {
      trailingWaiters.push({ resolve, reject });
    });
    scheduleTrailing(Math.max(0, normalizedWait - elapsed));
    return promise;
  };
}
