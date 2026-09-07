# guard

[← Back to std-kit](../../README.md)

---

## Functions

- `guard<T>(fn: () => PromiseLike<T>, shouldGuard?: (error: unknown) => boolean): Promise<T | undefined>`

---

## guard

```typescript
guard<T>(fn: () => PromiseLike<T>, shouldGuard?: (error: unknown) => boolean): Promise<T | undefined>
guard<T>(fn: () => T, shouldGuard?: (error: unknown) => boolean): T | undefined
```

Wraps a function to safely execute it and catch any errors. Works with synchronous results, Promises from any realm, and generic thenables.


**Returns:** The result of the function, or undefined if an error is caught.
  For Promise-like results, returns a native Promise that resolves to the result or undefined.


---

