# types

[← Back to std-kit](../../README.md)

---

## Types

- `type Constructor<T = unknown> = (args: unknown[]) => T`
- `type DeepPartial<T> = unknown`
- `type DeepReadonly<T> = unknown`
- `type DeepRequired<T> = unknown`
- `type GenericFn<T> = (args: T[]) => unknown`
- `type GenericFunction<TFunc> = (args: Parameters) => ReturnType`
- `type GenericObject = Record`
- `type GetFieldType<T, Path> = unknown`
- `type KeyFn<T> = (arg: T) => keyof T`
- `type Maybe<T> = T | null | undefined`
- `type Merge<T, U> = unknown`
- `type Mutable<T> = unknown`
- `type NonEmptyArray<T> = unknown`
- `type Nullable<T> = T | null`
- `type OmitByValue<T, ValueType> = Pick`
- `type Optional<T> = T | undefined`
- `type OptionalKeys<T> = unknown`
- `type PickByValue<T, ValueType> = Pick`
- `type PlainObject = Record`
- `type Prettify<T> = unknown`
- `type RequiredKeys<T> = unknown`
- `type SetOptional<T, K> = unknown`
- `type SetRequired<T, K> = unknown`
- `type Simplify<T> = unknown`
- `type ValueOf<T> = unknown`

---

## Constructor

```typescript
type Constructor<T = unknown> = (args: unknown[]) => T
```

Represents a constructor function type.

---

## DeepPartial

```typescript
type DeepPartial<T> = unknown
```

Makes all properties in T and nested objects optional recursively.

- **T**: The type to make deeply partial.

**Returns:** The deeply partial type.


---

## DeepReadonly

```typescript
type DeepReadonly<T> = unknown
```

Makes all properties in T and nested objects readonly recursively.

- **T**: The type to make deeply readonly.

**Returns:** The deeply readonly type.


---

## DeepRequired

```typescript
type DeepRequired<T> = unknown
```

Makes all properties in T and nested objects required recursively.

- **T**: The type to make deeply required.

**Returns:** The deeply required type.


---

## GenericFn

```typescript
type GenericFn<T> = (args: T[]) => unknown
```

Represents a generic function type.

---

## GenericFunction

```typescript
type GenericFunction<TFunc> = (args: Parameters) => ReturnType
```

Represents a generic function type with preserved signature.

---

## GenericObject

```typescript
type GenericObject = Record
```

Represents a generic object with dynamic keys and unknown values.


**Returns:** The generic object type.


---

## GetFieldType

```typescript
type GetFieldType<T, Path> = unknown
```

---

## KeyFn

```typescript
type KeyFn<T> = (arg: T) => keyof T
```

Represents a function that extracts a key from a value.

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
type Merge<T, U> = unknown
```

Merges two object types, with U's properties taking precedence over T's.

- **T**: The base object type.
- **U**: The object type to merge in.

**Returns:** The merged type.


---

## Mutable

```typescript
type Mutable<T> = unknown
```

Removes readonly modifiers from all properties in a type.

- **T**: The type to make mutable.

**Returns:** The mutable type.


---

## NonEmptyArray

```typescript
type NonEmptyArray<T> = unknown
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
type OmitByValue<T, ValueType> = Pick
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
type OptionalKeys<T> = unknown
```

Extracts the union of all optional keys from a type.

- **T**: The object type.

**Returns:** The optional keys.


---

## PickByValue

```typescript
type PickByValue<T, ValueType> = Pick
```

Picks properties from T where the value type extends ValueType.

- **T**: The object type.
- **ValueType**: The value type to match.

**Returns:** The picked type.


---

## PlainObject

```typescript
type PlainObject = Record
```

Represents a plain object with string keys and unknown values.


**Returns:** The plain object type.


---

## Prettify

```typescript
type Prettify<T> = unknown
```

Represents a type that prettifies another type by preserving its properties.
Useful for improving type display in IDE tooltips.

- **T**: The type to be prettified.

**Returns:** The prettified type.


---

## RequiredKeys

```typescript
type RequiredKeys<T> = unknown
```

Extracts the union of all required keys from a type.

- **T**: The object type.

**Returns:** The required keys.


---

## SetOptional

```typescript
type SetOptional<T, K> = unknown
```

Makes specified keys optional in a type.

- **T**: The object type.
- **K**: The keys to make optional.

**Returns:** The updated type with optional keys.


---

## SetRequired

```typescript
type SetRequired<T, K> = unknown
```

Makes specified keys required in a type.

- **T**: The object type.
- **K**: The keys to make required.

**Returns:** The updated type with required keys.


---

## Simplify

```typescript
type Simplify<T> = unknown
```

Simplifies a type by forcing TypeScript to evaluate it.
Often provides better IntelliSense than Prettify for complex types.

- **T**: The type to simplify.

**Returns:** The simplified type.


---

## ValueOf

```typescript
type ValueOf<T> = unknown
```

Extracts the union of all property values from a type.

- **T**: The object type.

**Returns:** The union of all property values.


---

