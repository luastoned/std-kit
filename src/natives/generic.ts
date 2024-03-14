export const isArray = (obj: unknown | unknown[]): boolean => typeof obj === 'object' && Array.isArray(obj);

export const isObject = (obj: unknown): boolean => typeof obj === 'object' && !Array.isArray(obj) && obj !== null;

export const cloneObject = <T>(obj: T): T => (obj !== undefined ? JSON.parse(JSON.stringify(obj)) : undefined);

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(callback: F, waitFor: number): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<F>): void => {
    clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), waitFor);
  };
};

export const debouncePromise = <F extends (...args: any[]) => any>(callback: F, waitFor: number): ((...args: Parameters<F>) => Promise<ReturnType<F>>) => {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    clearTimeout(timeout);

    return new Promise<ReturnType<F>>((resolve) => {
      timeout = setTimeout(() => resolve(callback(...args)), waitFor);
    });
  };
};

export const throttle = <F extends (...args: any[]) => any>(callback: F, waitFor: number) => {
  const now = () => Date.now();
  const resetStartTime = () => (startTime = now());
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
