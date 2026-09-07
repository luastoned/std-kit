/**
 * A deferred async task that resolves to `T` when executed.
 *
 * @template T - Resolved result type.
 */
export type DeferredTask<T> = () => Promise<T>;

/**
 * Options used to create a promise task queue.
 */
export interface QueueOptions {
  /**
   * Maximum active tasks; positive fractions are floored, Infinity is unlimited, and invalid values become 1.
   */
  readonly concurrency?: number;
  /**
   * Minimum milliseconds between starts; positive fractions are floored and invalid values become 0.
   */
  readonly interval?: number;
}

/**
 * Reusable promise task queue.
 */
export interface Queue {
  /**
   * Number of tasks reserved or running.
   */
  readonly activeCount: number;
  /**
   * Number of tasks waiting to start.
   */
  readonly pendingCount: number;
  /**
   * Enqueues a task; synchronous throws and asynchronous failures reject its promise without stopping the queue.
   */
  add<T>(task: () => T | Promise<T>): Promise<Awaited<T>>;
  /**
   * Rejects waiting tasks with the reason (an Error by default). Active tasks continue and the queue remains reusable.
   */
  clear(reason?: unknown): void;
}

/**
 * Wraps a function call so it can be executed later as a promise task.
 *
 * @example
 *   ```ts
 *   import { defer } from 'std-kit';
 *
 *   const task = defer((name: string) => `Hello ${name}`, 'Ada');
 *   await task();
 *   // 'Hello Ada'
 *   ```
 *
 * @template Args - The argument tuple type for the function.
 * @template Ret - The return type of the function.
 * @param fn - The function to wrap.
 * @param args - Arguments to apply when the task runs.
 * @returns A deferred task that resolves to the function result.
 */
export function defer<Args extends readonly unknown[], Ret>(fn: (...args: Args) => Ret | Promise<Ret>, ...args: Args): DeferredTask<Awaited<Ret>> {
  return function deferredTask(): Promise<Awaited<Ret>> {
    return Promise.resolve(fn(...args)) as Promise<Awaited<Ret>>;
  };
}

/**
 * Normalizes a parallelism value to a safe runtime limit. Preserves `Infinity`, and clamps invalid or non-positive values to `1`.
 *
 * @param parallel - Raw parallelism input.
 * @returns A normalized parallelism value.
 * @internal
 */
function normalizeParallel(parallel: number): number {
  if (parallel === Number.POSITIVE_INFINITY) {
    return parallel;
  }

  if (!Number.isFinite(parallel)) {
    return 1;
  }

  const floored = Math.floor(parallel);
  return floored > 0 ? floored : 1;
}

/**
 * Normalizes a delay interval to a non-negative integer.
 *
 * @param interval - Raw interval input.
 * @returns A normalized interval in milliseconds.
 * @internal
 */
function normalizeInterval(interval: number | undefined): number {
  if (interval === undefined || interval <= 0 || !Number.isFinite(interval)) {
    return 0;
  }

  return Math.floor(interval);
}

/**
 * Creates a reusable FIFO queue for promise-returning tasks.
 *
 * `concurrency` limits how many tasks may run at the same time. `interval` enforces a minimum delay between task starts, which is useful for simple API rate
 * limiting. The first task starts without an interval delay. Tasks run in a microtask; failures do not stop subsequent tasks.
 * Clearing rejects only waiting tasks and preserves the interval since the last start.
 *
 * @example
 *   ```ts
 *   import { queue } from 'std-kit';
 *
 *   const apiQueue = queue({ concurrency: 3, interval: 1000 });
 *
 *   const user = await apiQueue.add(() => fetch('/users/1'));
 *   ```;
 *
 * @param options - Queue options.
 * @param options.concurrency - Maximum number of tasks running at once. Invalid values default to 1.
 * @param options.interval - Minimum delay between task starts in milliseconds. Invalid values disable interval limiting.
 * @returns A reusable promise task queue.
 */
