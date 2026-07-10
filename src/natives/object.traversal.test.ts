import { describe, expect, it } from 'vitest';

import { mapObject, queryObject } from './object';

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
    expect(result[0]?.path).toBe('config.settings.theme');
  });

  it('generates correct paths for array elements', () => {
    const result = queryObject(data, (key, value: any) => typeof value?.id === 'number', true);
    expect(result).toHaveLength(2);
    expect(result[0]?.path).toBe('users[0]');
    expect(result[1]?.path).toBe('users[1]');
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

    const result = mapObject<typeof data>(data, (key, value) => (typeof value === 'number' ? value * 2 : value));

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

    const result = mapObject<typeof data>(data, (key, value) => (typeof value === 'string' ? value.toUpperCase() : value));

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

    const result = mapObject<typeof data>(data, (key, value) => (typeof value === 'number' ? value + 1 : value));

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

    const result = mapObject<typeof data>(data, (key, value) => {
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

    const result = mapObject<typeof data>(data, (key, value) => value);

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

    const result = mapObject<typeof data>(data, (key, value) => value);

    expect(result).toEqual(data);
  });

  it('can convert types', () => {
    const data = {
      timestamp: '2024-01-01',
      count: '42',
    };

    const result = mapObject<{ timestamp: number; count: number }>(data, (key, value) => {
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

    const result = mapObject<typeof data>(data, (key, value) => (typeof value === 'number' ? value * 10 : value));

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

    const result = mapObject<typeof data>(data, (key, value, path) => {
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

    const result = mapObject<typeof data>(data, (key, value) => (typeof value === 'number' ? value ** 2 : value));

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

    const result = mapObject<{
      product1: { name: string; price: string; currency: string };
      product2: { name: string; price: string; currency: string };
    }>(data, (key, value, _path, parent) => {
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

    const result = mapObject<typeof data>(data, (key, value, path) => {
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

    const result = mapObject<{ items: Array<{ id: string }> }>(data, (key, value, path, _parent) => {
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

    const result = mapObject<CyclicNode>(root, (_key, value) => (typeof value === 'number' ? value + 1 : value));
    expect(result.value).toBe(2);
    expect(result.self).toBe(result);
    expect(result.list?.[0]).toBe(result);
  });
});
