import { describe, expectTypeOf, it } from 'vitest';

import { mapObject, mergeObject } from './object';

describe('object type contracts', () => {
  it('requires an explicit map result when consumers need a concrete shape', () => {
    const inferred = mapObject({ value: 1 }, (_key, value) => value);
    const typed = mapObject<{ value: string }>({ value: 1 }, (key, value) => (key === 'value' ? String(value) : value));

    expectTypeOf(inferred).toBeUnknown();
    expectTypeOf(typed).toEqualTypeOf<{ value: string }>();
  });

  it('models recursive merge results and option-dependent behavior', () => {
    const merged = mergeObject({ nested: { left: 1 }, keep: true }, { nested: { right: 'yes' }, added: 2 });
    const strict = mergeObject({ value: 1 }, { value: 'changed', extra: true }, { strict: true });
    const preserveUndefined = mergeObject({ value: 'source' }, { value: undefined });
    const applyUndefined = mergeObject({ value: 'source' }, { value: undefined }, { applyUndefined: true });

    expectTypeOf(merged).toEqualTypeOf<{ nested: { left: number; right: string }; keep: boolean; added: number }>();
    expectTypeOf(strict).toEqualTypeOf<{ value: string }>();
    expectTypeOf(preserveUndefined).toEqualTypeOf<{ value: string }>();
    expectTypeOf(applyUndefined).toEqualTypeOf<{ value: undefined }>();
  });
});
