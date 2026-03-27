# timer

[← Back to std-kit](../../README.md)

---

## Functions

- `debounce<Args, Ret>(callback: (...args: Args) => Ret, waitFor: number): (...args: Args) => void`
- `sleep(ms: number): Promise<void>`
- `throttle<Args, Ret>(callback: (...args: Args) => Ret, waitFor: number): (...args: Args) => Promise<Awaited<Ret>>`

---

## debounce

```typescript
debounce<Args, Ret>(callback: (...args: Args) => Ret, waitFor: number): (...args: Args) => void
```

Creates a debounced version of the provided callback function.
The debounced function will delay invoking the callback until after a specified amount of time has passed since the last time it was invoked.

**Returns:** The debounced callback function.

---

## sleep

```typescript
sleep(ms: number): Promise<void>
```

Pauses the execution for the specified number of milliseconds.

**Returns:** A promise that resolves after the specified number of milliseconds.

---

## throttle

```typescript
throttle<Args, Ret>(callback: (...args: Args) => Ret, waitFor: number): (...args: Args) => Promise<Awaited<Ret>>
```

Throttles a function and returns a promise that resolves with the result of the function.
The function will be called at most once within the specified time interval.

**Returns:** A throttled function that returns a promise.

---
