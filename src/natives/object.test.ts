import { describe, it, expect } from 'vitest';
import { getValue, setValue, queryObject, filterObject, mapObject, mergeObject, pick, omit } from './object';

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

describe('findInTree', () => {
  const data = {
    users: [
      { id: 1, name: 'Alice', active: true },
      { id: 2, name: 'Bob', active: false },
    ],
    config: {
      enabled: true,
      settings: {
        theme: 'dark',
      },
    },
  };

  it('filters objects by condition without paths', () => {
    const result = queryObject(data, (key, value: any) => value?.active === true);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({ id: 1, name: 'Alice', active: true });
  });

  it('filters objects by condition with paths', () => {
    const result = queryObject(data, (key, value: any) => value?.active === true, true);
    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      path: 'users[0]',
      value: { id: 1, name: 'Alice', active: true },
    });
  });

  it('generates correct paths for nested objects', () => {
    const result = queryObject(data, (key, value: any) => value === 'dark', true);
    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('config.settings.theme');
  });

  it('generates correct paths for array elements', () => {
    const result = queryObject(data, (key, value: any) => typeof value?.id === 'number', true);
    expect(result).toHaveLength(2);
    expect(result[0].path).toBe('users[0]');
    expect(result[1].path).toBe('users[1]');
  });

  it('returns empty array when no matches', () => {
    const result = queryObject(data, () => false);
    expect(result).toEqual([]);
  });

  it('handles empty objects', () => {
    const result = queryObject({}, (key, value: any) => value?.id === 1);
    expect(result).toEqual([]);
  });

  it('filters by type', () => {
    const result = queryObject(data, (key, value: any) => typeof value === 'boolean');
    expect(result).toHaveLength(3); // active: true, active: false, enabled: true
  });

  it('receives key, path, and parent parameters', () => {
    const data = {
      users: [
        { id: 1, name: 'Alice', role: 'admin' },
        { id: 2, name: 'Bob', role: 'user' },
      ],
    };

    const paths: string[] = [];
    const keys: string[] = [];
    const hasParent: boolean[] = [];

    queryObject(data, (key, value, path, parent) => {
      if (typeof value === 'string' && key === 'name') {
        paths.push(path);
        keys.push(key);
        hasParent.push(parent !== null && parent !== undefined);
      }
      return false;
    });

    expect(keys).toEqual(['name', 'name']);
    expect(paths).toEqual(['users[0].name', 'users[1].name']);
    expect(hasParent).toEqual([true, true]);
  });

  it('can filter based on parent properties', () => {
    const data = {
      items: [
        { type: 'admin', name: 'Alice' },
        { type: 'user', name: 'Bob' },
        { type: 'admin', name: 'Charlie' },
      ],
    };

    // Find all names where parent type is 'admin'
    const result = queryObject(data, (key, value, path, parent: any) => {
      return key === 'name' && parent?.type === 'admin';
    });

    expect(result).toEqual(['Alice', 'Charlie']);
  });

  it('handles cyclic object graphs without infinite recursion', () => {
    type CyclicNode = { id: number; self?: CyclicNode; items?: CyclicNode[] };
    const root: CyclicNode = { id: 1 };
    root.self = root;
    root.items = [root];

    const result = queryObject(root, (key) => key === 'id');
    expect(result).toEqual([1]);
  });
});

