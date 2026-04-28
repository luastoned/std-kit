# heap

[← Back to std-kit](../../README.md)

---

## Functions

- `createHeap<T>(options: Readonly<HeapOptions<T>>): Heap<T>`
- `createMaxHeap<T>(options: Readonly<Partial<HeapOptions<T>>> = {}): Heap<T>`
- `createMinHeap<T>(options: Readonly<Partial<HeapOptions<T>>> = {}): Heap<T>`

## Types

- `type HeapCompare<T> = (a: T, b: T) => number`

---

## HeapCompare

```typescript
type HeapCompare<T> = (a: T, b: T) => number;
```

Comparison function used to order heap items.

Values less than zero place `a` ahead of `b`, values greater than zero place `b` ahead of `a`,
and zero keeps them equivalent.

---

## createHeap

```typescript
createHeap<T>(options: Readonly<HeapOptions<T>>): Heap<T>
```

Creates a heap with custom ordering.

**Returns:** A stateful heap API.

---

## createMaxHeap

```typescript
createMaxHeap<T>(options: Readonly<Partial<HeapOptions<T>>> = {}): Heap<T>
```

Creates a max-heap for primitive or otherwise naturally comparable values.

**Returns:** A max-heap instance.

---

## createMinHeap

```typescript
createMinHeap<T>(options: Readonly<Partial<HeapOptions<T>>> = {}): Heap<T>
```

Creates a min-heap for primitive or otherwise naturally comparable values.

**Returns:** A min-heap instance.

---
