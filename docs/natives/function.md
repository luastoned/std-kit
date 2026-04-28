# function

[← Back to std-kit](../../README.md)

---

## Functions

- `memoize<Args, Ret>(fn: (...args: Args) => Ret, options: object = {}): (...args: Args) => Ret`
- `once<Args, Ret>(fn: (...args: Args) => Ret): (...args: Args) => Ret | undefined`

---

## memoize

```typescript
memoize<Args, Ret>(fn: (...args: Args) => Ret, options: object = {}): (...args: Args) => Ret
```

Creates a memoized version of a function that caches results based on arguments.
Uses a Map to store cached results with the serialized arguments as the key.

**Returns:** A memoized version of the function.

---

## once

```typescript
once<Args, Ret>(fn: (...args: Args) => Ret): (...args: Args) => Ret | undefined
```

Creates a function that can only be called once.
Subsequent calls return the result of the first invocation.

**Returns:** A new function that executes the original function only on the first call.

---
