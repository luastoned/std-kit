import { describe, it, expect } from 'vitest';
import { cloneObject } from './generic';

describe('cloneObject', () => {
  it('should clone a plain object', () => {
    const obj = { a: 1, b: 2 };
    const cloned = cloneObject(obj);
    expect(cloned).toEqual(obj);
    expect(cloned).not.toBe(obj);
  });

  it('should clone nested objects', () => {
    const obj = { a: { b: 2 } };
    const cloned = cloneObject(obj);
    expect(cloned).toEqual(obj);
    expect(cloned.a).not.toBe(obj.a);
  });

  it('should return undefined for undefined input', () => {
    const cloned = cloneObject(undefined);
    expect(cloned).toBeUndefined();
  });

  it('should return null for null input', () => {
    const cloned = cloneObject(null);
    expect(cloned).toBeNull();
  });
  1;
});
