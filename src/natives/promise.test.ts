import { describe, it, expect } from 'vitest';
import { threads, defer } from './promise';
import { sleep } from './timer';

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
});
