import { isArray, isObject } from './generic';

export type DFPredicate = (value: any, key: string, parent: object | []) => boolean;
export type DFOptions = { path?: boolean; seperator?: string };
export type DFReducerEntry = [string, any, DFPredicate, string[], object | []];
export type DFReducerReturn = [string[], any][];

export const mergeObject = (target: any, source: any) => {
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
  deepFilterEntries(obj, filter).map(([path, value]) => (options.path ? [path.join(options.seperator ?? '.'), value] : value));
