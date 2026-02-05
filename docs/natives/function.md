# function

[← Back to std-kit](../../README.md)

---

## Functions

- `memoize<F>(fn: F, options: object = {}): (args: Parameters) => ReturnType`
- `once<F>(fn: F): (args: Parameters) => ReturnType | undefined`

---

## memoize

```typescript
memoize<F>(fn: F, options: object = {}): (args: Parameters) => ReturnType
```

Creates a memoized version of a function that caches results based on arguments.
Uses a Map to store cached results with the serialized arguments as the key.


**Returns:** A memoized version of the function.


---

## once

```typescript
once<F>(fn: F): (args: Parameters) => ReturnType | undefined
```

Creates a function that can only be called once.
Subsequent calls return the result of the first invocation.


**Returns:** A new function that executes the original function only on the first call.


---

