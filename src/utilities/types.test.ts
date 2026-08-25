import { describe, expect, expectTypeOf, it } from 'vitest';

import type { Constructor, DeepPartial, DeepReadonly, DeepRequired, GenericFunction, GetFieldType } from './types';

describe('public type utilities', () => {
  it('preserves concrete function signatures', () => {
    type Unary = (value: string) => number;
    const wrapped: GenericFunction<Unary> = (value) => value.length;

    expect(wrapped('value')).toBe(5);
    expectTypeOf(wrapped).toEqualTypeOf<Unary>();
  });

  it('represents constructors with required arguments', () => {
    class RequiresArgument {
      constructor(readonly value: string) {}
    }

    const genericConstructor: Constructor<RequiresArgument> = RequiresArgument;
    const typedConstructor: Constructor<RequiresArgument, [value: string]> = RequiresArgument;

    expect(new genericConstructor('generic').value).toBe('generic');
    expect(new typedConstructor('typed').value).toBe('typed');
  });

  it('preserves values and undefined through optional paths', () => {
    type OptionalPath = GetFieldType<{ nested?: { value: string } }, 'nested.value'>;
    type OptionalArrayPath = GetFieldType<{ rows?: Array<{ id: number }> }, 'rows[0].id'>;

    expectTypeOf<OptionalPath>().toEqualTypeOf<string | undefined>();
    expectTypeOf<OptionalArrayPath>().toEqualTypeOf<number | undefined>();
  });

  it('accepts decimal bracket indices and rejects invalid or out-of-range tuple indices', () => {
    type Model = { rows: Array<{ id: number }>; tuple: readonly [string, number] };

    expectTypeOf<GetFieldType<Model, 'rows[12].id'>>().toEqualTypeOf<number>();
    expectTypeOf<GetFieldType<Model, 'tuple[1]'>>().toEqualTypeOf<number>();
    expectTypeOf<GetFieldType<Model, 'rows[item].id'>>().toEqualTypeOf<undefined>();
    expectTypeOf<GetFieldType<Model, 'rows[-1].id'>>().toEqualTypeOf<undefined>();
    expectTypeOf<GetFieldType<Model, 'tuple[2]'>>().toEqualTypeOf<undefined>();
  });

  it('preserves atomic values, collections, and tuple structure in deep modifiers', () => {
    type Model = {
      callback: (value: string) => number;
      createdAt: Date;
      tuple: readonly [{ id?: number }, string];
      settings: Map<string, { enabled?: boolean }>;
    };

    type PartialModel = DeepPartial<Model>;
    type ReadonlyModel = DeepReadonly<Model>;
    type RequiredModel = DeepRequired<Model>;

    expectTypeOf<NonNullable<PartialModel['callback']>>().toEqualTypeOf<(value: string) => number>();
    expectTypeOf<NonNullable<PartialModel['createdAt']>>().toEqualTypeOf<Date>();
    expectTypeOf<NonNullable<PartialModel['tuple']>>().toEqualTypeOf<readonly [first?: { id?: number }, second?: string]>();
    expectTypeOf<NonNullable<PartialModel['settings']>>().toEqualTypeOf<Map<string, { enabled?: boolean }>>();

    expectTypeOf<ReadonlyModel['tuple']>().toEqualTypeOf<readonly [{ readonly id?: number }, string]>();
    expectTypeOf<ReadonlyModel['settings']>().toEqualTypeOf<ReadonlyMap<string, { readonly enabled?: boolean }>>();

    expectTypeOf<RequiredModel['tuple']>().toEqualTypeOf<readonly [{ id: number }, string]>();
    expectTypeOf<RequiredModel['settings']>().toEqualTypeOf<Map<string, { enabled: boolean }>>();
  });
});