describe('mapObject', () => {
  it('transforms all primitive values', () => {
    const data = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4,
      },
    };

    const result = mapObject(data, (key, value) => (typeof value === 'number' ? value * 2 : value));

    expect(result).toEqual({
      a: 2,
      b: 4,
      c: {
        d: 6,
        e: 8,
      },
    });
  });

  it('transforms strings to uppercase', () => {
    const data = {
      name: 'alice',
      settings: {
        theme: 'dark',
        lang: 'en',
      },
    };

    const result = mapObject(data, (key, value) => (typeof value === 'string' ? value.toUpperCase() : value));

    expect(result).toEqual({
      name: 'ALICE',
      settings: {
        theme: 'DARK',
        lang: 'EN',
      },
    });
  });

  it('provides correct path to mapper', () => {
    const data = {
      user: {
        name: 'Bob',
        settings: {
          theme: 'light',
        },
      },
    };

    const paths: string[] = [];
    mapObject(data, (key, value, path) => {
      if (typeof value === 'string') {
        paths.push(path);
      }
      return value;
    });

    expect(paths).toEqual(['user.name', 'user.settings.theme']);
  });

  it('handles arrays correctly', () => {
    const data = {
      numbers: [1, 2, 3],
      nested: {
        items: [10, 20],
      },
    };

    const result = mapObject(data, (key, value) => (typeof value === 'number' ? value + 1 : value));

    expect(result).toEqual({
      numbers: [2, 3, 4],
      nested: {
        items: [11, 21],
      },
    });
  });

  it('provides array indices in path', () => {
    const data = {
      items: [{ name: 'a' }, { name: 'b' }],
    };

    const paths: string[] = [];
    mapObject(data, (key, value, path) => {
      if (typeof value === 'string') {
        paths.push(path);
      }
      return value;
    });

    expect(paths).toEqual(['items[0].name', 'items[1].name']);
  });

  it('can transform based on key name', () => {
    const data = {
      price: 100,
      cost: 50,
      name: 'Product',
    };

    const result = mapObject(data, (key, value) => {
      if ((key === 'price' || key === 'cost') && typeof value === 'number') {
        return value + 10; // Add 10
      }
      return value;
    });

    expect(result).toEqual({
      price: 110,
      cost: 60,
      name: 'Product',
    });
  });

  it('preserves structure with mixed types', () => {
    const data = {
      string: 'hello',
      number: 42,
      boolean: true,
      null: null,
      array: [1, 2],
      object: { nested: 'value' },
    };

    const result = mapObject(data, (key, value) => value);

    expect(result).toEqual(data);
  });

  it('handles empty objects and arrays', () => {
    const data = {
      empty: {},
      emptyArray: [],
      nested: {
        alsoEmpty: {},
      },
    };

    const result = mapObject(data, (key, value) => value);

    expect(result).toEqual(data);
  });

  it('can convert types', () => {
    const data = {
      timestamp: '2024-01-01',
      count: '42',
    };

    const result = mapObject(data, (key, value) => {
      if (key === 'timestamp' && typeof value === 'string') {
        return new Date(value).getFullYear();
      }
      if (key === 'count' && typeof value === 'string') {
        return Number.parseInt(value, 10);
      }
      return value;
    });

    expect(result).toEqual({
      timestamp: 2024,
      count: 42,
    });
  });

  it('handles deeply nested structures', () => {
    const data = {
      level1: {
        level2: {
          level3: {
            level4: {
              value: 1,
            },
          },
        },
      },
    };

    const result = mapObject(data, (key, value) => (typeof value === 'number' ? value * 10 : value));

    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            level4: {
              value: 10,
            },
          },
        },
      },
    });
  });

  it('can add prefixes based on path depth', () => {
    const data = {
      title: 'root',
      section: {
        title: 'section',
        subsection: {
          title: 'subsection',
        },
      },
    };

    const result = mapObject(data, (key, value, path) => {
      if (key === 'title' && typeof value === 'string') {
        const depth = path.split('.').length - 1;
        return `${'  '.repeat(depth)}${value}`;
      }
      return value;
    });

    expect(result).toEqual({
      title: 'root',
      section: {
        title: '  section',
        subsection: {
          title: '    subsection',
        },
      },
    });
  });

  it('handles arrays of primitives', () => {
    const data = [1, 2, 3, 4, 5];

    const result = mapObject(data, (key, value) => (typeof value === 'number' ? value ** 2 : value));

    expect(result).toEqual([1, 4, 9, 16, 25]);
  });

  it('provides empty string path for root', () => {
    let rootPath: string | undefined;
    mapObject({ test: 1 }, (key, value, path) => {
      if (key === '') {
        rootPath = path;
      }
      return value;
    });

    expect(rootPath).toBe('');
  });

  it('uses parent context for transformation', () => {
    const data = {
      product1: { name: 'Widget', price: 100, currency: 'USD' },
      product2: { name: 'Gadget', price: 50, currency: 'EUR' },
    };

    const result = mapObject(data, (key, value, path, parent) => {
      if (key === 'price' && typeof value === 'number' && typeof parent === 'object' && parent !== null) {
        const p = parent as Record<string, unknown>;
        const symbol = p.currency === 'EUR' ? '€' : '$';
        return `${symbol}${value}`;
      }
      return value;
    });

    expect(result).toEqual({
      product1: { name: 'Widget', price: '$100', currency: 'USD' },
      product2: { name: 'Gadget', price: '€50', currency: 'EUR' },
    });
  });

  it('uses path to determine nesting level', () => {
    const data = {
      a: { b: { c: 1 } },
    };

    const result = mapObject(data, (key, value, path) => {
      if (typeof value === 'number') {
        const depth = path.split('.').length;
        return value * depth;
      }
      return value;
    });

    expect(result).toEqual({
      a: { b: { c: 3 } }, // depth of 'c' is 3
    });
  });

  it('parent is the containing object/array', () => {
    const data = {
      items: [{ id: 1 }, { id: 2 }],
    };

    const result = mapObject(data, (key, value, path, parent) => {
      // When key is 'id', parent is the object containing it: {id: 1}
      // To check if we're in an array, need to check if parent's parent was an array
      // or check the path pattern
      if (key === 'id' && path.match(/\[\d+\]/)) {
        return `item-${value}`;
      }
      return value;
    });

    expect(result).toEqual({
      items: [{ id: 'item-1' }, { id: 'item-2' }],
    });
  });

  it('parent is null for root', () => {
    let rootParent: unknown;
    mapObject({ test: 1 }, (key, value, path, parent) => {
      if (key === '') {
        rootParent = parent;
      }
      return value;
    });

    expect(rootParent).toBe(null);
  });

  it('preserves cyclic references without infinite recursion', () => {
    type CyclicNode = { name: string; value: number; self?: CyclicNode; list?: CyclicNode[] };
    const root: CyclicNode = { name: 'root', value: 1 };
    root.self = root;
    root.list = [root];

    const result = mapObject(root, (_key, value) => (typeof value === 'number' ? value + 1 : value));
    expect(result.value).toBe(2);
    expect(result.self).toBe(result);
    expect(result.list?.[0]).toBe(result);
  });
});

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

