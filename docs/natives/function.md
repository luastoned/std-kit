# function

[← Back to std-kit](../../README.md)

---

## Functions

- `memoize<Args extends unknown[], Ret>(fn: (...args: Args) => Ret, options: Readonly<MemoizeOptions<Args>> = {}): MemoizedFunction<Args, Ret>`
- `once<Args extends unknown[], Ret>(fn: (...args: Args) => Ret): (...args: Args) => Ret`

## Types

- `interface MemoizedFunction<Args extends unknown[], Ret>`
- `interface MemoizeOptions<Args extends unknown[]>`

---

## MemoizedFunction

```typescript
interface MemoizedFunction<Args extends unknown[], Ret> {
  clear(): void;
}
```

A memoized function with explicit cache lifecycle control.

---

## MemoizeOptions

```typescript
interface MemoizeOptions<Args extends unknown[]> {
  readonly keyFn?: (...args: Args) => unknown;
}
```

Options for creating a memoized function.

---

## memoize

```typescript
memoize<Args extends unknown[], Ret>(fn: (...args: Args) => Ret, options: Readonly<MemoizeOptions<Args>> = {}): MemoizedFunction<Args, Ret>
```

Creates a memoized version of a function that caches results by primitive value and object identity.


**Returns:** A memoized version of the function with a `clear()` method.


---

## once

```typescript
once<Args extends unknown[], Ret>(fn: (...args: Args) => Ret): (...args: Args) => Ret
```

Creates a function that can only be called once. Subsequent calls return the result of the first invocation.


**Returns:** A new function that executes the original function only on the first call.


---

