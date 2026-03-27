import { describe, expect, it } from 'vitest';
import { createHeap, createMaxHeap, createMinHeap } from './heap';

describe('createHeap', () => {
  it('orders items using the provided comparator', () => {
    const heap = createHeap<number>({
      compare: (a, b) => a - b,
      items: [5, 1, 4, 2, 3],
    });

    expect(heap.peek()).toBe(1);
    expect(heap.pop()).toBe(1);
    expect(heap.pop()).toBe(2);
    expect(heap.pop()).toBe(3);
  });

  it('supports object heaps with a custom comparator', () => {
    const heap = createHeap<{ id: string; priority: number }>({
      compare: (a, b) => a.priority - b.priority,
      items: [
        { id: 'a', priority: 3 },
        { id: 'b', priority: 1 },
        { id: 'c', priority: 2 },
      ],
    });

    expect(heap.pop()?.id).toBe('b');
    expect(heap.pop()?.id).toBe('c');
    expect(heap.pop()?.id).toBe('a');
  });

  it('push returns the next heap size', () => {
    const heap = createMinHeap<number>();

    expect(heap.push(3)).toBe(1);
    expect(heap.push(1)).toBe(2);
    expect(heap.push(2)).toBe(3);
    expect(heap.peek()).toBe(1);
  });

  it('replace swaps the root and preserves heap order', () => {
    const heap = createMinHeap<number>({ items: [1, 2, 3] });

    expect(heap.replace(4)).toBe(1);
    expect(heap.peek()).toBe(2);
    expect(heap.toArray().length).toBe(3);
  });

  it('replace inserts when the heap is empty', () => {
    const heap = createMinHeap<number>();

    expect(heap.replace(4)).toBeUndefined();
    expect(heap.peek()).toBe(4);
  });

  it('pushPop returns the incoming item when it should stay outside the heap', () => {
    const heap = createMinHeap<number>({ items: [2, 3, 4] });

    expect(heap.pushPop(1)).toBe(1);
    expect(heap.peek()).toBe(2);
    expect(heap.toArray().length).toBe(3);
  });

  it('pushPop replaces the root when the incoming item should enter the heap', () => {
    const heap = createMinHeap<number>({ items: [2, 3, 4] });

    expect(heap.pushPop(5)).toBe(2);
    expect(heap.peek()).toBe(3);
    expect(heap.toArray().length).toBe(3);
  });

  it('can be cleared and reused', () => {
    const heap = createMinHeap<number>({ items: [3, 1, 2] });

    heap.clear();
    expect(heap.isEmpty()).toBe(true);
    expect(heap.size).toBe(0);

    heap.push(10);
    expect(heap.peek()).toBe(10);
  });

  it('toArray returns a copy of the heap storage', () => {
    const heap = createMinHeap<number>({ items: [3, 1, 2] });
    const snapshot = heap.toArray();

    snapshot.push(999);

    expect(heap.size).toBe(3);
    expect(heap.toArray()).not.toContain(999);
  });
});

describe('createMinHeap', () => {
  it('creates a min-heap with the default comparator', () => {
    const heap = createMinHeap<number>({ items: [5, 1, 4, 2, 3] });

    expect(heap.pop()).toBe(1);
    expect(heap.pop()).toBe(2);
    expect(heap.pop()).toBe(3);
  });
});

describe('createMaxHeap', () => {
  it('creates a max-heap with the default comparator', () => {
    const heap = createMaxHeap<number>({ items: [5, 1, 4, 2, 3] });

    expect(heap.pop()).toBe(5);
    expect(heap.pop()).toBe(4);
    expect(heap.pop()).toBe(3);
  });
});
