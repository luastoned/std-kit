# guard

[← Back to std-kit](../../README.md)

---

## Functions

- `guard<T>(fn: () => Promise<T>, shouldGuard?: (error: unknown) => boolean): Promise<T | undefined>`

---

## guard

```typescript
guard<T>(fn: () => Promise<T>, shouldGuard?: (error: unknown) => boolean): Promise<T | undefined>
```

Wraps a function to safely execute it and catch any errors.
Works with both synchronous and asynchronous functions.

**Returns:** The result of the function, or undefined if an error is caught.
For async functions, returns a Promise that resolves to the result or undefined.

---