describe('filterObject (value filtering)', () => {
  const data = {
    users: [
      { id: 1, name: 'Alice', active: true },
      { id: 2, name: 'Bob', active: false },
    ],
    config: {
      enabled: true,
      theme: 'dark',
      settings: {
        autoSave: false,
        notifications: true,
      },
    },
  };

  it('keeps only objects matching the filter', () => {
    const result = filterObject(data, { values: (key, obj: any) => obj?.active === true });

    expect(result).toEqual({
      users: [{ id: 1, name: 'Alice', active: true }],
    });
  });

  it('preserves nested structure when filtering', () => {
    const result = filterObject(data, { values: (key, obj: any) => obj === true });

    expect(result).toEqual({
      users: [{ active: true }],
      config: {
        enabled: true,
        settings: {
          notifications: true,
        },
      },
    });
  });

  it('keeps parent objects when children match', () => {
    const result = filterObject(data, { values: (key, obj: any) => obj === 'dark' });

    expect(result).toEqual({
      config: {
        theme: 'dark',
      },
    });
  });

  it('returns undefined when nothing matches', () => {
    const result = filterObject(data, { values: () => false });

    expect(result).toBeUndefined();
  });

  it('keeps entire structure when everything matches', () => {
    const result = filterObject(data, { values: () => true });

    expect(result).toEqual(data);
  });

  it('filters primitives in arrays', () => {
    const numbers = [1, 2, 3, 4, 5];
    const result = filterObject(numbers, { values: (key, n: any) => n > 3 });

    expect(result).toEqual([4, 5]);
  });

  it('handles deeply nested objects', () => {
    const nested = {
      a: {
        b: {
          c: { match: true },
          d: { match: false },
        },
      },
    };

    const result = filterObject(nested, { values: (key, obj: any) => obj?.match === true });

    expect(result).toEqual({
      a: {
        b: {
          c: { match: true },
        },
      },
    });
  });

  it('handles empty objects', () => {
    const result = filterObject({}, { values: (key, obj: any) => obj === 1 });

    expect(result).toBeUndefined();
  });

  it('handles empty arrays', () => {
    const result = filterObject([], { values: (key, obj: any) => obj === 1 });

    expect(result).toBeUndefined();
  });

  it('filters mixed types correctly', () => {
    const mixed = {
      string: 'hello',
      number: 42,
      boolean: true,
      nested: {
        value: 100,
      },
    };

    const result = filterObject(mixed, { values: (key, obj: any) => typeof obj === 'number' });

    expect(result).toEqual({
      number: 42,
      nested: {
        value: 100,
      },
    });
  });

  it('keeps array when array itself matches filter', () => {
    const result = filterObject(data, { values: (key, obj: any) => Array.isArray(obj) });

    expect(result).toEqual({
      users: [
        { id: 1, name: 'Alice', active: true },
        { id: 2, name: 'Bob', active: false },
      ],
    });
  });

  it('removes empty branches after filtering', () => {
    const tree = {
      branch1: {
        leaf1: { keep: true },
        leaf2: { keep: false },
      },
      branch2: {
        leaf3: { keep: false },
      },
    };

    const result = filterObject(tree, { values: (key, obj: any) => obj?.keep === true });

    expect(result).toEqual({
      branch1: {
        leaf1: { keep: true },
      },
    });
  });

  it('handles cyclic object graphs without infinite recursion', () => {
    type CyclicNode = { name: string; flag?: boolean; child?: CyclicNode };
    const root: CyclicNode = { name: 'root' };
    root.child = { name: 'child', flag: true, child: root };

    const result = filterObject(root, { values: (key, value) => key === 'flag' || value === true });
    expect(result).toEqual({
      child: {
        flag: true,
      },
    });
  });
});

