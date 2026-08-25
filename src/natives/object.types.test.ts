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

  it('does not promise patch-only fields for merged object arrays', () => {
    const merged = mergeObject({ items: [{ source: 1 }, { source: 2 }] }, { items: [{ patch: 'yes' }] });
    const replaced = mergeObject({ items: [{ source: 1 }] }, { items: [{ patch: 'yes' }] }, { mergeArrays: false });

    expectTypeOf<(typeof merged.items)[number]>().toEqualTypeOf<{ source: number } | { patch: string } | { source: number; patch: string }>();
    expectTypeOf(replaced).toEqualTypeOf<{ items: { patch: string }[] }>();

    const assertTypeError = (): void => {
      // @ts-expect-error Unmatched source items do not have patch-only fields.
      const unsafePatchValue: string = merged.items[0]!.patch;
      void unsafePatchValue;
    };
    void assertTypeError;
  });
});
