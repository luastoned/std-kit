import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { threads, defer } from './promise';
import { sleep } from './timer';

describe('threads', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it.each([2, 5, 10])('never exceeds a concurrency limit of %i', async (limit) => {
    let activeTasks = 0;
    let maxActiveTasks = 0;
    const tasks = Array.from({ length: 10 }, (_, value) =>
      defer(async (val: number) => {
        activeTasks++;
        maxActiveTasks = Math.max(maxActiveTasks, activeTasks);
        await sleep(100);
        activeTasks--;
        return val;
      }, value),
    );

    const resultsPromise = threads(limit, tasks);
    await vi.runAllTimersAsync();

    await expect(resultsPromise).resolves.toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(maxActiveTasks).toBe(limit);
    expect(activeTasks).toBe(0);
  });

  it.each([
    { parallel: 0, expectedLimit: 1 },
    { parallel: -2, expectedLimit: 1 },
    { parallel: Number.NaN, expectedLimit: 1 },
    { parallel: 2.9, expectedLimit: 2 },
    { parallel: Number.POSITIVE_INFINITY, expectedLimit: 3 },
  ])('normalizes $parallel to a concurrency limit of $expectedLimit', async ({ parallel, expectedLimit }) => {
    let activeTasks = 0;
    let maxActiveTasks = 0;
    const tasks = Array.from({ length: 3 }, (_, value) =>
      defer(async () => {
        activeTasks++;
        maxActiveTasks = Math.max(maxActiveTasks, activeTasks);
        await sleep(100);
        activeTasks--;
        return value;
      }),
    );

    const resultsPromise = threads(parallel, tasks);
    await vi.runAllTimersAsync();

    await expect(resultsPromise).resolves.toEqual([0, 1, 2]);
    expect(maxActiveTasks).toBe(expectedLimit);
  });

  it('resolves an empty task list', async () => {
    await expect(threads(2, [])).resolves.toEqual([]);
  });

  it('rejects on task failure without launching queued tasks', async () => {
    const error = new Error('failed');
    const started: number[] = [];
    const tasks = [
      defer(async () => {
        started.push(0);
        await sleep(100);
        return 0;
      }),
      defer(() => {
        started.push(1);
        throw error;
      }),
      defer(() => {
        started.push(2);
        return 2;
      }),
    ];

    await expect(threads(2, tasks)).rejects.toBe(error);
    expect(started).toEqual([0, 1]);

    await vi.runAllTimersAsync();
    expect(started).toEqual([0, 1]);
  });

  it('preserves undefined task results', async () => {
    const tasks = [defer(() => undefined), defer(() => 'done')];

    await expect(threads(2, tasks)).resolves.toEqual([undefined, 'done']);
  });
});

describe('defer', () => {
  it('turns synchronous throws into promise rejections', async () => {
    const task = defer(() => {
      throw new Error('boom');
    });

    const promise = task();
    await expect(promise).rejects.toThrow('boom');
  });
});
