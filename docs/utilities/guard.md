# guard

[← Back to std-kit](../../README.md)

---

## Functions

- `guard<F>(fn: F, shouldGuard: (error: unknown) => boolean): unknown`

---

## guard

```typescript
guard<F>(fn: F, shouldGuard: (error: unknown) => boolean): unknown
```

Wraps a function to safely execute it and catch any errors.
Works with both synchronous and asynchronous functions.


**Returns:** The result of the function, or undefined if an error is caught.
  For async functions, returns a Promise that resolves to the result or undefined.


---

