import { describe, expect, it } from 'vitest';

import { filterObject } from './object';

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

  it('supports direct predicate callback syntax', () => {
    const fromOptions = filterObject(data, { values: (_key, value: any) => typeof value === 'boolean' });
    const fromPredicate = filterObject(data, (_key, value) => typeof value === 'boolean');

    expect(fromPredicate).toEqual(fromOptions);
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
