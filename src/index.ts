/**
 * `std-kit` public entrypoint.
 *
 * Small focused utilities for arrays, objects, promises, trees, heaps, and reusable TypeScript helpers.
 *
 * @example
 * ```ts
 * import { chunk, getValue, createMinHeap, flattenTree } from 'std-kit';
 *
 * const pages = chunk(['a', 'b', 'c', 'd'], 2);
 * // [['a', 'b'], ['c', 'd']]
 *
 * const settings = { ui: { theme: 'light' } };
 * const theme = getValue(settings, 'ui.theme', 'dark');
 * // 'light'
 *
 * const heap = createMinHeap<number>({ items: [5, 2, 9] });
 * heap.pop();
 * // 2
 *
 * const tree = {
 *   id: 'root',
 *   children: [{ id: 'a' }, { id: 'b', children: [{ id: 'b1' }] }],
 * };
 * flattenTree(tree).map((node) => node.id);
 * // ['root', 'a', 'b', 'b1']
 * ```
 */
export * from './natives/array';
export * from './natives/function';
export * from './natives/number';
export * from './natives/object';
export * from './natives/promise';
export * from './natives/timer';

export * from './structures/heap';
export * from './structures/tree';

export * from './utilities/generic';
export * from './utilities/guard';
export * from './utilities/types';
