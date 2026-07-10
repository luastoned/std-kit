import { describe, expect, expectTypeOf, it } from 'vitest';

import type { Constructor, GenericFunction, GetFieldType } from './types';

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
});
