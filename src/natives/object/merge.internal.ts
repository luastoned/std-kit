import type { PlainObject } from '~/utilities/types';
import { isArray, isPlainObject } from '~/utilities/generic';

/**
 * Strategy used to merge arrays while deep-merging objects.
 * @internal
 */
export type MergeArrayStrategy = boolean | string | ((item: unknown, index: number) => unknown);

/**
 * Public-facing `mergeObject` options shape.
 * @internal
 */
export interface MergeObjectOptions {
  strict?: boolean;
  immutable?: boolean;
  mergeArrays?: MergeArrayStrategy;
  applyUndefined?: boolean;
}

/**
 * Fully normalized runtime merge options.
 * @internal
 */
export interface MergeRuntimeOptions {
  strict: boolean;
  immutable: boolean;
  mergeArrays: MergeArrayStrategy;
  applyUndefined: boolean;
}

/**
 * Merge callback used for nested plain objects.
 * @internal
 */
type PlainObjectMergeFn = (src: PlainObject, patch: PlainObject, isStrictAtThisLevel: boolean) => PlainObject;

/**
 * Creates a shallow copy for plain objects and returns non-objects as-is.
 * @internal
 * @param value - Value to clone when needed.
 * @returns A shallow-cloned plain object or original value.
 */
const clonePlainObjectIfNeeded = (value: unknown): unknown => (isPlainObject(value) ? { ...value } : value);

/**
 * Normalizes merge options with defaults.
 * @internal
 * @param options - Raw merge options.
 * @returns Normalized merge options.
 */
export const normalizeMergeOptions = (options: Readonly<MergeObjectOptions> = {}): MergeRuntimeOptions => {
  const { immutable = true, mergeArrays = true, applyUndefined = false, strict = false } = options;
  return { immutable, mergeArrays, applyUndefined, strict };
};

/**
 * Merges object-arrays by key matching.
 * @internal
 * @param srcArray - Source array.
 * @param patchArray - Patch array.
 * @param strict - Whether strict mode is enabled.
 * @param getKey - Key extraction callback.
 * @param mergeObjectEntries - Object merge callback.
 * @returns Merged array value.
 */
const mergeArraysByKey = (
  srcArray: readonly unknown[],
  patchArray: readonly unknown[],
  strict: boolean,
  getKey: (item: unknown, idx: number) => unknown,
  mergeObjectEntries: (src: PlainObject, patch: PlainObject) => PlainObject,
): unknown[] => {
  const srcMap = new Map<unknown, unknown>();
  const srcItemsWithoutKey: unknown[] = [];

  for (let idx = 0; idx < srcArray.length; idx++) {
    const srcItem = srcArray[idx];
    if (isPlainObject(srcItem)) {
      const key = getKey(srcItem, idx);
      if (key !== undefined && key !== null) {
        srcMap.set(key, srcItem);
      } else {
        srcItemsWithoutKey.push(srcItem);
      }
    } else {
      srcItemsWithoutKey.push(srcItem);
    }
  }

  const mergedArray: unknown[] = [];
  const usedKeys = new Set<unknown>();

  for (let idx = 0; idx < patchArray.length; idx++) {
    const patchItem = patchArray[idx];
    if (isPlainObject(patchItem)) {
      const key = getKey(patchItem, idx);
      if (key !== undefined && key !== null && srcMap.has(key)) {
        const srcItem = srcMap.get(key) as PlainObject;
        mergedArray.push(mergeObjectEntries(srcItem, patchItem as PlainObject));
        usedKeys.add(key);
      } else if (!strict) {
        mergedArray.push(clonePlainObjectIfNeeded(patchItem));
      }
      continue;
    }

    mergedArray.push(patchItem);
  }

  for (let idx = 0; idx < srcArray.length; idx++) {
    const srcItem = srcArray[idx];
    if (!isPlainObject(srcItem)) {
      continue;
    }

    const key = getKey(srcItem, idx);
    if (key !== undefined && key !== null && !usedKeys.has(key)) {
      mergedArray.push(srcItem);
    }
  }

  mergedArray.push(...srcItemsWithoutKey);
  return mergedArray;
};

