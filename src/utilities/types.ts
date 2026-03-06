// =============================================================================
// Display & IntelliSense Helpers
// =============================================================================

/**
 * Represents a type that prettifies another type by preserving its properties.
 * Useful for improving type display in IDE tooltips.
 * @template T - The type to be prettified.
 * @param T - The type to be prettified.
 * @returns The prettified type.
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {};

/**
 * Simplifies a type by forcing TypeScript to evaluate it.
 * Often provides better IntelliSense than Prettify for complex types.
 * @template T - The type to simplify.
 * @param T - The type to simplify.
 * @returns The simplified type.
 */
export type Simplify<T> = { [K in keyof T]: T[K] } & {};

// =============================================================================
// Nullability Types
// =============================================================================

/**
 * Represents a type that can be either a value of type T, null, or undefined.
 * @template T - The type of the value.
 * @param T - The type of the value.
 * @returns The nullable optional type.
 */
export type Maybe<T> = T | null | undefined;

/**
 * Represents a type that can be either a value of type T or null.
 * @template T - The type of the value.
 * @param T - The type of the value.
 * @returns The nullable type.
 */
export type Nullable<T> = T | null;

/**
 * Represents a type that can be either a value of type T or undefined.
 * @template T - The type of the value.
 * @param T - The type of the value.
 * @returns The optional type.
 */
export type Optional<T> = T | undefined;

// =============================================================================
// Function Types
// =============================================================================

/**
 * Represents a function that extracts a key from a value.
 * @template T The type of the value.
 * @param arg The value from which to extract the key.
 * @returns The key extracted from the value.
 */
export type KeyFn<T> = (arg: T) => keyof T;

/**
 * Represents a generic function type.
 * @template T - The type of arguments accepted by the function.
 * @returns The generic function type.
 */
export type GenericFn<T> = (...args: T[]) => unknown;

/**
 * Represents a generic function type with preserved signature.
 * @template TFunc - The type of the function.
 * @returns The generic function type.
 */
export type GenericFunction<TFunc extends (...args: unknown[]) => unknown> = (...args: Parameters<TFunc>) => ReturnType<TFunc>;

/**
 * Represents a constructor function type.
 * @template T - The type that the constructor creates.
 * @returns The constructor type.
 */
export type Constructor<T = unknown> = new (...args: unknown[]) => T;

// =============================================================================
// Object Types
// =============================================================================

/**
 * Represents a generic object with dynamic keys and unknown values.
 * @returns The generic object type.
 */
export type GenericObject = Record<PropertyKey, unknown>;

/**
 * Represents an object or array container.
 */
export type Container = GenericObject | readonly unknown[];

/**
 * Represents a plain object with string keys and unknown values.
 * @returns The plain object type.
 */
export type PlainObject = Record<string, unknown>;

/**
 * Represents a mutable container used for nested assignments.
 */
export type MutableContainer = Record<string, unknown> | unknown[];

// =============================================================================
// Property Manipulation
// =============================================================================

/**
 * Removes readonly modifiers from all properties in a type.
 * @template T - The type to make mutable.
 * @param T - The type to make mutable.
 * @returns The mutable type.
 */
export type Mutable<T> = { -readonly [K in keyof T]: T[K] };

/**
 * Makes specified keys required in a type.
 * @template T - The object type.
 * @template K - The keys to make required.
 * @param T - The object type.
 * @param K - The keys to make required.
 * @returns The updated type with required keys.
 */
export type SetRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Makes specified keys optional in a type.
 * @template T - The object type.
 * @template K - The keys to make optional.
 * @param T - The object type.
 * @param K - The keys to make optional.
 * @returns The updated type with optional keys.
 */
export type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Picks properties from T where the value type extends ValueType.
 * @template T - The object type.
 * @template ValueType - The value type to match.
 * @param T - The object type.
 * @param ValueType - The value type to match.
 * @returns The picked type.
 */
export type PickByValue<T, ValueType> = Pick<T, { [K in keyof T]: T[K] extends ValueType ? K : never }[keyof T]>;

