import { describe, it, expect, vi } from 'vitest';
import { once, memoize } from './function';

describe('once', () => {
  it('should execute function only once', () => {
    let counter = 0;
    const fn = once(() => ++counter);

    expect(fn()).toBe(1);
    expect(fn()).toBe(1);
    expect(fn()).toBe(1);
    expect(counter).toBe(1);
  });

  it('should return the same result on subsequent calls', () => {
    const fn = once(() => ({ value: Math.random() }));
    const first = fn();
    const second = fn();

    expect(first).toBe(second);
  });

  it('should work with functions that take arguments', () => {
    const fn = once((a: number, b: number) => a + b);

    expect(fn(2, 3)).toBe(5);
    expect(fn(10, 20)).toBe(5); // Still returns first result
  });

  it('should work with functions that return undefined', () => {
    let called = false;
    const fn = once(() => {
      called = true;
      return undefined;
    });

    expect(fn()).toBeUndefined();
    expect(fn()).toBeUndefined();
    expect(called).toBe(true);
  });
});

describe('memoize', () => {
  it('should cache function results', () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should cache different arguments separately', () => {
    const fn = vi.fn((x: number) => x * 2);
    const memoized = memoize(fn);

    expect(memoized(5)).toBe(10);
    expect(memoized(10)).toBe(20);
    expect(memoized(5)).toBe(10);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should work with multiple arguments', () => {
    const fn = vi.fn((a: number, b: number) => a + b);
    const memoized = memoize(fn);

    expect(memoized(2, 3)).toBe(5);
    expect(memoized(2, 3)).toBe(5);
    expect(memoized(3, 2)).toBe(5);
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should work with custom key function', () => {
    const fn = vi.fn((obj: { id: number; name: string }) => obj.name.toUpperCase());
    const memoized = memoize(fn, {
      keyFn: (obj) => String(obj.id),
    });

    expect(memoized({ id: 1, name: 'alice' })).toBe('ALICE');
    expect(memoized({ id: 1, name: 'bob' })).toBe('ALICE'); // Same id, uses cache
    expect(memoized({ id: 2, name: 'bob' })).toBe('BOB'); // Different id
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should handle complex objects', () => {
    const fn = vi.fn((obj: { data: number[] }) => obj.data.reduce((sum, n) => sum + n, 0));
    const memoized = memoize(fn);

    expect(memoized({ data: [1, 2, 3] })).toBe(6);
    expect(memoized({ data: [1, 2, 3] })).toBe(6);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should cache undefined results', () => {
    const fn = vi.fn(() => undefined);
    const memoized = memoize(fn);

    expect(memoized()).toBeUndefined();
    expect(memoized()).toBeUndefined();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should cache null results', () => {
    const fn = vi.fn(() => null);
    const memoized = memoize(fn);

    expect(memoized()).toBeNull();
    expect(memoized()).toBeNull();
    expect(fn).toHaveBeenCalledTimes(1);
  });
});
