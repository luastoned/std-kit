# generic

[← Back to std-kit](../../README.md)

---

## Functions

- `cloneObject<T>(item: T): unknown`
- `isArray<T = unknown>(item: unknown): item is T[] | readonly T[]`
- `isBoolean(item: unknown): item is boolean`
- `isContainer(item: unknown): item is Container`
- `isDate(item: unknown): item is Date`
- `isDefined<T = unknown>(item: T): item is Exclude<T, undefined>`
- `isError(item: unknown): item is Error`
- `isFunction(item: unknown): item is (...args: unknown[]) => unknown`
- `isInfinity(item: unknown): item is number`
- `isMap<K = unknown, V = unknown>(item: unknown): item is Map<K, V>`
- `isMutableContainer(item: unknown): item is MutableContainer`
- `isNull(item: unknown): item is null`
- `isNumber(item: unknown): item is number`
- `isObject(item: unknown): item is Record<PropertyKey, unknown>`
- `isPlainObject(item: unknown): item is Record<PropertyKey, unknown>`
- `isPromise<T = unknown>(item: unknown): item is Promise<T>`
- `isRegExp(item: unknown): item is RegExp`
- `isSet<T = unknown>(item: unknown): item is Set<T>`
- `isString(item: unknown): item is string`
- `isSymbol(item: unknown): item is symbol`
- `isUndefined(item: unknown): item is undefined`
- `isWeakMap<K, V = unknown>(item: unknown): item is WeakMap<K, V>`
- `isWeakSet<T>(item: unknown): item is WeakSet<T>`

---

## cloneObject

```typescript
cloneObject<T>(item: T): unknown
```

Creates a deep clone of an item using JSON.parse/JSON.stringify serialization.
Supports most JSON-compatible types including objects, arrays, strings, numbers, booleans, and null.
Cannot clone functions, Dates, RegExps, Maps, Sets, ArrayBuffers, typed arrays, or circular references.
For more complex cloning needs, consider using structuredClone() which supports additional types.

**Returns:** The cloned item or undefined if the input is undefined.

---

## isArray

```typescript
isArray<T = unknown>(item: unknown): item is T[] | readonly T[]
```

Checks if the given item is an array.

**Returns:** `true` if the item is an array, `false` otherwise.

---

## isBoolean

```typescript
isBoolean(item: unknown): item is boolean
```

Checks if the given item is a boolean.

**Returns:** `true` if the item is a boolean, `false` otherwise.

---

## isContainer

```typescript
isContainer(item: unknown): item is Container
```

Checks if the given item is an object or array container.

**Returns:** `true` if the item is an object or array container.

---

## isDate

```typescript
isDate(item: unknown): item is Date
```

Checks if the given item is a Date object.

**Returns:** `true` if the item is a Date object, `false` otherwise.

---

## isDefined

```typescript
isDefined<T = unknown>(item: T): item is Exclude<T, undefined>
```

Checks if the given item is defined.

**Returns:** A boolean indicating whether the item is defined or not.

---

## isError

```typescript
isError(item: unknown): item is Error
```

Checks if the given item is an instance of the Error class.

**Returns:** `true` if the item is an instance of Error, `false` otherwise.

---

## isFunction

```typescript
isFunction(item: unknown): item is (...args: unknown[]) => unknown
```

Checks if the given item is a function.

**Returns:** `true` if the item is a function, `false` otherwise.

---

## isInfinity

```typescript
isInfinity(item: unknown): item is number
```

Checks if the given item is an infinity number.

**Returns:** A boolean indicating whether the item is an infinity number.

---

## isMap

```typescript
isMap<K = unknown, V = unknown>(item: unknown): item is Map<K, V>
```

Checks if the given item is an instance of Map.

**Returns:** `true` if the item is a Map, `false` otherwise.

---

## isMutableContainer

```typescript
isMutableContainer(item: unknown): item is MutableContainer
```

Checks if the given item can be treated as a mutable container.

**Returns:** `true` if the item is an object or array suitable for mutation.

---

## isNull

```typescript
isNull(item: unknown): item is null
```

Checks if the given item is null.

**Returns:** `true` if the item is null, `false` otherwise.

---

## isNumber

```typescript
isNumber(item: unknown): item is number
```

Checks if the given item is a number.

**Returns:** `true` if the item is a number, `false` otherwise.

---

## isObject

```typescript
isObject(item: unknown): item is Record<PropertyKey, unknown>
```

Checks if the given item is an object.

**Returns:** `true` if the item is an object, `false` otherwise.

---

## isPlainObject

```typescript
isPlainObject(item: unknown): item is Record<PropertyKey, unknown>
```

Checks if the given item is a plain object.

**Returns:** A boolean indicating whether the item is a plain object.

---

## isPromise

```typescript
isPromise<T = unknown>(item: unknown): item is Promise<T>
```

Checks if the given item is a Promise.

**Returns:** `true` if the item is a Promise, `false` otherwise.

---

## isRegExp

```typescript
isRegExp(item: unknown): item is RegExp
```

Checks if the given item is a regular expression.

**Returns:** `true` if the item is a regular expression, `false` otherwise.

---

## isSet

```typescript
isSet<T = unknown>(item: unknown): item is Set<T>
```

Checks if the given item is a Set.

**Returns:** A boolean indicating whether the item is a Set.

---

## isString

```typescript
isString(item: unknown): item is string
```

Checks if the given item is a string.

**Returns:** `true` if the item is a string, `false` otherwise.

---

## isSymbol

```typescript
isSymbol(item: unknown): item is symbol
```

Checks if the given item is a symbol.

**Returns:** `true` if the item is a symbol, `false` otherwise.

---

## isUndefined

```typescript
isUndefined(item: unknown): item is undefined
```

Checks if the given item is undefined.

**Returns:** A boolean indicating whether the item is undefined or not.

---

## isWeakMap

```typescript
isWeakMap<K, V = unknown>(item: unknown): item is WeakMap<K, V>
```

Checks if the given item is an instance of WeakMap.

**Returns:** A boolean indicating whether the item is an instance of WeakMap.

---

## isWeakSet

```typescript
isWeakSet<T>(item: unknown): item is WeakSet<T>
```

Checks if the given item is a WeakSet.

**Returns:** A boolean indicating whether the item is a WeakSet.

---