describe('filterObject (key filtering)', () => {
  const data = {
    user: {
      name: 'Alice',
      color: 'blue',
      age: 30,
      settings: {
        theme: 'dark',
        background: 'white',
        fontSize: 12,
        lineColor: 'red',
      },
    },
    config: {
      enabled: true,
      fill: 'solid',
      border: '1px',
    },
  };

  it('keeps only specified keys throughout the tree', () => {
    const result = filterObject(data, { keys: ['color', 'background', 'lineColor', 'fill'] });

    expect(result).toEqual({
      user: {
        color: 'blue',
        settings: {
          background: 'white',
          lineColor: 'red',
        },
      },
      config: {
        fill: 'solid',
      },
    });
  });

  it('removes branches with no matching keys', () => {
    const tree = {
      branch1: {
        other: 'value',
        nested: {
          more: 'data',
        },
      },
      branch2: {
        color: 'red',
      },
    };

    const result = filterObject(tree, { keys: ['color'] });

    expect(result).toEqual({
      branch2: {
        color: 'red',
      },
    });
  });

  it('handles arrays correctly', () => {
    const arrayData = {
      items: [
        { id: 1, color: 'red', name: 'Item 1' },
        { id: 2, color: 'blue', name: 'Item 2' },
      ],
    };

    const result = filterObject(arrayData, { keys: ['color'] });

    expect(result).toEqual({
      items: [{ color: 'red' }, { color: 'blue' }],
    });
  });

  it('returns undefined for empty objects', () => {
    const result = filterObject({}, { keys: ['color'] });

    expect(result).toBeUndefined();
  });

  it('returns undefined when no keys match', () => {
    const result = filterObject({ name: 'Alice', age: 30 }, { keys: ['color', 'background'] });

    expect(result).toBeUndefined();
  });

  it('handles deeply nested structures', () => {
    const deep = {
      level1: {
        level2: {
          level3: {
            color: 'green',
            other: 'value',
          },
          unrelated: 'data',
        },
      },
    };

    const result = filterObject(deep, { keys: ['color'] });

    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            color: 'green',
          },
        },
      },
    });
  });

  it('keeps multiple matching keys in same object', () => {
    const obj = {
      data: {
        color: 'red',
        background: 'white',
        lineColor: 'black',
        other: 'value',
      },
    };

    const result = filterObject(obj, { keys: ['color', 'background', 'lineColor'] });

    expect(result).toEqual({
      data: {
        color: 'red',
        background: 'white',
        lineColor: 'black',
      },
    });
  });

  it('handles empty arrays', () => {
    const result = filterObject({ items: [] }, { keys: ['color'] });

    expect(result).toBeUndefined();
  });

  it('filters array elements independently', () => {
    const data = {
      items: [
        { color: 'red', size: 'large' },
        { name: 'Item', size: 'small' },
        { color: 'blue', description: 'Text' },
      ],
    };

    const result = filterObject(data, { keys: ['color'] });

    expect(result).toEqual({
      items: [{ color: 'red' }, { color: 'blue' }],
    });
  });

  it('handles mixed nesting with arrays and objects', () => {
    const complex = {
      users: [
        {
          name: 'Alice',
          color: 'blue',
          posts: [
            { title: 'Post 1', background: 'white' },
            { title: 'Post 2', background: 'black' },
          ],
        },
        {
          name: 'Bob',
          color: 'red',
        },
      ],
    };

    const result = filterObject(complex, { keys: ['color', 'background'] });

    expect(result).toEqual({
      users: [
        {
          color: 'blue',
          posts: [{ background: 'white' }, { background: 'black' }],
        },
        {
          color: 'red',
        },
      ],
    });
  });
});

