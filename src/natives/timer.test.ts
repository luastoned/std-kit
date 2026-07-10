import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import { sleep, debounce, throttle } from './timer';

describe('sleep', () => {
  it('waits for the specified time', async () => {
    const before = Date.now();
    await sleep(25);
    const after = Date.now();
    expect(after - before).toBeGreaterThanOrEqual(20);
  });
});

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the function only after the wait time', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    debounced();
    debounced();

    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('resets the timer on every call', () => {
    const fn = vi.fn();
    const debounced = debounce(fn, 100);

    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(50);
    debounced();
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls the function immediately the first time', async () => {
    const fn = vi.fn(() => 'result');
    const throttled = throttle(fn, 100);

    const p1 = throttled();
    await vi.runAllTimersAsync();
    expect(await p1).toBe('result');
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('throttles subsequent calls within wait period', async () => {
    const fn = vi.fn((x: number) => x);
    const throttled = throttle(fn, 100);

    const p1 = throttled(1);
    vi.advanceTimersByTime(50);

    const p2 = throttled(2);
    expect(fn).toHaveBeenCalledTimes(1);

    await vi.runAllTimersAsync();

    expect(await p1).toBe(1);
    expect(await p2).toBe(2);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('ignores multiple calls within the throttle window', async () => {
    const fn = vi.fn((x: number) => x);
    const throttled = throttle(fn, 100);

    const p1 = throttled(1);
    const p2 = throttled(2);
    const p3 = throttled(3);

    vi.advanceTimersByTime(50);
    expect(fn).toHaveBeenCalledTimes(1);

    await vi.runAllTimersAsync();
    await expect(p1).resolves.toBe(1);
    await expect(p2).resolves.toBe(3);
    await expect(p3).resolves.toBe(3);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('rejects every coalesced call when the trailing invocation fails', async () => {
    const error = new Error('failed');
    const throttled = throttle((value: number) => {
      if (value === 3) throw error;
      return value;
    }, 100);

    await expect(throttled(1)).resolves.toBe(1);
    const p2 = throttled(2);
    const p3 = throttled(3);
    const p2Assertion = expect(p2).rejects.toBe(error);
    const p3Assertion = expect(p3).rejects.toBe(error);
    await vi.runAllTimersAsync();

    await p2Assertion;
    await p3Assertion;
  });
});