/**
 * Omits properties from T where the value type extends ValueType.
 * @template T - The object type.
 * @template ValueType - The value type to match.
 * @param T - The object type.
 * @param ValueType - The value type to match.
 * @returns The omitted type.
 */
export type OmitByValue<T, ValueType> = Pick<T, { [K in keyof T]: T[K] extends ValueType ? never : K }[keyof T]>;

// =============================================================================
// Deep Modification Types
// =============================================================================

/**
 * Makes all properties in T and nested objects optional recursively.
 * @template T - The type to make deeply partial.
 * @param T - The type to make deeply partial.
 * @returns The deeply partial type.
 */
export type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T;

/**
 * Makes all properties in T and nested objects readonly recursively.
 * @template T - The type to make deeply readonly.
 * @param T - The type to make deeply readonly.
 * @returns The deeply readonly type.
 */
export type DeepReadonly<T> = T extends object ? { readonly [P in keyof T]: DeepReadonly<T[P]> } : T;

/**
 * Makes all properties in T and nested objects required recursively.
 * @template T - The type to make deeply required.
 * @param T - The type to make deeply required.
 * @returns The deeply required type.
 */
export type DeepRequired<T> = T extends object ? { [P in keyof T]-?: DeepRequired<T[P]> } : T;

// =============================================================================
// Type Extraction Utilities
// =============================================================================

/**
 * Extracts the union of all property values from a type.
 * @template T - The object type.
 * @param T - The object type.
 * @returns The union of all property values.
 */
export type ValueOf<T> = T[keyof T];

/**
 * Extracts the union of all required keys from a type.
 * @template T - The object type.
 * @param T - The object type.
 * @returns The required keys.
 */
export type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

/**
 * Extracts the union of all optional keys from a type.
 * @template T - The object type.
 * @param T - The object type.
 * @returns The optional keys.
 */
export type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T];
/**
 * Merges two object types, with U's properties taking precedence over T's.
 * @template T - The base object type.
 * @template U - The object type to merge in.
 * @param T - The base object type.
 * @param U - The object type to merge in.
 * @returns The merged type.
 */
export type Merge<T, U> = Omit<T, keyof U> & U;

// =============================================================================
// Array Types
// =============================================================================

/**
 * Represents an array that is guaranteed to have at least one element.
 * @template T - The type of array elements.
 * @param T - The type of array elements.
 * @returns The non-empty array type.
 */
export type NonEmptyArray<T> = [T, ...T[]];

// =============================================================================
// Path & Field Access Utilities
// =============================================================================
/**
 * Resolves indexed access for arrays and tuples.
 * @internal
 */
type GetIndexedField<T, Idx> = T extends readonly unknown[] | unknown[] ? T[number] : undefined;

/**
 * Resolves direct property access.
 * @internal
 */
type GetDirectField<T, Path extends keyof T> = T[Path];

/**
 * Resolves a property type and preserves undefined when applicable.
 * @internal
 */
type FieldOrUndefined<T, Key> = Key extends keyof T ? T[Key] | Extract<T, undefined> : undefined;

/**
 * Infers the type at a dot/bracket path.
 * @template T - The source object type.
 * @template Path - Dot/bracket path.
 * @returns The inferred value type for the path.
 */
export type GetFieldType<T, Path> = Path extends ''
  ? T
  : Path extends `${infer Left}.${infer Right}`
    ? GetNestedField<T, Left, Right>
    : GetDirectOrIndexedField<T, Path>;

/**
 * Handles direct and indexed path segments.
 * @internal
 */
type GetDirectOrIndexedField<T, Path> = Path extends `${infer FieldKey}[${infer IdxKey}]`
  ? FieldKey extends keyof T
    ? GetIndexedField<T[FieldKey], IdxKey>
    : undefined
  : Path extends keyof T
    ? GetDirectField<T, Path>
    : undefined;

/**
 * Recursively resolves nested path segments.
 * @internal
 */
type GetNestedField<T, Left extends string, Right extends string> = Left extends `${infer FieldKey}[${infer IdxKey}]`
  ? FieldKey extends keyof T
    ? GetFieldType<GetIndexedField<T[FieldKey], IdxKey>, Right>
    : undefined
  : GetFieldType<FieldOrUndefined<T, Left>, Right>;