/**
 * Merges arrays index-by-index.
 * @internal
 * @param srcArray - Source array.
 * @param patchArray - Patch array.
 * @param strict - Whether strict mode is enabled.
 * @param mergeObjectEntries - Object merge callback.
 * @returns Merged array value.
 */
const mergeArraysByIndex = (
  srcArray: readonly unknown[],
  patchArray: readonly unknown[],
  strict: boolean,
  mergeObjectEntries: (src: PlainObject, patch: PlainObject) => PlainObject,
): unknown[] => {
  const maxLength = Math.max(srcArray.length, patchArray.length);
  const mergedArray: unknown[] = [];

  for (let idx = 0; idx < maxLength; idx++) {
    if (idx < patchArray.length) {
      const patchItem = patchArray[idx];
      const srcItem = idx < srcArray.length ? srcArray[idx] : undefined;

      if (isPlainObject(patchItem)) {
        if (isPlainObject(srcItem)) {
          mergedArray.push(mergeObjectEntries(srcItem as PlainObject, patchItem as PlainObject));
        } else if (!strict || idx < srcArray.length) {
          mergedArray.push(clonePlainObjectIfNeeded(patchItem));
        }
      } else {
        mergedArray.push(patchItem);
      }
    } else {
      mergedArray.push(srcArray[idx]);
    }
  }

  return mergedArray;
};

/**
 * Merges arrays according to the configured strategy.
 * @internal
 * @param srcValue - Source value.
 * @param patchValue - Patch array.
 * @param mergeArrays - Merge strategy option.
 * @param strict - Whether strict mode is enabled.
 * @param mergeObjectEntries - Object merge callback.
 * @returns Merged array value.
 */
const mergeArraysWithStrategy = (
  srcValue: unknown,
  patchValue: readonly unknown[],
  mergeArrays: MergeArrayStrategy,
  strict: boolean,
  mergeObjectEntries: (src: PlainObject, patch: PlainObject) => PlainObject,
): unknown[] => {
  if (!mergeArrays || !isArray(srcValue) || patchValue.length === 0) {
    return [...patchValue];
  }

  const hasObjectEntries = patchValue.some((item) => isPlainObject(item));
  if (!hasObjectEntries) {
    return [...patchValue];
  }

  if (typeof mergeArrays === 'string' || typeof mergeArrays === 'function') {
    const getKey =
      typeof mergeArrays === 'string'
        ? (item: unknown, _idx: number): unknown => (isPlainObject(item) ? (item as PlainObject)[mergeArrays] : undefined)
        : mergeArrays;

    return mergeArraysByKey(srcValue as readonly unknown[], patchValue, strict, getKey, mergeObjectEntries);
  }

  return mergeArraysByIndex(srcValue as readonly unknown[], patchValue, strict, mergeObjectEntries);
};

/**
 * Merges plain-object entries recursively.
 * @internal
 * @param args - Merge arguments.
 * @param args.src - Source object.
 * @param args.patch - Patch object.
 * @param args.options - Runtime options.
 * @param args.isStrictAtThisLevel - Strict mode for current object level.
 * @param args.mergeNested - Nested object merge callback.
 * @returns Merged plain object.
 */
export const mergePlainObjects = (args: {
  src: PlainObject;
  patch: PlainObject;
  options: Readonly<MergeRuntimeOptions>;
  isStrictAtThisLevel: boolean;
  mergeNested: PlainObjectMergeFn;
}): PlainObject => {
  const { src, patch, options, isStrictAtThisLevel, mergeNested } = args;
  const target = options.immutable ? { ...src } : src;

  for (const [key, patchValue] of Object.entries(patch)) {
    if (isStrictAtThisLevel && !(key in target)) {
      continue;
    }

    const srcValue = target[key];

    if (isPlainObject(patchValue)) {
      if (!isPlainObject(srcValue)) {
        target[key] = {};
      }

      target[key] = mergeNested(target[key] as PlainObject, patchValue as PlainObject, isStrictAtThisLevel);
      continue;
    }

    if (isArray(patchValue)) {
      target[key] = mergeArraysWithStrategy(srcValue, patchValue, options.mergeArrays, options.strict, (srcItem, patchItem) =>
        mergeNested(srcItem, patchItem, false),
      );
      continue;
    }

    if (patchValue !== undefined || options.applyUndefined) {
      target[key] = patchValue;
    }
  }

  return target;
};
