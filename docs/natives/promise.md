# promise

[← Back to std-kit](../../README.md)

---

## Functions

- `defer<Args, R>(fn: (args: Args) => R | Promise, args: Args): DeferredTask`
- `threads<T>(parallel: number, tasks: readonly DeferredTask[]): Promise`

## Types

- `type DeferredTask<T> = () => Promise`

---

## DeferredTask

```typescript
type DeferredTask<T> = () => Promise
```

---

## defer

```typescript
defer<Args, R>(fn: (args: Args) => R | Promise, args: Args): DeferredTask
```

Wraps a function call so it can be executed later as a promise task.


**Returns:** A deferred task that resolves to the function result.


---

## threads

```typescript
threads<T>(parallel: number, tasks: readonly DeferredTask[]): Promise
```

Runs promise-returning tasks with a concurrency limit.
Resolves in input order, rejects on the first error (Promise.all semantics).


**Returns:** A promise resolving to results in the same order as input tasks.


---