export function queue(options: Readonly<QueueOptions> = {}): Queue {
  const concurrency = normalizeParallel(options.concurrency ?? 1);
  const interval = normalizeInterval(options.interval);
  const entries: Array<{ run: () => void; reject: (reason?: unknown) => void }> = [];

  let activeCount = 0;
  let lastStartTime = Number.NEGATIVE_INFINITY;
  let timer: ReturnType<typeof setTimeout> | undefined;

  function clearTimer(): void {
    if (timer === undefined) {
      return;
    }

    clearTimeout(timer);
    timer = undefined;
  }

  function schedule(): void {
    clearTimer();

    if (entries.length === 0 || activeCount >= concurrency) {
      return;
    }

    const waitFor = interval > 0 ? Math.max(0, lastStartTime + interval - Date.now()) : 0;
    if (waitFor > 0) {
      timer = setTimeout(startNext, Math.min(waitFor, 2_147_483_647));
      return;
    }

    startNext();
  }

  function startNext(): void {
    clearTimer();

    while (entries.length > 0 && activeCount < concurrency) {
      const waitFor = interval > 0 ? Math.max(0, lastStartTime + interval - Date.now()) : 0;
      if (waitFor > 0) {
        timer = setTimeout(startNext, Math.min(waitFor, 2_147_483_647));
        return;
      }

      const entry = entries.shift();
      if (entry === undefined) {
        return;
      }

      activeCount++;
      lastStartTime = Date.now();

      entry.run();
    }
  }

  return {
    get activeCount(): number {
      return activeCount;
    },
    get pendingCount(): number {
      return entries.length;
    },
    add<T>(task: () => T | Promise<T>): Promise<Awaited<T>> {
      return new Promise<Awaited<T>>((resolve, reject) => {
        entries.push({
          run(): void {
            void Promise.resolve()
              .then(async (): Promise<Awaited<T>> => {
                lastStartTime = Date.now();
                return await task();
              })
              .then(
                (value) => {
                  activeCount--;
                  resolve(value);
                  schedule();
                },
                (error: unknown) => {
                  activeCount--;
                  reject(error);
                  schedule();
                },
              );
          },
          reject,
        });
        schedule();
      });
    },
    clear(reason: unknown = new Error('Queue was cleared.')): void {
      clearTimer();

      while (entries.length > 0) {
        const entry = entries.shift();
        entry?.reject(reason);
      }
    },
  };
}

/**
 * Runs promise-returning tasks with a concurrency limit. Resolves in input order, rejects on the first error (Promise.all semantics).
 *
 * @example
 *   ```ts
 *   import { defer, threads } from 'std-kit';
 *
 *   const tasks = [defer(async () => 1), defer(async () => 2), defer(async () => 3)];
 *
 *   await threads(2, tasks);
 *   // [1, 2, 3]
 *   ```;
 *
 * @template T - The task result type.
 * @param parallel - Maximum number of concurrent tasks. Invalid values default to 1.
 * @param tasks - Deferred tasks to execute.
 * @returns A promise resolving to results in the same order as input tasks.
 */
export async function threads<T>(parallel: number, tasks: ReadonlyArray<DeferredTask<T>>): Promise<T[]> {
  const normalizedParallel = normalizeParallel(parallel);

  if (tasks.length === 0) {
    return [];
  }

  const limit = normalizedParallel === Number.POSITIVE_INFINITY ? tasks.length : Math.min(normalizedParallel, tasks.length);
  const results: T[] = Array.from({ length: tasks.length });

  let nextIdx = 0;
  let activeCount = 0;
  let completedCount = 0;
  let aborted = false;

  return new Promise<T[]>((resolve, reject) => {
    function launchNext(): void {
      if (aborted) return;

      while (activeCount < limit && nextIdx < tasks.length) {
        const taskIdx = nextIdx++;
        const task = tasks[taskIdx];
        if (task === undefined) {
          aborted = true;
          reject(new Error(`Missing task at index ${taskIdx}.`));
          return;
        }

        activeCount++;

        Promise.resolve()
          .then(() => task())
          .then((value) => {
            if (aborted) return;
            results[taskIdx] = value;
            completedCount++;
            activeCount--;
            if (completedCount === tasks.length) {
              resolve(results);
              return;
            }
            launchNext();
          })
          .catch((error) => {
            if (aborted) return;
            aborted = true;
            reject(error);
          });
      }
    }

    launchNext();
  });
}
