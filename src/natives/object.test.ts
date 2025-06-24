import { describe, it, expect } from 'vitest';
import { getValue } from './object';

describe('object getValue', () => {
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
});
