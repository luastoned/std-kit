const debounce3 = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

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

export const debouncePromise = <F extends (...args: any[]) => any>(callback: F, waitFor: number): ((...args: Parameters<F>) => Promise<ReturnType<F>>) => {
  let timeout: NodeJS.Timeout | undefined;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    clearTimeout(timeout);

    return new Promise<ReturnType<F>>((resolve) => {
      timeout = setTimeout(() => resolve(callback(...args)), waitFor);
    });
  };
};

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

export type DebounceOption<Result> = {
  immediate?: boolean;
  maxWait?: number;
  callback?: (data: Result) => void;
};

export type ThrottleOption<Result> = {
  immediate?: boolean;
  callback?: (data: Result) => void;
};

export type Func<Args extends any[], F extends (...args: Args) => any> = {
  (this: ThisParameterType<F>, ...args: Args & Parameters<F>): Promise<ReturnType<F>>;
  cancel: (reason?: any) => void;
};

export type Promises<FuncReturn> = {
  resolve: (result: FuncReturn) => void;
  reject: (reason?: any) => void;
};

export function debounce<Args extends any[], F extends (...args: Args) => any>(
  func: F,
  delay: number = 100,
  options?: DebounceOption<ReturnType<F>>,
): Func<Args, F> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const isImmediate = options?.immediate ?? false;
  const maxWait = options?.maxWait;
  const callback = options?.callback ?? false;
  let lastInvokeTime = Date.now();

  let promises: Promises<ReturnType<F>>[] = [];

  const nextInvokeDelay = () => {
    if (maxWait !== undefined) {
      const timeSinceLastInvoke = Date.now() - lastInvokeTime;
      const timeUtilNextInvoke = maxWait - timeSinceLastInvoke;

      // timeUtilNextInvoke may be less than zero
      return Math.max(timeUtilNextInvoke, 0);
    }

    return delay;
  };

  const debouncedFunction = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this;
    return new Promise<ReturnType<F>>((resolve, reject) => {
      const invokeFunction = () => {
        timeoutId = undefined;
        lastInvokeTime = Date.now();
        if (!isImmediate) {
          const result = func.apply(context, args);
          callback && callback(result);
          for (const { resolve } of promises) {
            resolve(result);
          }
          promises = [];
        }
      };

      const shouldCallNow = isImmediate && timeoutId === undefined;

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(invokeFunction, nextInvokeDelay());

      if (shouldCallNow) {
        const result = func.apply(context, args);
        callback && callback(result);
        return resolve(result);
      }
      promises.push({ resolve, reject });
    });
  };

  debouncedFunction.cancel = (reason?: any) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    for (const { reject } of promises) {
      reject(reason);
    }

    promises = [];
  };

  return debouncedFunction;
}

export function throttle<Args extends any[], F extends (...args: Args) => any>(
  func: F,
  delay: number = 100,
  options?: ThrottleOption<ReturnType<F>>,
): Func<Args, F> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const isImmediate = options?.immediate ?? false;
  const callback = options?.callback ?? false;
  // const trailing = options?.trailing ?? false;
  let lastInvokeTime = Date.now();

  let promises: Promises<ReturnType<F>>[] = [];

  const nextInvokeDelay = () => {
    const timeSinceLastInvoke = Date.now() - lastInvokeTime;
    const timeUtilNextInvoke = delay - timeSinceLastInvoke;

    // timeUtilNextInvoke may be less than zero
    return Math.max(timeUtilNextInvoke, 0);
  };

  const throttledFunction = function (this: ThisParameterType<F>, ...args: Parameters<F>) {
    const context = this;
    return new Promise<ReturnType<F>>((resolve, reject) => {
      const invokeFunction = () => {
        timeoutId = undefined;
        lastInvokeTime = Date.now();
        if (!isImmediate) {
          const result = func.apply(context, args);
          callback && callback(result);
          for (const { resolve } of promises) {
            resolve(result);
          }
          promises = [];
        }
      };

      const shouldCallNow = isImmediate && timeoutId === undefined;

      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(invokeFunction, nextInvokeDelay());

      if (shouldCallNow) {
        const result = func.apply(context, args);
        callback && callback(result);
        return resolve(result);
      }
      promises.push({ resolve, reject });
    });
  };

  throttledFunction.cancel = (reason?: any) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }

    for (const { reject } of promises) {
      reject(reason);
    }

    promises = [];
  };

  return throttledFunction;
}