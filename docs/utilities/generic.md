# generic

[← Back to std-kit](../../README.md)

---

## Functions

- `cloneObject<T>(item: T): unknown`
- `isArray<T = unknown>(item: unknown): unknown`
- `isBoolean(item: unknown): unknown`
- `isDate(item: unknown): unknown`
- `isDefined<T = unknown>(item: T): unknown`
- `isError(item: unknown): unknown`
- `isFunction(item: unknown): unknown`
- `isInfinity(item: unknown): unknown`
- `isMap<K = unknown, V = unknown>(item: unknown): unknown`
- `isNull(item: unknown): unknown`
- `isNumber(item: unknown): unknown`
- `isObject(item: unknown): unknown`
- `isPlainObject(item: unknown): unknown`
- `isPromise<T = unknown>(item: unknown): unknown`
- `isRegExp(item: unknown): unknown`
- `isSet<T = unknown>(item: unknown): unknown`
- `isString(item: unknown): unknown`
- `isSymbol(item: unknown): unknown`
- `isUndefined(item: unknown): unknown`
- `isWeakMap<K, V = unknown>(item: unknown): unknown`
- `isWeakSet<T>(item: unknown): unknown`

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
isArray<T = unknown>(item: unknown): unknown
```

Checks if the given item is an array.


**Returns:** `true` if the item is an array, `false` otherwise.


---

## isBoolean

```typescript
isBoolean(item: unknown): unknown
```

Checks if the given item is a boolean.


**Returns:** `true` if the item is a boolean, `false` otherwise.


---

## isDate

```typescript
isDate(item: unknown): unknown
```

Checks if the given item is a Date object.


**Returns:** `true` if the item is a Date object, `false` otherwise.


---

## isDefined

```typescript
isDefined<T = unknown>(item: T): unknown
```

Checks if the given item is defined.


**Returns:** A boolean indicating whether the item is defined or not.


---

## isError

```typescript
isError(item: unknown): unknown
```

Checks if the given item is an instance of the Error class.


**Returns:** `true` if the item is an instance of Error, `false` otherwise.


---

## isFunction

```typescript
isFunction(item: unknown): unknown
```

Checks if the given item is a function.


**Returns:** `true` if the item is a function, `false` otherwise.


---

## isInfinity

```typescript
isInfinity(item: unknown): unknown
```

Checks if the given item is an infinity number.


**Returns:** A boolean indicating whether the item is an infinity number.


---

## isMap

```typescript
isMap<K = unknown, V = unknown>(item: unknown): unknown
```

Checks if the given item is an instance of Map.


**Returns:** `true` if the item is a Map, `false` otherwise.


---

## isNull

```typescript
isNull(item: unknown): unknown
```

Checks if the given item is null.


**Returns:** `true` if the item is null, `false` otherwise.


---

## isNumber

```typescript
isNumber(item: unknown): unknown
```

Checks if the given item is a number.


**Returns:** `true` if the item is a number, `false` otherwise.


---

## isObject

```typescript
isObject(item: unknown): unknown
```

Checks if the given item is an object.


**Returns:** `true` if the item is an object, `false` otherwise.


---

## isPlainObject

```typescript
isPlainObject(item: unknown): unknown
```

Checks if the given item is a plain object.


**Returns:** A boolean indicating whether the item is a plain object.


---

## isPromise

```typescript
isPromise<T = unknown>(item: unknown): unknown
```

Checks if the given item is a Promise.


**Returns:** `true` if the item is a Promise, `false` otherwise.


---

## isRegExp

```typescript
isRegExp(item: unknown): unknown
```

Checks if the given item is a regular expression.


**Returns:** `true` if the item is a regular expression, `false` otherwise.


---

## isSet

```typescript
isSet<T = unknown>(item: unknown): unknown
```

Checks if the given item is a Set.


**Returns:** A boolean indicating whether the item is a Set.


---

## isString

```typescript
isString(item: unknown): unknown
```

Checks if the given item is a string.


**Returns:** `true` if the item is a string, `false` otherwise.


---

## isSymbol

```typescript
isSymbol(item: unknown): unknown
```

Checks if the given item is a symbol.


**Returns:** `true` if the item is a symbol, `false` otherwise.


---

## isUndefined

```typescript
isUndefined(item: unknown): unknown
```

Checks if the given item is undefined.


**Returns:** A boolean indicating whether the item is undefined or not.


---

## isWeakMap

```typescript
isWeakMap<K, V = unknown>(item: unknown): unknown
```

Checks if the given item is an instance of WeakMap.


**Returns:** A boolean indicating whether the item is an instance of WeakMap.


---

## isWeakSet

```typescript
isWeakSet<T>(item: unknown): unknown
```

Checks if the given item is a WeakSet.


**Returns:** A boolean indicating whether the item is a WeakSet.


---

