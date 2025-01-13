/**
 * Represents a type that prettifies another type by preserving its properties.
 * @template T - The type to be prettified.
 */
export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

/**
 * Represents a type that can be either a value of type T, null, or undefined.
 *
 * @template T - The type of the value.
 */
export type Maybe<T> = T | null | undefined;

/**
 * Represents a function that extracts a key from a value.
 * @template T The type of the value.
 * @param arg The value from which to extract the key.
 * @returns The key extracted from the value.
 */
export type KeyFn<T> = (arg: T) => keyof T; // PropertyKey

/**
 * Represents a generic function type.
 * @template T - The type of arguments accepted by the function.
 */
export type GenericFn<T> = (...args: T[]) => unknown;

/**
 * Represents a generic object with dynamic keys and unknown values.
 */
export type GenericObject = Record<PropertyKey, unknown>;

/**
 * Represents a plain object with string keys and unknown values.
 */
export type PlainObject = Record<string, unknown>;

/**
 * Represents a generic function type.
 * @template TFunc - The type of the function.
 */
export type GenericFunction<TFunc extends (...args: unknown[]) => unknown> = (...args: Parameters<TFunc>) => ReturnType<TFunc>;

// Utility to handle array/tuple indexing
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
export type GetFieldType<T, Path> = Path extends `${infer Left}.${infer Right}` ? GetNestedField<T, Left, Right> : GetDirectOrIndexedField<T, Path>;

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
