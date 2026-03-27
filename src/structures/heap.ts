/**
 * Comparison function used to order heap items.
 *
 * Values less than zero place `a` ahead of `b`, values greater than zero place `b` ahead of `a`,
 * and zero keeps them equivalent.
 *
 * @template T - The heap item type.
 * @param a - The first item to compare.
 * @param b - The second item to compare.
 * @returns A comparison result compatible with array sorting semantics.
 */
export type HeapCompare<T> = (a: T, b: T) => number;

/**
 * Options used to create a heap.
 *
 * @template T - The heap item type.
 */
export interface HeapOptions<T> {
  compare: HeapCompare<T>;
  items?: readonly T[];
}

/**
 * Public heap API.
 *
 * @template T - The heap item type.
 */
export interface Heap<T> {
  readonly size: number;
  clear(): void;
  isEmpty(): boolean;
  peek(): T | undefined;
  push(item: T): number;
  pop(): T | undefined;
  replace(item: T): T | undefined;
  pushPop(item: T): T;
  toArray(): T[];
}

/**
 * Creates a default comparator for primitive min/max heaps.
 *
 * @internal
 * @template T - The heap item type.
 * @param direction - Whether lower or higher values should rise to the top.
 * @returns A comparator for primitive values.
 */
function createDefaultCompare<T>(direction: 'min' | 'max'): HeapCompare<T> {
  return (a: T, b: T): number => {
    if (a === b) {
      return 0;
    }

    if (direction === 'min') {
      return a < b ? -1 : 1;
    }

    return a > b ? -1 : 1;
  };
}

/**
 * Swaps two entries in a heap array.
 *
 * @internal
 * @template T - The heap item type.
 * @param items - The heap array.
 * @param leftIndex - The first index.
 * @param rightIndex - The second index.
 * @returns Nothing.
 */
function swapHeapItems<T>(items: T[], leftIndex: number, rightIndex: number): void {
  const leftItem = items[leftIndex];
  const rightItem = items[rightIndex];
  items[leftIndex] = rightItem as T;
  items[rightIndex] = leftItem as T;
}

/**
 * Restores heap order by moving an item upward.
 *
 * @internal
 * @template T - The heap item type.
 * @param items - The heap array.
 * @param startIndex - The index to bubble up.
 * @param compare - The heap comparator.
 * @returns The final item index.
 */
function siftUp<T>(items: T[], startIndex: number, compare: HeapCompare<T>): number {
  let index = startIndex;

  while (index > 0) {
    const parentIndex = Math.floor((index - 1) / 2);
    const currentItem = items[index];
    const parentItem = items[parentIndex];
    if (compare(currentItem as T, parentItem as T) >= 0) {
      break;
    }

    swapHeapItems(items, index, parentIndex);
    index = parentIndex;
  }

  return index;
}

/**
 * Restores heap order by moving an item downward.
 *
 * @internal
 * @template T - The heap item type.
 * @param items - The heap array.
 * @param startIndex - The index to sift down.
 * @param compare - The heap comparator.
 * @returns The final item index.
 */
function siftDown<T>(items: T[], startIndex: number, compare: HeapCompare<T>): number {
  let index = startIndex;

  while (true) {
    const leftChildIndex = index * 2 + 1;
    const rightChildIndex = leftChildIndex + 1;
    let nextIndex = index;

    if (leftChildIndex < items.length && compare(items[leftChildIndex] as T, items[nextIndex] as T) < 0) {
      nextIndex = leftChildIndex;
    }

    if (rightChildIndex < items.length && compare(items[rightChildIndex] as T, items[nextIndex] as T) < 0) {
      nextIndex = rightChildIndex;
    }

    if (nextIndex === index) {
      break;
    }

    swapHeapItems(items, index, nextIndex);
    index = nextIndex;
  }

  return index;
}

