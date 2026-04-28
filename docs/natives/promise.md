# promise

[← Back to std-kit](../../README.md)

---

## Functions

- `defer<Args, Ret>(fn: (...args: Args) => Ret | Promise<Ret>, ...args: Args): DeferredTask<Awaited<Ret>>`
- `threads<T>(parallel: number, tasks: readonly DeferredTask<T>[]): Promise<T[]>`

## Types

- `type DeferredTask<T> = () => Promise<T>`

---

## DeferredTask

```typescript
type DeferredTask<T> = () => Promise<T>;
```

A deferred async task that resolves to `T` when executed.

---

## defer

```typescript
defer<Args, Ret>(fn: (...args: Args) => Ret | Promise<Ret>, ...args: Args): DeferredTask<Awaited<Ret>>
```

Wraps a function call so it can be executed later as a promise task.

**Returns:** A deferred task that resolves to the function result.

---

## threads

```typescript
threads<T>(parallel: number, tasks: readonly DeferredTask<T>[]): Promise<T[]>
```

Runs promise-returning tasks with a concurrency limit.
Resolves in input order, rejects on the first error (Promise.all semantics).

**Returns:** A promise resolving to results in the same order as input tasks.

---
