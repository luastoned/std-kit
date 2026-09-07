import { describe, expect, it } from 'vitest';

import { omit, pick } from './object';

describe('pick', () => {
  it('should pick specified keys from object', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    expect(pick(obj, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('should handle empty keys array', () => {
    const obj = { a: 1, b: 2 };
    expect(pick(obj, [])).toEqual({});
  });

  it('should handle keys that do not exist', () => {
    const obj = { a: 1, b: 2 };
    expect(pick(obj, ['a', 'c' as keyof typeof obj])).toEqual({ a: 1 });
  });

  it('should preserve value types', () => {
    const obj = { name: 'Alice', age: 30, active: true };
    const result = pick(obj, ['name', 'age']);
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  it('should work with nested objects', () => {
    const obj = { user: { name: 'Bob' }, settings: { theme: 'dark' }, count: 5 };
    expect(pick(obj, ['user', 'count'])).toEqual({ user: { name: 'Bob' }, count: 5 });
  });

  it('should ignore inherited properties', () => {
    const obj = Object.assign(Object.create({ inherited: 1 }) as { inherited: number; own: number }, { own: 2 });

    expect(pick(obj, ['inherited', 'own'])).toEqual({ own: 2 });
  });
});

describe('omit', () => {
  it('should omit specified keys from object', () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    expect(omit(obj, ['b', 'd'])).toEqual({ a: 1, c: 3 });
  });

  it('should handle empty keys array', () => {
    const obj = { a: 1, b: 2 };
    expect(omit(obj, [])).toEqual({ a: 1, b: 2 });
  });

  it('should handle keys that do not exist', () => {
    const obj = { a: 1, b: 2 };
    expect(omit(obj, ['c' as keyof typeof obj])).toEqual({ a: 1, b: 2 });
  });

  it('should preserve value types', () => {
    const obj = { name: 'Alice', age: 30, active: true };
    const result = omit(obj, ['active']);
    expect(result).toEqual({ name: 'Alice', age: 30 });
  });

  it('should work with nested objects', () => {
    const obj = { user: { name: 'Bob' }, settings: { theme: 'dark' }, count: 5 };
    expect(omit(obj, ['settings'])).toEqual({ user: { name: 'Bob' }, count: 5 });
  });
});
