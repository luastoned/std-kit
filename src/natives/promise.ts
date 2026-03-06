/**
 * A deferred async task that resolves to `T` when executed.
 *
 * @template T - Resolved result type.
 */
export type DeferredTask<T> = () => Promise<T>;

/**
 * Wraps a function call so it can be executed later as a promise task.
 *
 * @template Args - The argument tuple type for the function.
 * @template Ret - The return type of the function.
 * @param fn - The function to wrap.
 * @param args - Arguments to apply when the task runs.
 * @returns A deferred task that resolves to the function result.
 */
export const defer = <Args extends readonly unknown[], Ret>(fn: (...args: Args) => Ret | Promise<Ret>, ...args: Args): DeferredTask<Awaited<Ret>> => {
  return () => Promise.resolve(fn(...args)) as Promise<Awaited<Ret>>;
};

/**
 * Normalizes a parallelism value to a safe runtime limit.
 * Preserves `Infinity`, and clamps invalid or non-positive values to `1`.
 *
 * @internal
 * @param parallel - Raw parallelism input.
 * @returns A normalized parallelism value.
 */
const normalizeParallel = (parallel: number): number => {
  if (parallel === Number.POSITIVE_INFINITY) {
    return parallel;
  }

  if (!Number.isFinite(parallel)) {
    return 1;
  }

  const floored = Math.floor(parallel);
  return floored > 0 ? floored : 1;
};

/**
 * Runs promise-returning tasks with a concurrency limit.
 * Resolves in input order, rejects on the first error (Promise.all semantics).
 *
 * @template T - The task result type.
 * @param parallel - Maximum number of concurrent tasks. Invalid values default to 1.
 * @param tasks - Deferred tasks to execute.
 * @returns A promise resolving to results in the same order as input tasks.
 */
export const threads = async <T>(parallel: number, tasks: ReadonlyArray<DeferredTask<T>>): Promise<T[]> => {
  const normalizedParallel = normalizeParallel(parallel);

  if (tasks.length === 0) {
    return [];
  }

  const limit = normalizedParallel === Number.POSITIVE_INFINITY ? tasks.length : Math.min(normalizedParallel, tasks.length);
  const results: T[] = new Array(tasks.length);

  let nextIdx = 0;
  let activeCount = 0;
  let completedCount = 0;
  let aborted = false;

  return new Promise<T[]>((resolve, reject) => {
    const launchNext = () => {
      if (aborted) return;

      while (activeCount < limit && nextIdx < tasks.length) {
        const taskIdx = nextIdx++;
        const task = tasks[taskIdx];
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
    };

    launchNext();
  });
};
