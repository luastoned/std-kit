import { afterEach, beforeEach, describe, it, expect, expectTypeOf, vi } from 'vitest';

import { threads, defer, queue } from './promise';
import { sleep } from './timer';

describe('queue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('runs queued tasks with the provided concurrency limit', async () => {
    const taskQueue = queue({ concurrency: 2 });
    let activeCount = 0;
    let maxActiveCount = 0;

    const tasks = Array.from({ length: 5 }, (_, value) =>
      taskQueue.add(async () => {
        activeCount++;
        maxActiveCount = Math.max(maxActiveCount, activeCount);
        await sleep(25);
        activeCount--;
        return value;
      }),
    );

    await vi.runAllTimersAsync();
    await expect(Promise.all(tasks)).resolves.toEqual([0, 1, 2, 3, 4]);
    expect(maxActiveCount).toBe(2);
  });

  it('spaces task starts by the configured interval', async () => {
    const taskQueue = queue({ concurrency: 3, interval: 50 });
    const starts: number[] = [];

    const results = Promise.all([
      taskQueue.add(() => {
        starts.push(Date.now());
        return 'a';
      }),
      taskQueue.add(() => {
        starts.push(Date.now());
        return 'b';
      }),
      taskQueue.add(() => {
        starts.push(Date.now());
        return 'c';
      }),
    ]);

    await vi.advanceTimersByTimeAsync(0);
    expect(starts).toEqual([0]);
    await vi.runAllTimersAsync();
    await expect(results).resolves.toEqual(['a', 'b', 'c']);
    expect(starts).toEqual([0, 50, 100]);
  });

  it('reports active and pending counts', async () => {
    const taskQueue = queue({ concurrency: 1 });
    let releaseFirstTask: (() => void) | undefined;

    const first = taskQueue.add(
      () =>
        new Promise<string>((resolve) => {
          releaseFirstTask = () => resolve('first');
        }),
    );
    const second = taskQueue.add(() => 'second');
    await Promise.resolve();

    expect(taskQueue.activeCount).toBe(1);
    expect(taskQueue.pendingCount).toBe(1);

    releaseFirstTask?.();

    await expect(Promise.all([first, second])).resolves.toEqual(['first', 'second']);
    expect(taskQueue.activeCount).toBe(0);
    expect(taskQueue.pendingCount).toBe(0);
  });

  it('rejects task failures', async () => {
    const taskQueue = queue({ concurrency: 1 });
    const error = new Error('boom');

    await expect(taskQueue.add(() => Promise.reject(error))).rejects.toBe(error);
  });

  it('rejects pending tasks when cleared', async () => {
    const taskQueue = queue({ concurrency: 1 });
    let releaseFirstTask: (() => void) | undefined;
    const reason = new Error('stop');

    const first = taskQueue.add(
      () =>
        new Promise<string>((resolve) => {
          releaseFirstTask = () => resolve('first');
        }),
    );
    const second = taskQueue.add(() => 'second');
    const secondExpectation = expect(second).rejects.toBe(reason);
    await Promise.resolve();

    taskQueue.clear(reason);
    releaseFirstTask?.();

    await expect(first).resolves.toBe('first');
    await secondExpectation;
  });

  it.each([0, -1, Number.NaN, Number.NEGATIVE_INFINITY, 1.9, 2.9, Number.POSITIVE_INFINITY])('normalizes concurrency %s', async (concurrency) => {
    const taskQueue = queue({ concurrency });
    const tasks = Array.from({ length: 3 }, () => taskQueue.add(() => sleep(10)));
    expect(taskQueue.activeCount).toBe(concurrency === Infinity ? 3 : concurrency === 2.9 ? 2 : 1);
    await vi.runAllTimersAsync();
    await Promise.all(tasks);
    expect(taskQueue.activeCount).toBe(0);
  });

  it.each([0, -1, Number.NaN, Infinity, 0.9])('disables invalid or sub-millisecond intervals %s', async (interval) => {
    const taskQueue = queue({ interval });
    await taskQueue.add(() => 1);
    await taskQueue.add(() => 2);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('releases capacity before settling failures and continues in FIFO order', async () => {
    const taskQueue = queue();
    const error = new Error('failure');
    const first = taskQueue.add(() => {
      throw error;
    });
    const second = taskQueue.add(() => 'second');
    const third = taskQueue.add(async () => 'third');
    await expect(first).rejects.toBe(error);
    await expect(second).resolves.toBe('second');
    await expect(third).resolves.toBe('third');
    expect(taskQueue.activeCount).toBe(0);
  });

  it('clears interval timers and can be reused with the remaining interval', async () => {
    const taskQueue = queue({ interval: 50 });
    await taskQueue.add(() => 1);
    const task = vi.fn(() => 2);
    const pending = taskQueue.add(task);
    const rejected = expect(pending).rejects.toThrow('Queue was cleared.');
    taskQueue.clear();
    await rejected;
    expect(taskQueue.pendingCount).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    const next = taskQueue.add(() => 3);
    await vi.runAllTimersAsync();
    await expect(next).resolves.toBe(3);
    expect(task).not.toHaveBeenCalled();
    expect(Date.now()).toBe(50);
  });

  it('chunks intervals that exceed the platform timer range', async () => {
    const taskQueue = queue({ interval: 2_147_483_648 });
    await taskQueue.add(() => 1);
    const task = vi.fn(() => 2);
    const pending = taskQueue.add(task);
    await vi.advanceTimersByTimeAsync(2_147_483_647);
    expect(task).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await expect(pending).resolves.toBe(2);
  });

  it('preserves inferred task result types', async () => {
    const taskQueue = queue();
    const number = taskQueue.add(() => 1);
    const string = taskQueue.add(async () => 'value');
    expectTypeOf(number).toEqualTypeOf<Promise<number>>();
    expectTypeOf(string).toEqualTypeOf<Promise<string>>();
    await Promise.all([number, string]);
  });
});

describe('threads', () => {
  it('runs tasks with the provided concurrency limit', async () => {
    const delayMs = 100;
    const tasks = Array.from({ length: 10 }, (_, value) =>
      defer(async (val: number) => {
        await sleep(delayMs);
        return val;
      }, value),
    );

    const start = Date.now();
    const results = await threads(2, tasks);
    const elapsed = Date.now() - start;

    expect(results).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(elapsed).toBeGreaterThanOrEqual(450);
    expect(elapsed).toBeLessThanOrEqual(550);
  });

  it('runs tasks in groups for a higher limit', async () => {
    const delayMs = 100;
    const tasks = Array.from({ length: 10 }, (_, value) =>
      defer(async (val: number) => {
        await sleep(delayMs);
        return val;
      }, value),
    );

    const start = Date.now();
    const results = await threads(5, tasks);
    const elapsed = Date.now() - start;

    expect(results).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(elapsed).toBeGreaterThanOrEqual(180);
    expect(elapsed).toBeLessThanOrEqual(260);
  });

  it('runs all tasks in parallel when limit matches task count', async () => {
    const delayMs = 100;
    const tasks = Array.from({ length: 10 }, (_, value) =>
      defer(async (val: number) => {
        await sleep(delayMs);
        return val;
      }, value),
    );

    const start = Date.now();
    const results = await threads(10, tasks);
    const elapsed = Date.now() - start;

    expect(results).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(elapsed).toBeGreaterThanOrEqual(80);
    expect(elapsed).toBeLessThanOrEqual(140);
  });

  it('preserves undefined task results', async () => {
    const tasks = [defer(() => undefined), defer(() => 'done')];

    await expect(threads(2, tasks)).resolves.toEqual([undefined, 'done']);
  });
});
