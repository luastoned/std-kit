/**
 * Creates a debounced function that resolves with the callback result.
 *
 * @template T - The callback type.
 * @param callback - The callback to debounce.
 * @param delay - The delay in milliseconds.
 * @returns A debounced function returning a promise for the callback result.
 */
export function debounce2<T extends (...args: Parameters<T>) => ReturnType<T>>(callback: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    const p = new Promise<ReturnType<T> | Error>((resolve, reject) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        try {
          let output = callback(...args);
          resolve(output);
        } catch (err) {
          if (err instanceof Error) {
            reject(err);
          }
          reject(new Error(`An error has occurred:${err}`));
        }
      }, delay);
    });
    return p;
  };
}

/**
 * Creates a debounced promise-returning function.
 *
 * @template F - The callback type.
 * @param callback - The callback to debounce.
 * @param waitFor - The delay in milliseconds.
 * @returns A debounced function returning a promise for the callback result.
 */
export const debouncePromise = <F extends (...args: any[]) => any>(callback: F, waitFor: number): ((...args: Parameters<F>) => Promise<ReturnType<F>>) => {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    clearTimeout(timeout);

    return new Promise<ReturnType<F>>((resolve) => {
      timeout = setTimeout(() => resolve(callback(...args)), waitFor);
    });
  };
};

/**
 * Creates a throttled function with a cancel hook.
 *
 * @template R - The return type.
 * @template A - The argument tuple type.
 * @param fn - The function to throttle.
 * @param delay - The delay in milliseconds.
 * @returns A tuple with the throttled function and a cancel function.
 */
export const throttleB = <R, A extends any[]>(fn: (...args: A) => R, delay: number): [(...args: A) => R | undefined, () => void] => {
  let wait = false;
  let timeout: number | NodeJS.Timeout;
  let cancelled = false;

  return [
    (...args: A) => {
      if (cancelled) return undefined;
      if (wait) return undefined;

      const val = fn(...args);

      wait = true;

      timeout = setTimeout(() => {
        wait = false;
      }, delay);

      return val;
    },
    () => {
      cancelled = true;
      clearTimeout(timeout);
    },
  ];
};
