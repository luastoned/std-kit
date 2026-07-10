import { describe, it, expect } from 'vitest';

import { cloneObject, isContainer, isMutableContainer, isPlainObject } from './generic';

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
});

describe('container guards', () => {
  it('isContainer returns true for arrays and objects', () => {
    expect(isContainer([1, 2, 3])).toBe(true);
    expect(isContainer({ a: 1 })).toBe(true);
  });

  it('isContainer returns false for primitives and null', () => {
    expect(isContainer('hello')).toBe(false);
    expect(isContainer(123)).toBe(false);
    expect(isContainer(null)).toBe(false);
  });

  it('isMutableContainer returns true for mutable arrays and objects', () => {
    expect(isMutableContainer([1, 2, 3])).toBe(true);
    expect(isMutableContainer({ a: 1 })).toBe(true);
  });

  it('isMutableContainer returns false for primitives and null', () => {
    expect(isMutableContainer('hello')).toBe(false);
    expect(isMutableContainer(123)).toBe(false);
    expect(isMutableContainer(null)).toBe(false);
  });
});

describe('isPlainObject', () => {
  it('recognizes objects with reserved own keys and null prototypes', () => {
    expect(isPlainObject(JSON.parse('{"constructor":{}}'))).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it('rejects class instances and built-in objects', () => {
    class Example {}

    expect(isPlainObject(new Example())).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new Map())).toBe(false);
  });
});