describe('filterObject (combined key and value filtering)', () => {
  const data = {
    user: {
      name: 'Alice',
      color: 'blue',
      age: 30,
      settings: {
        theme: 'dark',
        background: 'white',
        fontSize: 12,
        lineColor: 'red',
      },
    },
    config: {
      enabled: true,
      fill: 'solid',
      border: '1px',
    },
  };

  it('filters by both key and value', () => {
    // Only keep 'color' and 'background' keys that are strings
    const result = filterObject(data, {
      keys: ['color', 'background', 'lineColor', 'fill'],
      values: (key, v: any) => typeof v === 'string',
    });

    expect(result).toEqual({
      user: {
        color: 'blue',
        settings: {
          background: 'white',
          lineColor: 'red',
        },
      },
      config: {
        fill: 'solid',
      },
    });
  });

  it('accepts key filter as function', () => {
    // Keep keys ending with 'Color' (case-insensitive)
    const result = filterObject(data, {
      keys: (key: string) => key.toLowerCase().endsWith('color'),
    });

    expect(result).toEqual({
      user: {
        color: 'blue',
        settings: {
          lineColor: 'red',
        },
      },
    });
  });

  it('combines function key filter with value filter', () => {
    const result = filterObject(data, {
      keys: (key: string) => key.length > 5,
      values: (key, v: any) => typeof v === 'string',
    });

    expect(result).toEqual({
      user: {
        settings: {
          background: 'white',
          lineColor: 'red',
        },
      },
      config: {
        border: '1px',
      },
    });
  });

  it('key filter receives both key and value', () => {
    const result = filterObject(data, {
      keys: (key: string, value: any) => key.includes('color') && typeof value === 'string',
    });

    expect(result).toEqual({
      user: {
        color: 'blue',
        // settings.lineColor is not included because 'settings' is the key checked, not 'lineColor'
      },
    });
  });
});

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
