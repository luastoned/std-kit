# promise

[← Back to std-kit](../../README.md)

---

## Functions

- `defer<Args extends readonly unknown[], Ret>(fn: (...args: Args) => Ret | Promise<Ret>, ...args: Args): DeferredTask<Awaited<Ret>>`
- `queue(options: Readonly<QueueOptions> = {}): Queue`
- `threads<T>(parallel: number, tasks: readonly DeferredTask<T>[]): Promise<T[]>`

## Types

- `interface Queue`
- `interface QueueOptions`
- `type DeferredTask<T> = () => Promise<T>`

---

## Queue

```typescript
interface Queue {
  readonly activeCount: number;
  readonly pendingCount: number;
  add<T>(task: () => T | Promise<T>): Promise<Awaited<T>>;
  clear(reason?: unknown): void;
}
```

Reusable promise task queue.

---

## QueueOptions

```typescript
interface QueueOptions {
  readonly concurrency?: number;
  readonly interval?: number;
}
```

Options used to create a promise task queue.

---

## DeferredTask

```typescript
type DeferredTask<T> = () => Promise<T>
```

A deferred async task that resolves to `T` when executed.

---

## defer

```typescript
defer<Args extends readonly unknown[], Ret>(fn: (...args: Args) => Ret | Promise<Ret>, ...args: Args): DeferredTask<Awaited<Ret>>
```

Wraps a function call so it can be executed later as a promise task.


**Returns:** A deferred task that resolves to the function result.


---

## queue

```typescript
queue(options: Readonly<QueueOptions> = {}): Queue
```

Creates a reusable FIFO queue for promise-returning tasks.

`concurrency` limits how many tasks may run at the same time. `interval` enforces a minimum delay between task starts, which is useful for simple API rate
limiting. The first task starts without an interval delay. Tasks run in a microtask; failures do not stop subsequent tasks.
Clearing rejects only waiting tasks and preserves the interval since the last start.


**Returns:** A reusable promise task queue.


---

## threads

```typescript
threads<T>(parallel: number, tasks: readonly DeferredTask<T>[]): Promise<T[]>
```

Runs promise-returning tasks with a concurrency limit. Resolves in input order, rejects on the first error (Promise.all semantics).


**Returns:** A promise resolving to results in the same order as input tasks.


---

