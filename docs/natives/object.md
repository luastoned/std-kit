# object

[← Back to std-kit](../../README.md)

---

## Functions

- `deepMerge<TSource, TPatch>(source: TSource, patch: Readonly<TPatch>, options: Readonly<object> = {}): TSource & TPatch` ~~(deprecated)~~
- `filterObject<T>(obj: Readonly<T>, filter: (key: string, value: unknown, path: string, parent: unknown) => boolean): DeepPartial<T> | undefined`
- `getValue<TData, TPath, TDefault = GetFieldType<TData, TPath>>(data: Readonly<TData>, path: TPath, defaultValue?: TDefault): TDefault | GetFieldType<TData, TPath>`
- `mapObject<T>(obj: T, mapper: (key: string, value: unknown, path: string, parent: unknown) => unknown): T`
- `mergeObject<TSource, TPatch>(source: TSource, patch: Readonly<TPatch>, options: Readonly<object> = {}): TSource & TPatch`
- `omit<T, K>(obj: T, keys: readonly K[]): Omit<T, K>`
- `pick<T, K>(obj: T, keys: readonly K[]): Pick<T, K>`
- `queryObject<Ret = unknown, T = unknown, P = false>(obj: unknown, filter: (key: string, value: T, path: string, parent: unknown) => boolean, path: P = ...): unknown[]`
- `setValue<TData, TPath, TValue>(data: TData, path: TPath, value: TValue): void`

---

## deepMerge

```typescript
deepMerge<TSource, TPatch>(source: TSource, patch: Readonly<TPatch>, options: Readonly<object> = {}): TSource & TPatch
```

Deeply merges a patch object into a source object.

> **Deprecated:** Use mergeObject instead.

- **Type Parameter TSource**: Type of the source object.
- **Type Parameter TPatch**: Type of the patch object.
- **source**: The original object to be merged into.
- **patch**: The object containing updates or new keys to be merged.
- **options**: Merge options controlling immutability and undefined handling.

**Returns:** A new object that is the result of deeply merging the patch into the source.


---

## filterObject

```typescript
filterObject<T>(obj: Readonly<T>, filter: (key: string, value: unknown, path: string, parent: unknown) => boolean): DeepPartial<T> | undefined
```

Recursively filters an object or array tree, preserving the original structure but only keeping
items that match the provided predicate.


**Returns:** A new object/array with the same structure, containing only matching items.


---

## getValue

```typescript
getValue<TData, TPath, TDefault = GetFieldType<TData, TPath>>(data: Readonly<TData>, path: TPath, defaultValue?: TDefault): TDefault | GetFieldType<TData, TPath>
```

Retrieves a value from a nested object or array using a dot/bracket notation path.
If the value at the specified path doesn't exist, returns a default value.

Supports accessing both object properties and array indices using a path such as 'user.posts[0].title'.


**Returns:** The value at the specified path, or the default value if the path does not exist.


---

## mapObject

```typescript
mapObject<T>(obj: T, mapper: (key: string, value: unknown, path: string, parent: unknown) => unknown): T
```

Recursively maps over all values in an object or array tree, allowing transformation
of each value while preserving the structure.


**Returns:** A new object/array with the same structure but transformed values.


---

## mergeObject

```typescript
mergeObject<TSource, TPatch>(source: TSource, patch: Readonly<TPatch>, options: Readonly<object> = {}): TSource & TPatch
```

Deeply merges a patch object into a source object.

- New keys in the patch object will be added to the source.
- Nested objects are recursively merged.
- Arrays behavior depends on `mergeArrays` option:
  - If false: All arrays are replaced entirely.
  - If true: Arrays containing objects are merged index-by-index, primitive arrays are replaced.
  - If string: Arrays are merged by matching the specified key field (e.g., 'id').
  - If function: Arrays are merged by matching the result of the key extractor function (item, index) => key.
- Strict mode: When `strict` is true, only keys/items that exist in the source will be merged.
  New keys from the patch and non-matching array items will be ignored.


**Returns:** A new object that is the result of deeply merging the patch into the source.


---

## omit

```typescript
omit<T, K>(obj: T, keys: readonly K[]): Omit<T, K>
```

Creates a new object with all keys from the source object except the specified ones.


**Returns:** A new object without the specified keys.


---

## pick

```typescript
pick<T, K>(obj: T, keys: readonly K[]): Pick<T, K>
```

Creates a new object with only the specified keys from the source object.


**Returns:** A new object containing only the specified keys.


---

## queryObject

```typescript
queryObject<Ret = unknown, T = unknown, P = false>(obj: unknown, filter: (key: string, value: T, path: string, parent: unknown) => boolean, path: P = ...): unknown[]
```

Recursively searches through an object or array tree, finding all values that match the filter function.
Returns a flat array of matching values, optionally with their paths.

The return type is inferred dynamically based on the `path` argument. If `path: true`, the return type includes
both the path and the value. Otherwise, it returns just the values.


**Returns:** A flat array of matching values or matching values with paths (if `path` is true).


---

## setValue

```typescript
setValue<TData, TPath, TValue>(data: TData, path: TPath, value: TValue): void
```

Sets a value in a nested object or array using a dot/bracket notation path.
If the path does not exist, it will create intermediate objects or arrays as needed.

Supports both object properties and array indices in the path, such as 'user.posts[0].title'.


**Returns:** Nothing.


---

