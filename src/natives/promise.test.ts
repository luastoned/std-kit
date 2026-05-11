import { describe, it, expect } from 'vitest';

import { threads, defer, queue } from './promise';
import { sleep } from './timer';

describe('queue', () => {
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

    await expect(Promise.all(tasks)).resolves.toEqual([0, 1, 2, 3, 4]);
    expect(maxActiveCount).toBe(2);
  });

  it('spaces task starts by the configured interval', async () => {
    const taskQueue = queue({ concurrency: 3, interval: 50 });
    const starts: number[] = [];

    await Promise.all([
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

    expect(starts).toHaveLength(3);
    expect((starts[1] as number) - (starts[0] as number)).toBeGreaterThanOrEqual(40);
    expect((starts[2] as number) - (starts[1] as number)).toBeGreaterThanOrEqual(40);
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
