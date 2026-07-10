import { describe, expect, it } from 'vitest';

import { mergeObject } from './object';

describe('mergeObject', () => {
  it('merges two simple objects', () => {
    const source = { a: 1, b: 2 };
    const patch = { b: 3, c: 4 };
    const result = mergeObject(source, patch);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
    expect(source).toEqual({ a: 1, b: 2 }); // source unchanged (immutable)
  });

  it('merges nested objects', () => {
    const source = { user: { name: 'Alice', age: 30 } };
    const patch = { user: { age: 31, city: 'NYC' } };
    const result = mergeObject(source, patch);

    expect(result).toEqual({ user: { name: 'Alice', age: 31, city: 'NYC' } });
  });

  it('replaces arrays instead of merging', () => {
    const source = { items: [1, 2, 3] };
    const patch = { items: [4, 5] };
    const result = mergeObject(source, patch);

    expect(result.items).toEqual([4, 5]);
  });

  it('adds new keys from patch', () => {
    const source = { a: 1 };
    const patch = { b: 2, c: 3 };
    const result = mergeObject(source, patch);

    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });

  it('handles deeply nested objects', () => {
    const source = { a: { b: { c: 1 } } };
    const patch = { a: { b: { d: 2 } } };
    const result = mergeObject(source, patch);

    expect(result).toEqual({ a: { b: { c: 1, d: 2 } } });
  });

  it('mutates source when immutable is false', () => {
    const source = { a: 1 };
    const patch = { b: 2 };
    const result = mergeObject(source, patch, { immutable: false });

    expect(result).toBe(source); // same reference
    expect(source).toEqual({ a: 1, b: 2 });
  });

  it('does not overwrite with undefined by default', () => {
    const source = { a: 1, b: 2 };
    const patch = { b: undefined, c: 3 };
    const result = mergeObject(source, patch);

    expect(result).toEqual({ a: 1, b: 2, c: 3 }); // b stays as 2
  });

  it('overwrites with undefined when applyUndefined is true', () => {
    const source = { a: 1, b: 2 };
    const patch = { b: undefined, c: 3 };
    const result = mergeObject(source, patch, { applyUndefined: true });

    expect(result).toEqual({ a: 1, b: undefined, c: 3 });
  });

  it('initializes nested object if source value is not an object', () => {
    const source = { a: 'string' };
    const patch = { a: { b: 1 } };
    const result = mergeObject(source, patch);

    expect(result).toEqual({ a: { b: 1 } });
  });

  it('handles null values', () => {
    const source = { a: null };
    const patch = { a: { b: 1 } };
    const result = mergeObject(source, patch);

    expect(result).toEqual({ a: { b: 1 } });
  });

  it('preserves unpatched nested properties', () => {
    const source = { user: { name: 'Alice', age: 30, active: true } };
    const patch = { user: { age: 31 } };
    const result = mergeObject(source, patch);

    expect(result.user).toEqual({ name: 'Alice', age: 31, active: true });
  });

  it('merges nested objects with completely different keys', () => {
    const source = {
      nested: {
        a: 1,
        b: 2,
        c: 3,
      },
    };
    const patch = {
      nested: {
        x: 7,
        y: 8,
        z: 9,
      },
    };
    const result = mergeObject(source, patch);

    expect(result).toEqual({
      nested: {
        a: 1,
        b: 2,
        c: 3,
        x: 7,
        y: 8,
        z: 9,
      },
    });
  });

  it('merges arrays of objects index-by-index with mergeArrays', () => {
    const source = {
      items: [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
        { id: 3, name: 'Charlie', age: 35 },
      ],
    };
    const patch = {
      items: [
        { age: 31 }, // Update Alice's age
        { name: 'Bobby' }, // Update Bob's name
      ],
    };
    const result = mergeObject(source, patch);

    expect(result.items).toEqual([
      { id: 1, name: 'Alice', age: 31 }, // Merged
      { id: 2, name: 'Bobby', age: 25 }, // Merged
      { id: 3, name: 'Charlie', age: 35 }, // Preserved from source
    ]);
  });

  it('replaces primitive arrays entirely with mergeArrays', () => {
    const source = { tags: ['a', 'b', 'c', 'd'] };
    const patch = { tags: ['x', 'y'] };
    const result = mergeObject(source, patch);

    expect(result.tags).toEqual(['x', 'y']); // Replaced, not merged
  });

  it('replaces arrays when mergeArrays is false', () => {
    const source = {
      items: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
    };
    const patch = {
      items: [{ id: 3, name: 'Charlie' }],
    };
    const result = mergeObject(source, patch, { mergeArrays: false });

    expect(result.items).toEqual([{ id: 3, name: 'Charlie' }]); // Replaced entirely
  });

  it('handles patch array longer than source array', () => {
    const source = {
      items: [{ id: 1, name: 'Alice' }],
    };
    const patch = {
      items: [{ age: 30 }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }],
    };
    const result = mergeObject(source, patch);

    expect(result.items).toEqual([
      { id: 1, name: 'Alice', age: 30 }, // Merged
      { id: 2, name: 'Bob' }, // Added
      { id: 3, name: 'Charlie' }, // Added
    ]);
  });

  it('handles source array longer than patch array', () => {
    const source = {
      items: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' },
      ],
    };
    const patch = {
      items: [{ age: 30 }],
    };
    const result = mergeObject(source, patch);

    expect(result.items).toEqual([
      { id: 1, name: 'Alice', age: 30 }, // Merged
      { id: 2, name: 'Bob' }, // Preserved
      { id: 3, name: 'Charlie' }, // Preserved
    ]);
  });

  it('handles mixed object and primitive items in arrays', () => {
    const source = {
      items: [{ id: 1 }, 'text', { id: 2 }],
    };
    const patch = {
      items: [{ name: 'Alice' }, 'updated', { name: 'Bob' }],
    };
    const result = mergeObject(source, patch);

    expect(result.items).toEqual([
      { id: 1, name: 'Alice' }, // Object merged
      'updated', // Primitive replaced
      { id: 2, name: 'Bob' }, // Object merged
    ]);
  });

  it('handles empty arrays in patch', () => {
    const source = { items: [{ id: 1 }, { id: 2 }] };
    const patch = { items: [] };
    const result = mergeObject(source, patch);

    expect(result.items).toEqual([]); // Replaced with empty array
  });

  it('merges deeply nested arrays of objects', () => {
    const source = {
      data: {
        users: [
          { id: 1, profile: { name: 'Alice', city: 'NYC' } },
          { id: 2, profile: { name: 'Bob', city: 'LA' } },
        ],
      },
    };
    const patch = {
      data: {
        users: [{ profile: { city: 'SF' } }, { profile: { age: 30 } }],
      },
    };
    const result = mergeObject(source, patch);

    expect(result.data.users).toEqual([
      { id: 1, profile: { name: 'Alice', city: 'SF' } }, // Deep merge
      { id: 2, profile: { name: 'Bob', city: 'LA', age: 30 } }, // Deep merge
    ]);
  });

  it('merges arrays by key field (string)', () => {
    const source = {
      users: [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 25 },
        { id: 3, name: 'Charlie', age: 35 },
      ],
    };
    const patch = {
      users: [
        { id: 2, age: 26 }, // Update Bob
        { id: 1, active: true }, // Update Alice
        { id: 4, name: 'Diana', age: 28 }, // Add new user
      ],
    };
    const result = mergeObject(source, patch, { mergeArrays: 'id' });

    expect(result.users).toEqual([
      { id: 2, name: 'Bob', age: 26 }, // Merged
      { id: 1, name: 'Alice', age: 30, active: true }, // Merged
      { id: 4, name: 'Diana', age: 28 }, // Added
      { id: 3, name: 'Charlie', age: 35 }, // Preserved from source
    ]);
  });

  it('merges arrays by key extractor function', () => {
    const source = {
      items: [
        { uid: 'a1', value: 10 },
        { uid: 'b2', value: 20 },
        { uid: 'c3', value: 30 },
      ],
    };
    const patch = {
      items: [
        { uid: 'b2', value: 25 }, // Update
        { uid: 'd4', value: 40 }, // Add
      ],
    };
    const result = mergeObject(source, patch, {
      mergeArrays: (item: any) => item.uid,
    });

    expect(result.items).toEqual([
      { uid: 'b2', value: 25 }, // Merged
      { uid: 'd4', value: 40 }, // Added
      { uid: 'a1', value: 10 }, // Preserved
      { uid: 'c3', value: 30 }, // Preserved
    ]);
  });

  it('handles arrays with no matching keys when using key-based merge', () => {
    const source = {
      items: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
    };
    const patch = {
      items: [
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'Diana' },
      ],
    };
    const result = mergeObject(source, patch, { mergeArrays: 'id' });

    expect(result.items).toEqual([
      { id: 3, name: 'Charlie' }, // From patch
      { id: 4, name: 'Diana' }, // From patch
      { id: 1, name: 'Alice' }, // From source
      { id: 2, name: 'Bob' }, // From source
    ]);
  });

  it('handles objects without key field in key-based merge', () => {
    const source = {
      items: [
        { id: 1, name: 'Alice' },
        { name: 'NoId' }, // No id field
      ],
    };
    const patch = {
      items: [
        { id: 1, age: 30 },
        { id: 2, name: 'Bob' },
      ],
    };
    const result = mergeObject(source, patch, { mergeArrays: 'id' });

    expect(result.items).toEqual([
      { id: 1, name: 'Alice', age: 30 }, // Merged by id
      { id: 2, name: 'Bob' }, // Added
      { name: 'NoId' }, // Preserved (no id to match)
    ]);
  });

  it('deeply merges nested objects in key-based array merge', () => {
    const source = {
      users: [
        { id: 1, profile: { name: 'Alice', settings: { theme: 'dark' } } },
        { id: 2, profile: { name: 'Bob' } },
      ],
    };
    const patch = {
      users: [
        { id: 1, profile: { settings: { notifications: true } } },
        { id: 2, profile: { age: 25 } },
      ],
    };
    const result = mergeObject(source, patch, { mergeArrays: 'id' });

    expect(result.users).toEqual([
      { id: 1, profile: { name: 'Alice', settings: { theme: 'dark', notifications: true } } },
      { id: 2, profile: { name: 'Bob', age: 25 } },
    ]);
  });

  it('key extractor function receives both item and index', () => {
    const source = {
      items: [
        { name: 'Alice', value: 10 },
        { name: 'Bob', value: 20 },
      ],
    };
    const patch = {
      items: [
        { name: 'Alice Updated', value: 15 }, // Should match index 0
        { name: 'Charlie', value: 30 }, // New item at index 1
      ],
    };
    // Merge by index since items don't have an id field
    const result = mergeObject(source, patch, {
      mergeArrays: (item: any, idx: number) => idx,
    });

    expect(result.items).toEqual([
      { name: 'Alice Updated', value: 15 }, // Merged by index
      { name: 'Charlie', value: 30 }, // Merged by index
    ]);
  });

  describe('strict mode', () => {
    it('does not add new keys from patch in strict mode', () => {
      const source = { a: 1, b: 2 };
      const patch = { b: 3, c: 4, d: 5 };
      const result = mergeObject(source, patch, { strict: true });

      expect(result).toEqual({ a: 1, b: 3 }); // c and d not added
    });

    it('merges existing nested objects but does not add new keys', () => {
      const source = { user: { name: 'Alice', age: 30 } };
      const patch = { user: { age: 31, city: 'NYC' }, extra: 'ignored' };
      const result = mergeObject(source, patch, { strict: true });

      expect(result).toEqual({ user: { name: 'Alice', age: 31 } });
      // city not added to nested object, extra key not added to root
    });

    it('does not add non-matching array items in key-based merge (strict mode)', () => {
      const source = {
        users: [
          { id: 1, name: 'Alice', age: 30 },
          { id: 2, name: 'Bob', age: 25 },
        ],
      };
      const patch = {
        users: [
          { id: 2, age: 26 }, // Matches id 2
          { id: 3, name: 'Charlie', age: 35 }, // No match, should be ignored
          { id: 4, name: 'Diana', age: 28 }, // No match, should be ignored
        ],
      };
      const result = mergeObject(source, patch, { mergeArrays: 'id', strict: true });

      expect(result.users).toEqual([
        { id: 2, name: 'Bob', age: 26 }, // Merged
        { id: 1, name: 'Alice', age: 30 }, // Preserved
        // id 3 and 4 not added
      ]);
    });

    it('does not add objects at new indices in index-based merge (strict mode)', () => {
      const source = {
        items: [{ id: 1, name: 'Alice' }, 'text1'],
      };
      const patch = {
        items: [
          { id: 1, name: 'Updated Alice' },
          'text2',
          { id: 2, name: 'New Object' }, // At index 2 (doesn't exist in source)
          'text3', // At index 3 (doesn't exist in source)
        ],
      };
      const result = mergeObject(source, patch, { strict: true });

      expect(result.items).toEqual([
        { id: 1, name: 'Updated Alice' }, // Merged
        'text2', // Replaced primitive
        'text3', // Primitive added (allowed)
        // Object at index 2 not added in strict mode
      ]);
    });

    it('merges deeply nested objects respecting strict mode at all levels', () => {
      const source = {
        level1: {
          level2: {
            existing: 'value',
          },
        },
      };
      const patch = {
        level1: {
          level2: {
            existing: 'updated',
            newKey: 'ignored',
          },
          newLevel2Key: 'ignored',
        },
        newLevel1Key: 'ignored',
      };
      const result = mergeObject(source, patch, { strict: true });

      expect(result).toEqual({
        level1: {
          level2: {
            existing: 'updated',
            // newKey not added
          },
          // newLevel2Key not added
        },
        // newLevel1Key not added
      });
    });

    it('allows primitives at new array indices but not objects in strict mode', () => {
      const source = {
        items: [{ value: 1 }],
      };
      const patch = {
        items: [{ value: 10 }, { value: 20 }, 'string', 42, true],
      };
      const result = mergeObject(source, patch, { strict: true });

      expect(result.items).toEqual([
        { value: 10 }, // Merged at index 0
        'string', // Primitive at index 1
        42, // Primitive at index 2
        true, // Primitive at index 3
        // { value: 20 } at index 1 not added (object at non-existent index)
      ]);
    });

    it('strict mode with key extractor function', () => {
      const source = {
        items: [
          { uid: 'a1', value: 10 },
          { uid: 'b2', value: 20 },
        ],
      };
      const patch = {
        items: [
          { uid: 'b2', value: 25 }, // Update existing
          { uid: 'c3', value: 30 }, // New item, should be ignored
        ],
      };
      const result = mergeObject(source, patch, {
        mergeArrays: (item: any) => item.uid,
        strict: true,
      });

      expect(result.items).toEqual([
        { uid: 'b2', value: 25 }, // Merged
        { uid: 'a1', value: 10 }, // Preserved
        // c3 not added
      ]);
    });

    it('strict mode works with immutable false', () => {
      const source = { a: 1, b: 2 };
      const patch = { b: 3, c: 4 };
      const result = mergeObject(source, patch, { strict: true, immutable: false });

      expect(result).toBe(source); // Same reference
      expect(source).toEqual({ a: 1, b: 3 }); // c not added
    });

    it('strict mode with applyUndefined', () => {
      const source = { a: 1, b: 2, c: 3 };
      const patch = { b: undefined, c: 30, d: undefined };
      const result = mergeObject(source, patch, { strict: true, applyUndefined: true });

      expect(result).toEqual({ a: 1, b: undefined, c: 30 });
      // d not added (strict mode), b set to undefined (applyUndefined)
    });

    it('strict mode preserves source items without matching keys', () => {
      const source = {
        items: [
          { id: 1, name: 'Alice' },
          { name: 'NoId' }, // No id field
          { id: 2, name: 'Bob' },
        ],
      };
      const patch = {
        items: [
          { id: 1, age: 30 },
          { id: 3, name: 'Charlie' },
        ],
      };
      const result = mergeObject(source, patch, { mergeArrays: 'id', strict: true });

      expect(result.items).toEqual([
        { id: 1, name: 'Alice', age: 30 }, // Merged
        { id: 2, name: 'Bob' }, // Preserved
        { name: 'NoId' }, // Preserved (no id to match)
        // id 3 not added (strict mode)
      ]);
    });

    it('non-strict mode still adds new keys (default behavior)', () => {
      const source = { a: 1 };
      const patch = { b: 2, c: 3 };
      const result = mergeObject(source, patch, { strict: false });

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('strict mode with empty source object', () => {
      const source = {};
      const patch = { a: 1, b: 2 };
      const result = mergeObject(source, patch, { strict: true });

      expect(result).toEqual({}); // Nothing added
    });

    it('strict mode with empty patch object', () => {
      const source = { a: 1, b: 2 };
      const patch = {};
      const result = mergeObject(source, patch, { strict: true });

      expect(result).toEqual({ a: 1, b: 2 }); // Source unchanged
    });
  });
});
