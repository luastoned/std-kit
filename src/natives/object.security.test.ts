import { describe, expect, it } from 'vitest';

import { filterObject, mapObject, mergeObject } from './object';

describe('object hardening', () => {
  it.each([true, false])('blocks prototype-polluting merge keys when immutable is %s', (immutable) => {
    const source: Record<string, unknown> = {};
    const patch = JSON.parse('{"__proto__":{"polluted":true}}') as Record<string, unknown>;

    const result = mergeObject(source, patch, { immutable });

    expect(Object.prototype).not.toHaveProperty('polluted');
    expect(result).not.toHaveProperty('__proto__');
    expect(result).not.toHaveProperty('polluted');
  });

  it('blocks forbidden keys at nested merge levels', () => {
    const result = mergeObject({ settings: {} }, { settings: JSON.parse('{"constructor":{"prototype":{"polluted":true}}}') });

    expect(result).toEqual({ settings: {} });
    expect(Object.prototype).not.toHaveProperty('polluted');
  });

  it.each([true, false, 'id'] as const)('blocks forbidden keys in newly inserted array objects with mergeArrays=%s', (mergeArrays) => {
    const patchItem = JSON.parse(
      '{"id":1,"__proto__":{"polluted":true},"constructor":{"prototype":{"polluted":true}},"nested":{"prototype":{"polluted":true},"safe":true}}',
    );
    const result = mergeObject({ items: [] as Record<string, unknown>[] }, { items: [patchItem] }, { mergeArrays });

    expect(result.items).toEqual([{ id: 1, nested: { safe: true } }]);
    expect(Object.prototype).not.toHaveProperty('polluted');
  });

  it('rejects cyclic patch objects with an explicit error', () => {
    const patch: Record<string, unknown> = {};
    patch.self = patch;

    expect(() => mergeObject({}, patch)).toThrow(new TypeError('mergeObject does not support cyclic patch values.'));
  });

  it('rejects cyclic patch arrays with an explicit error', () => {
    const items: unknown[] = [];
    items.push(items);

    expect(() => mergeObject({ items: [] as unknown[] }, { items })).toThrow(new TypeError('mergeObject does not support cyclic patch values.'));
  });
});

describe('object traversal contracts', () => {
  it('passes the containing object as filterObject parent', () => {
    const input = { nested: { value: 1 } };
    let receivedParent: unknown;

    filterObject(input, (key, _value, _path, parent) => {
      if (key === 'value') receivedParent = parent;
      return key === 'value';
    });

    expect(receivedParent).toBe(input.nested);
  });

  it('preserves non-plain objects when the mapper leaves them unchanged', () => {
    const date = new Date(0);
    const map = new Map([['value', 1]]);
    const result = mapObject<{ date: Date; map: Map<string, number> }>({ date, map }, (_key, value) => value);

    expect(result.date).toBe(date);
    expect(result.map).toBe(map);
  });
});
