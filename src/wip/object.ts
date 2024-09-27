export type DFPredicate = (value: any, key: string, parent: object | []) => boolean;
export type DFOptions = { path?: boolean; separator?: string };
export type DFReducerEntry = [string, any, DFPredicate, string[], object | []];
export type DFReducerReturn = [string[], any][];

const deepFilterReducer = (accumulator: DFReducerReturn, entry: DFReducerEntry) => {
  const [key, value, filter, path, parent] = entry;
  if (filter(value, key, parent)) accumulator.push([path, value]);
  if (isArray(value) || isObject(value)) accumulator = accumulator.concat(deepFilterEntries(value, filter, path));
  return accumulator;
};

const deepFilterEntries = (obj: object | [], filter: DFPredicate, path: string[] = []) =>
  Object.entries(obj)
    .map<DFReducerEntry>(([key, value]) => [key, value, filter, path.concat(key), obj])
    .reduce(deepFilterReducer, []);

export const filterObject = <T>(obj: object | [], filter: DFPredicate, options: DFOptions = {}): T[] =>
  deepFilterEntries(obj, filter).map(([path, value]) => (options.path ? [path.join(options.separator ?? '.'), value] : value));

const deepFilterReducer1 = (accumulator: DFReducerReturn, [key, value, filter, path, parent]: DFReducerEntry): DFReducerReturn => {
  if (filter(value, key, parent)) accumulator.push([path, value]);
  if (isArray(value) || isPlainObject(value)) accumulator.push(...deepFilterEntries(value, filter, path));

  return accumulator;
};

const deepFilterEntries1 = (obj: object | any[], filter: DFPredicate, path: string[] = []): DFReducerReturn =>
  Object.entries(obj)
    .map<DFReducerEntry>(([key, value]) => [key, value, filter, path.concat(key), obj])
    .reduce(deepFilterReducer1, []);

export const filterObject1 = <T>(obj: object | any[], filter: DFPredicate, options: DFOptions = {}): T[] =>
  deepFilterEntries1(obj, filter).map(([path, value]) => (options.path ? ([path.join(options.separator ?? '.'), value] as any) : value));

const processEntry2 = (accumulator: DFReducerReturn, key: string, value: any, filter: DFPredicate, path: string[], parent: any): void => {
  const newPath = path.concat(key);
  if (filter(value, key, parent)) {
    accumulator.push([newPath, value]);
  }

  if (Array.isArray(value) || isPlainObject(value)) {
    deepFilterEntries2(value, filter, newPath, accumulator);
  }
};

const deepFilterEntries2 = (obj: object | any[], filter: DFPredicate, path: string[] = [], accumulator: DFReducerReturn = []): DFReducerReturn => {
  for (const [key, value] of Object.entries(obj)) {
    processEntry2(accumulator, key, value, filter, path, obj);
  }
  return accumulator;
};

export const filterObject2 = <T>(obj: object | any[], filter: DFPredicate, options: DFOptions = {}): T[] => {
  const filteredEntries = deepFilterEntries2(obj, filter);
  return filteredEntries.map(([path, value]) => (options.path ? ([path.join(options.separator ?? '.'), value] as any) : value));
};

// ts-deepmerge, deepmerge-ts

// The only way to make the object functions work with interfaces is to broaden the type with `any`.

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
 // eslint-disable-line @typescript-eslint/no-explicit-any

export type ArrayMinLength<TElem, TMinLength extends number> = BuildArrayMinLength<TElem, TMinLength, []>;

type BuildArrayMinLength<TElem, TMinLength extends number, Current extends TElem[]> = Current['length'] extends TMinLength
  ? [...Current, ...TElem[]]
  : BuildArrayMinLength<TElem, TMinLength, [...Current, TElem]>;

export const merge = <TTarget extends GenericObject, TSources extends ArrayMinLength<GenericObject, 1>>(
  target: TTarget,
  ...sources: TSources
): MergeDeepObjects<[TTarget, ...TSources]> => {
  const targetCopy = { ...target };
  for (const source of sources) {
    for (const [key, value] of Object.entries(source)) {
      (targetCopy as PlainObject)[key] = isPlainObject(value) && isPlainObject(targetCopy[key]) ? merge(targetCopy[key], value) : value;
    }
  }
  return targetCopy as MergeDeepObjects<[TTarget, ...TSources]>;
};

type OptionalPropertyNames<T> = { [K in keyof T]-?: PlainObject extends { [P in K]: T[K] } ? K : never }[keyof T];

type SpreadProperties<L, R, K extends keyof L & keyof R> = { [P in K]: L[P] | Exclude<R[P], undefined> };

type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

type SpreadTwo<L, R> = Id<
  Pick<L, Exclude<keyof L, keyof R>> &
    Pick<R, Exclude<keyof R, OptionalPropertyNames<R>>> &
    Pick<R, Exclude<OptionalPropertyNames<R>, keyof L>> &
    SpreadProperties<L, R, OptionalPropertyNames<R> & keyof L>
>;

type MergeDeepObjects<A extends readonly [...unknown[]]> = A extends [infer L, ...infer R] ? SpreadTwo<L, MergeDeepObjects<R>> : unknown;

export const mergeObject = (target: GenericObject, source: GenericObject) => {
  if (!isObject(target) || !isObject(source)) {
    return source;
  }

  for (const key of Object.keys(source)) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (isArray(targetValue) && isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue);
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeObject(Object.assign({}, targetValue), sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }

  return target;
};
