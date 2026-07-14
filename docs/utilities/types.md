# types

[← Back to std-kit](../../README.md)

---

## Types

- `type Constructor<T = unknown, Args extends unknown[] = any[]> = new (...args: Args) => T`
- `type Container = GenericObject | readonly unknown[]`
- `type DeepMerge<TSource, TPatch, ApplyUndefined extends boolean = false, Strict extends boolean = false> = TPatch extends undefined`
- `type DeepPartial<T> = T extends DeepAtomic`
- `type DeepReadonly<T> = T extends DeepAtomic`
- `type DeepRequired<T> = T extends DeepAtomic`
- `type GenericFunction<TFunc extends (...args: never[]) => unknown> = (...args: Parameters<TFunc>) => ReturnType<TFunc>`
- `type GenericObject = Record<PropertyKey, unknown>`
- `type GetFieldType<T, Path> = Path extends ''`
- `type Maybe<T> = T | null | undefined`
- `type Merge<T, U> = Omit<T, keyof U> & U`
- `type Mutable<T> = { -readonly [K in keyof T]: T[K] }`
- `type MutableContainer = Record<string, unknown> | unknown[]`
- `type NonEmptyArray<T> = [T, ...T[]]`
- `type Nullable<T> = T | null`
- `type OmitByValue<T, ValueType> = Pick<T, { [K in keyof T]: T[K] extends ValueType ? never : K }[keyof T]>`
- `type Optional<T> = T | undefined`
- `type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T]`
- `type PickByValue<T, ValueType> = Pick<T, { [K in keyof T]: T[K] extends ValueType ? K : never }[keyof T]>`
- `type PlainObject = Record<string, unknown>`
- `type Prettify<T> = { [K in keyof T]: T[K] } & {}`
- `type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T]`
- `type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>`
- `type SetRequired<T, K extends keyof T> = T & Required<Pick<T, K>>`
- `type ValueOf<T> = T[keyof T]`

---

## Constructor

```typescript
type Constructor<T = unknown, Args extends unknown[] = any[]> = new (...args: Args) => T
```

Represents a constructor function type.

---

## Container

```typescript
type Container = GenericObject | readonly unknown[]
```

Represents an object or array container.

---

## DeepMerge

```typescript
type DeepMerge<TSource, TPatch, ApplyUndefined extends boolean = false, Strict extends boolean = false> = TPatch extends undefined
  ? ApplyUndefined extends true
    ? undefined
    : TSource
  : TPatch extends DeepAtomic | readonly unknown[]
    ? TPatch
    : TSource extends DeepAtomic | readonly unknown[]
      ? TPatch
      : TSource extends object
        ? TPatch extends object
          ? Prettify<
              Omit<TSource, Strict extends true ? Extract<keyof TPatch, keyof TSource> : keyof TPatch> & {
                [K in Strict extends true ? Extract<keyof TPatch, keyof TSource> : keyof TPatch]: K extends keyof TSource
                  ? K extends keyof TPatch
                    ? DeepMerge<TSource[K], TPatch[K], ApplyUndefined, Strict>
                    : never
                  : K extends keyof TPatch
                    ? TPatch[K]
                    : never;
              }
            >
          : TPatch
        : TPatch
```

Describes the default recursive result of `mergeObject`.

Arrays and atomic values are replaced by the patch type. Object properties are recursively merged. `strict` limits output keys to the source, while
`applyUndefined` controls whether explicit `undefined` replaces a source value.

---

## DeepPartial

```typescript
type DeepPartial<T> = T extends DeepAtomic
  ? T
  : T extends Promise<infer Value>
    ? Promise<DeepPartial<Value>>
    : T extends Map<infer Key, infer Value>
      ? Map<Key, DeepPartial<Value>>
      : T extends ReadonlyMap<infer Key, infer Value>
        ? ReadonlyMap<Key, DeepPartial<Value>>
        : T extends Set<infer Value>
          ? Set<DeepPartial<Value>>
          : T extends ReadonlySet<infer Value>
            ? ReadonlySet<DeepPartial<Value>>
            : T extends WeakMap<infer Key, infer Value>
              ? WeakMap<Key, DeepPartial<Value>>
              : T extends WeakSet<infer Value>
                ? WeakSet<Value>
                : T extends object
                  ? { [P in keyof T]?: DeepPartial<T[P]> }
                  : T
```

Makes all properties in T and nested objects optional recursively. Functions and built-ins are preserved, collections retain their container semantics, and
tuples retain their positions.

- **T**: The type to make deeply partial.

**Returns:** The deeply partial type.


---

## DeepReadonly

```typescript
type DeepReadonly<T> = T extends DeepAtomic
  ? T
  : T extends Promise<infer Value>
    ? Promise<DeepReadonly<Value>>
    : T extends Map<infer Key, infer Value>
      ? ReadonlyMap<DeepReadonly<Key>, DeepReadonly<Value>>
      : T extends ReadonlyMap<infer Key, infer Value>
        ? ReadonlyMap<DeepReadonly<Key>, DeepReadonly<Value>>
        : T extends Set<infer Value>
          ? ReadonlySet<DeepReadonly<Value>>
          : T extends ReadonlySet<infer Value>
            ? ReadonlySet<DeepReadonly<Value>>
            : T extends WeakMap<infer Key, infer Value>
              ? WeakMap<Key, DeepReadonly<Value>>
              : T extends WeakSet<infer Value>
                ? WeakSet<Value>
                : T extends object
                  ? { readonly [P in keyof T]: DeepReadonly<T[P]> }
                  : T
```

