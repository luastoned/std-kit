/**
 * Pauses the execution for the specified number of milliseconds.
 * @param ms - The number of milliseconds to sleep.
 * @returns A promise that resolves after the specified number of milliseconds.
 */
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a debounced version of the provided callback function.
 * The debounced function will delay invoking the callback until after a specified amount of time has passed since the last time it was invoked.
 *
 * @template F - The type of the original callback function.
 * @param {F} callback - The original callback function to debounce.
 * @param {number} waitFor - The amount of time (in milliseconds) to wait before invoking the debounced callback.
 * @returns {(...args: Parameters<F>) => void} - The debounced callback function.
 */
export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(callback: F, waitFor: number): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), waitFor);
  };
};

/**
 * Throttles a function and returns a promise that resolves with the result of the function.
 * The function will be called at most once within the specified time interval.
 *
 * @template F - The type of the function to throttle.
 * @param {F} callback - The function to throttle.
 * @param {number} waitFor - The time interval in milliseconds.
 * @returns {(...args: Parameters<F>) => Promise<ReturnType<F>>} - A throttled function that returns a promise.
 */
export const throttle = <F extends (...args: Parameters<F>) => ReturnType<F>>(callback: F, waitFor: number) => {
  const now = () => Date.now();
  const resetStartTime = () => {
    startTime = now();
  };

  let timeout: number | NodeJS.Timeout;
  let startTime: number = now() - waitFor;

  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise((resolve) => {
      const timeLeft = startTime + waitFor - now();
      if (timeout) {
        clearTimeout(timeout);
      }

      if (startTime + waitFor <= now()) {
        resetStartTime();
        resolve(callback(...args));
      } else {
        timeout = setTimeout(() => {
          resetStartTime();
          resolve(callback(...args));
        }, timeLeft);
      }
    });
};
