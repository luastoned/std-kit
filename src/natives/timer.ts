/**
 * Pauses the execution for the specified number of milliseconds.
 *
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified number of milliseconds.
 */
export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a debounced version of the provided callback function.
 * The debounced function will delay invoking the callback until after a specified amount of time has passed since the last time it was invoked.
 *
 * @template Args - The argument tuple type.
 * @template Ret - The callback return type.
 * @param callback - The original callback function to debounce.
 * @param waitFor - The amount of time (in milliseconds) to wait before invoking the debounced callback.
 * @returns The debounced callback function.
 */
export const debounce = <Args extends unknown[], Ret>(callback: (...args: Args) => Ret, waitFor: number): ((...args: Args) => void) => {
  let timeout: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args): void => {
    if (timeout !== undefined) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => callback(...args), waitFor);
  };
};

/**
 * Throttles a function and returns a promise that resolves with the result of the function.
 * The function will be called at most once within the specified time interval.
 *
 * @template Args - The argument tuple type.
 * @template Ret - The callback return type.
 * @param callback - The function to throttle.
 * @param waitFor - The time interval in milliseconds.
 * @returns A throttled function that returns a promise.
 */
export const throttle = <Args extends unknown[], Ret>(
  callback: (...args: Args) => Ret,
  waitFor: number,
): ((...args: Args) => Promise<Awaited<Ret>>) => {
  const now = (): number => Date.now();
  const resetStartTime = (): void => {
    startTime = now();
  };

  let timeout: ReturnType<typeof setTimeout> | undefined;
  let startTime: number = now() - waitFor;

  return (...args: Args): Promise<Awaited<Ret>> =>
    new Promise((resolve, reject) => {
      const timeLeft = startTime + waitFor - now();
      if (timeout !== undefined) {
        clearTimeout(timeout);
      }

      if (startTime + waitFor <= now()) {
        resetStartTime();
        try {
          resolve(callback(...args) as Awaited<Ret>);
        } catch (error) {
          reject(error);
        }
      } else {
        timeout = setTimeout(() => {
          resetStartTime();
          try {
            resolve(callback(...args) as Awaited<Ret>);
          } catch (error) {
            reject(error);
          }
        }, timeLeft);
      }
    });
};
