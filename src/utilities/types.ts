// =============================================================================
// Display & IntelliSense Helpers
// =============================================================================

/**
 * Represents a type that prettifies another type by preserving its properties.
 * Useful for improving type display in IDE tooltips.
 * @template T - The type to be prettified.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Simplifies a type by forcing TypeScript to evaluate it.
 * Often provides better IntelliSense than Prettify for complex types.
 * @template T - The type to simplify.
 */
export type Simplify<T> = { [K in keyof T]: T[K] } & {};

// =============================================================================
// Nullability Types
// =============================================================================

/**
 * Represents a type that can be either a value of type T, null, or undefined.
 * @template T - The type of the value.
 */
export type Maybe<T> = T | null | undefined;

/**
 * Represents a type that can be either a value of type T or null.
 * @template T - The type of the value.
 */
export type Nullable<T> = T | null;

/**
 * Represents a type that can be either a value of type T or undefined.
 * @template T - The type of the value.
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
 */
export type GenericFn<T> = (...args: T[]) => unknown;

/**
 * Represents a generic function type with preserved signature.
 * @template TFunc - The type of the function.
 */
export type GenericFunction<TFunc extends (...args: unknown[]) => unknown> = (...args: Parameters<TFunc>) => ReturnType<TFunc>;

/**
 * Represents a constructor function type.
 * @template T - The type that the constructor creates.
 */
export type Constructor<T = unknown> = new (...args: unknown[]) => T;

// =============================================================================
// Object Types
// =============================================================================

/**
 * Represents a generic object with dynamic keys and unknown values.
 */
export type GenericObject = Record<PropertyKey, unknown>;

/**
 * Represents a plain object with string keys and unknown values.
 */
export type PlainObject = Record<string, unknown>;

// =============================================================================
// Property Manipulation
// =============================================================================

/**
 * Removes readonly modifiers from all properties in a type.
 * @template T - The type to make mutable.
 */
export type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

/**
 * Makes specified keys required in a type.
 * @template T - The object type.
 * @template K - The keys to make required.
 */
export type SetRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Makes specified keys optional in a type.
 * @template T - The object type.
 * @template K - The keys to make optional.
 */
export type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Picks properties from T where the value type extends ValueType.
 * @template T - The object type.
 * @template ValueType - The value type to match.
 */
export type PickByValue<T, ValueType> = Pick<T, { [K in keyof T]: T[K] extends ValueType ? K : never }[keyof T]>;

/**
 * Omits properties from T where the value type extends ValueType.
 * @template T - The object type.
 * @template ValueType - The value type to match.
 */
export type OmitByValue<T, ValueType> = Pick<T, { [K in keyof T]: T[K] extends ValueType ? never : K }[keyof T]>;

// =============================================================================
// Deep Modification Types
// =============================================================================

/**
 * Makes all properties in T and nested objects optional recursively.
 * @template T - The type to make deeply partial.
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Makes all properties in T and nested objects readonly recursively.
 * @template T - The type to make deeply readonly.
 */
export type DeepReadonly<T> = T extends object
  ? {
      readonly [P in keyof T]: DeepReadonly<T[P]>;
    }
  : T;

/**
 * Makes all properties in T and nested objects required recursively.
 * @template T - The type to make deeply required.
 */
export type DeepRequired<T> = T extends object
  ? {
      [P in keyof T]-?: DeepRequired<T[P]>;
    }
  : T;

// =============================================================================
// Type Extraction Utilities
// =============================================================================

/**
 * Extracts the union of all property values from a type.
 * @template T - The object type.
 */
export type ValueOf<T> = T[keyof T];

/**
 * Extracts the union of all required keys from a type.
 * @template T - The object type.
 */
export type RequiredKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];

/**
 * Extracts the union of all optional keys from a type.
 * @template T - The object type.
 */
export type OptionalKeys<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? K : never;
}[keyof T];

/**
 * Merges two object types, with U's properties taking precedence over T's.
 * @template T - The base object type.
 * @template U - The object type to merge in.
 */
export type Merge<T, U> = Omit<T, keyof U> & U;

// =============================================================================
// Array Types
// =============================================================================

/**
 * Represents an array that is guaranteed to have at least one element.
 * @template T - The type of array elements.
 */
export type NonEmptyArray<T> = [T, ...T[]];

// =============================================================================
// Path & Field Access Utilities
// =============================================================================
type GetIndexedField<T, Idx> = T extends readonly unknown[] | unknown[]
  ? T[number] // Safely access array or tuple element by number
  : undefined;

// Utility to handle direct object field access
type GetDirectField<T, Path extends keyof T> = T[Path];

// Utility to handle undefined or potentially missing properties
type FieldOrUndefined<T, Key> = Key extends keyof T
  ? T[Key] | Extract<T, undefined> // Handle field or undefined
  : undefined;

// Main recursive type to infer the type from a dot notation or array path
// export type GetFieldType<T, Path> = Path extends `${infer Left}.${infer Right}` ? GetNestedField<T, Left, Right> : GetDirectOrIndexedField<T, Path>;
export type GetFieldType<T, Path> = Path extends ''
  ? T
  : Path extends `${infer Left}.${infer Right}`
    ? GetNestedField<T, Left, Right>
    : GetDirectOrIndexedField<T, Path>;

// Handle direct field access or array indexing (e.g., 'user.name' or 'user.posts[0]')
type GetDirectOrIndexedField<T, Path> = Path extends `${infer FieldKey}[${infer IdxKey}]`
  ? FieldKey extends keyof T
    ? GetIndexedField<T[FieldKey], IdxKey>
    : undefined
  : Path extends keyof T
    ? GetDirectField<T, Path> // Direct object field access
    : undefined;

// Handle nested fields, i.e., recursively process the path (e.g., 'user.posts[0].title')
type GetNestedField<T, Left extends string, Right extends string> = Left extends `${infer FieldKey}[${infer IdxKey}]`
  ? FieldKey extends keyof T
    ? GetFieldType<GetIndexedField<T[FieldKey], IdxKey>, Right>
    : undefined
  : GetFieldType<FieldOrUndefined<T, Left>, Right>;