/**
 * Builds a heap in-place from an existing item array.
 *
 * @internal
 * @template T - The heap item type.
 * @param items - The array to heapify.
 * @param compare - The heap comparator.
 * @returns Nothing.
 */
function heapify<T>(items: T[], compare: HeapCompare<T>): void {
  for (let index = Math.floor(items.length / 2) - 1; index >= 0; index--) {
    siftDown(items, index, compare);
  }
}

/**
 * Creates a heap with custom ordering.
 *
 * @template T - The heap item type.
 * @param options - Heap creation options.
 * @returns A stateful heap API.
 *
 * @example
 * ```ts
 * import { createHeap } from 'std-kit';
 *
 * const jobs = createHeap({
 *   items: [
 *     { id: 'deploy', priority: 30 },
 *     { id: 'backup', priority: 10 },
 *     { id: 'reindex', priority: 20 },
 *   ],
 *   compare: (a, b) => a.priority - b.priority,
 * });
 *
 * jobs.pop();
 * // { id: 'backup', priority: 10 }
 * ```
 */
export function createHeap<T>(options: Readonly<HeapOptions<T>>): Heap<T> {
  const items = options.items ? [...options.items] : [];
  const { compare } = options;

  heapify(items, compare);

  return {
    get size(): number {
      return items.length;
    },
    clear(): void {
      items.length = 0;
    },
    isEmpty(): boolean {
      return items.length === 0;
    },
    peek(): T | undefined {
      return items[0];
    },
    push(item: T): number {
      items.push(item);
      siftUp(items, items.length - 1, compare);
      return items.length;
    },
    pop(): T | undefined {
      if (items.length === 0) {
        return undefined;
      }

      const top = items[0];
      const last = items.pop();
      if (items.length > 0 && last !== undefined) {
        items[0] = last;
        siftDown(items, 0, compare);
      }

      return top;
    },
    replace(item: T): T | undefined {
      if (items.length === 0) {
        items[0] = item;
        return undefined;
      }

      const top = items[0];
      items[0] = item;
      siftDown(items, 0, compare);
      return top;
    },
    pushPop(item: T): T {
      if (items.length === 0) {
        return item;
      }

      const topItem = items[0];
      if (compare(item, topItem as T) <= 0) {
        return item;
      }

      const top = items[0];
      items[0] = item;
      siftDown(items, 0, compare);
      return top as T;
    },
    toArray(): T[] {
      return [...items];
    },
  };
}

/**
 * Creates a min-heap for primitive or otherwise naturally comparable values.
 *
 * @template T - The heap item type.
 * @param options - Optional initial items and comparator override.
 * @returns A min-heap instance.
 *
 * @example
 * ```ts
 * import { createMinHeap } from 'std-kit';
 *
 * const queue = createMinHeap<number>({ items: [8, 3, 5] });
 * queue.push(1);
 *
 * queue.pop();
 * // 1
 * ```
 */
export function createMinHeap<T>(options: Readonly<Partial<HeapOptions<T>>> = {}): Heap<T> {
  const compare = options.compare ?? createDefaultCompare<T>('min');
  return options.items !== undefined ? createHeap({ compare, items: options.items }) : createHeap({ compare });
}

/**
 * Creates a max-heap for primitive or otherwise naturally comparable values.
 *
 * @template T - The heap item type.
 * @param options - Optional initial items and comparator override.
 * @returns A max-heap instance.
 *
 * @example
 * ```ts
 * import { createMaxHeap } from 'std-kit';
 *
 * const scoreboard = createMaxHeap<number>({ items: [12, 42, 7] });
 * scoreboard.push(30);
 *
 * scoreboard.peek();
 * // 42
 * ```
 */
export function createMaxHeap<T>(options: Readonly<Partial<HeapOptions<T>>> = {}): Heap<T> {
  const compare = options.compare ?? createDefaultCompare<T>('max');
  return options.items !== undefined ? createHeap({ compare, items: options.items }) : createHeap({ compare });
}
