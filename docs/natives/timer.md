# timer

[← Back to std-kit](../../README.md)

---

## Functions

- `debounce<F>(callback: F, waitFor: number): (args: Parameters) => void`
- `sleep(ms: number): Promise`
- `throttle<F>(callback: F, waitFor: number): (args: Parameters) => Promise`

---

## debounce

```typescript
debounce<F>(callback: F, waitFor: number): (args: Parameters) => void
```

Creates a debounced version of the provided callback function.
The debounced function will delay invoking the callback until after a specified amount of time has passed since the last time it was invoked.


**Returns:** The debounced callback function.


---

## sleep

```typescript
sleep(ms: number): Promise
```

Pauses the execution for the specified number of milliseconds.


**Returns:** A promise that resolves after the specified number of milliseconds.


---

## throttle

```typescript
throttle<F>(callback: F, waitFor: number): (args: Parameters) => Promise
```

Throttles a function and returns a promise that resolves with the result of the function.
The function will be called at most once within the specified time interval.


**Returns:** A throttled function that returns a promise.


---