Makes all properties in T and nested objects readonly recursively. Mutable maps and sets become their readonly counterparts, while functions and built-ins
are preserved.

- **T**: The type to make deeply readonly.

**Returns:** The deeply readonly type.


---

## DeepRequired

```typescript
type DeepRequired<T> = T extends DeepAtomic
  ? T
  : T extends Promise<infer Value>
    ? Promise<DeepRequired<Value>>
    : T extends Map<infer Key, infer Value>
      ? Map<Key, DeepRequired<Value>>
      : T extends ReadonlyMap<infer Key, infer Value>
        ? ReadonlyMap<Key, DeepRequired<Value>>
        : T extends Set<infer Value>
          ? Set<DeepRequired<Value>>
          : T extends ReadonlySet<infer Value>
            ? ReadonlySet<DeepRequired<Value>>
            : T extends WeakMap<infer Key, infer Value>
              ? WeakMap<Key, DeepRequired<Value>>
              : T extends WeakSet<infer Value>
                ? WeakSet<Value>
                : T extends object
                  ? { [P in keyof T]-?: DeepRequired<T[P]> }
                  : T
```

Makes all properties in T and nested objects required recursively while preserving functions, built-ins, collections, and tuple structure.

- **T**: The type to make deeply required.

**Returns:** The deeply required type.


---

## GenericFunction

```typescript
type GenericFunction<TFunc extends (...args: never[]) => unknown> = (...args: Parameters<TFunc>) => ReturnType<TFunc>
```

Represents a generic function type with preserved signature.

---

## GenericObject

```typescript
type GenericObject = Record<PropertyKey, unknown>
```

Represents a generic object with dynamic keys and unknown values.


**Returns:** The generic object type.


---

## GetFieldType

```typescript
type GetFieldType<T, Path> = Path extends ''
  ? T
  : Path extends `${infer Left}.${infer Right}`
    ? GetNestedField<T, Left, Right>
    : GetDirectOrIndexedField<T, Path>
```

Infers the type at a dot/bracket path.


**Returns:** The inferred value type for the path.


---

## Maybe

```typescript
type Maybe<T> = T | null | undefined
```

Represents a type that can be either a value of type T, null, or undefined.

- **T**: The type of the value.

**Returns:** The nullable optional type.


---

## Merge

```typescript
type Merge<T, U> = Omit<T, keyof U> & U
```

Merges two object types, with U's properties taking precedence over T's.

- **T**: The base object type.
- **U**: The object type to merge in.

**Returns:** The merged type.


---

## Mutable

```typescript
type Mutable<T> = { -readonly [K in keyof T]: T[K] }
```

Removes readonly modifiers from all properties in a type.

- **T**: The type to make mutable.

**Returns:** The mutable type.


---

## MutableContainer

```typescript
type MutableContainer = Record<string, unknown> | unknown[]
```

Represents a mutable container used for nested assignments.

---

## NonEmptyArray

```typescript
type NonEmptyArray<T> = [T, ...T[]]
```

Represents an array that is guaranteed to have at least one element.

- **T**: The type of array elements.

**Returns:** The non-empty array type.


---

## Nullable

```typescript
type Nullable<T> = T | null
```

Represents a type that can be either a value of type T or null.

- **T**: The type of the value.

**Returns:** The nullable type.


---

## OmitByValue

```typescript
type OmitByValue<T, ValueType> = Pick<T, { [K in keyof T]: T[K] extends ValueType ? never : K }[keyof T]>
```

Omits properties from T where the value type extends ValueType.

- **T**: The object type.
- **ValueType**: The value type to match.

**Returns:** The omitted type.


---

## Optional

```typescript
type Optional<T> = T | undefined
```

Represents a type that can be either a value of type T or undefined.

- **T**: The type of the value.

**Returns:** The optional type.


---

## OptionalKeys

```typescript
type OptionalKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? K : never }[keyof T]
```

Extracts the union of all optional keys from a type.

- **T**: The object type.

**Returns:** The optional keys.


---

## PickByValue

```typescript
type PickByValue<T, ValueType> = Pick<T, { [K in keyof T]: T[K] extends ValueType ? K : never }[keyof T]>
```

Picks properties from T where the value type extends ValueType.

- **T**: The object type.
- **ValueType**: The value type to match.

**Returns:** The picked type.


---

## PlainObject

```typescript
type PlainObject = Record<string, unknown>
```

Represents a plain object with string keys and unknown values.


**Returns:** The plain object type.


---

## Prettify

```typescript
type Prettify<T> = { [K in keyof T]: T[K] } & {}
```

Represents a type that prettifies another type by preserving its properties. Useful for improving type display in IDE tooltips.

- **T**: The type to be prettified.

**Returns:** The prettified type.


---

## RequiredKeys

```typescript
type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T]
```

Extracts the union of all required keys from a type.

- **T**: The object type.

**Returns:** The required keys.


---

## SetOptional

```typescript
type SetOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
```

Makes specified keys optional in a type.

- **T**: The object type.
- **K**: The keys to make optional.

**Returns:** The updated type with optional keys.


---

## SetRequired

```typescript
type SetRequired<T, K extends keyof T> = T & Required<Pick<T, K>>
```

Makes specified keys required in a type.

- **T**: The object type.
- **K**: The keys to make required.

**Returns:** The updated type with required keys.


---

## ValueOf

```typescript
type ValueOf<T> = T[keyof T]
```

Extracts the union of all property values from a type.

- **T**: The object type.

**Returns:** The union of all property values.


---

