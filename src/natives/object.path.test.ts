import { describe, it, expect } from 'vitest';

import { getValue, setValue } from './object';

describe('getValue', () => {
  const data = {
    user: {
      name: 'Alice',
      age: 30,
      posts: [
        { title: 'First Post', likes: 10 },
        { title: 'Second Post', likes: 20 },
      ],
    },
  };

  it('retrieves a shallow property', () => {
    expect(getValue(data, 'user.name')).toBe('Alice');
  });

  it('retrieves a nested property', () => {
    expect(getValue(data, 'user.posts[1].title', 'Untitled')).toBe('Second Post');
  });

  it('returns default for missing property', () => {
    expect(getValue(data, 'user.location.city', 'Nowhere')).toBe('Nowhere');
  });

  it('returns default for out-of-bounds array index', () => {
    expect(getValue(data, 'user.posts[10].title', 'Untitled')).toBe('Untitled');
  });

  it('handles top-level fallback', () => {
    expect(getValue({}, 'nonexistent.key')).toBe(undefined);
  });

  it('returns the entire value if path is empty', () => {
    expect(getValue(data, '')).toEqual(data);
  });

  it('does not read inherited properties', () => {
    const inherited = { token: 'secret' };
    const obj = Object.create(inherited) as { token?: string };

    expect(getValue(obj, 'token', 'fallback')).toBe('fallback');
  });

  it('does not traverse forbidden path keys', () => {
    expect(getValue({}, '__proto__.toString', 'fallback')).toBe('fallback');
    expect(getValue({}, 'constructor.prototype', 'fallback')).toBe('fallback');
  });
});

describe('setValue', () => {
  it('sets a shallow property', () => {
    const obj = { name: 'Bob' };
    setValue(obj, 'name', 'Alice');
    expect(obj.name).toBe('Alice');
  });

  it('sets a nested property', () => {
    const obj = { user: { name: 'Bob' } };
    setValue(obj, 'user.name', 'Alice');
    expect(obj.user.name).toBe('Alice');
  });

  it('creates intermediate objects', () => {
    const obj: any = {};
    setValue(obj, 'user.profile.name', 'Alice');
    expect(obj.user.profile.name).toBe('Alice');
  });

  it('creates intermediate arrays for numeric indices', () => {
    const obj: any = {};
    setValue(obj, 'items[0]', 'first');
    expect(Array.isArray(obj.items)).toBe(true);
    expect(obj.items[0]).toBe('first');
  });

  it('sets array element in nested path', () => {
    const obj: any = { data: {} };
    setValue(obj, 'data.items[1].title', 'Test');
    expect(obj.data.items[1].title).toBe('Test');
  });

  it('prevents prototype pollution with __proto__', () => {
    const obj: any = {};
    setValue(obj, '__proto__.polluted', 'bad');
    expect(Object.prototype).not.toHaveProperty('polluted');
    expect({}).not.toHaveProperty('polluted');
  });

  it('prevents prototype pollution with constructor', () => {
    const obj: any = {};
    setValue(obj, 'constructor.polluted', 'bad');
    expect(obj.constructor).not.toHaveProperty('polluted');
  });

  it('prevents prototype pollution with prototype', () => {
    const obj: any = {};
    setValue(obj, 'prototype.polluted', 'bad');
    expect(obj).not.toHaveProperty('prototype');
  });

  it('overwrites existing values', () => {
    const obj = { count: 5 };
    setValue(obj, 'count', 10);
    expect(obj.count).toBe(10);
  });
});
