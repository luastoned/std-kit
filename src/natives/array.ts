import { isArray } from './generic';

export const unique = <T>(array: T[]) => Array.from(new Set(array)); // array.filter((obj, idx, nodes) => nodes.indexOf(obj) === idx);

export const uniqueFilter = <T>(array: T[], mapFn: (obj: T) => string) => {
  const map = new Map<string, T>();
  for (const obj of array) {
    map.set(mapFn(obj), obj);
  }

  return Array.from(map.values());
};

// export const groupBy = <T extends Record<string, any>>(array: T[], key: string) => {
//   return array.reduce((acc, obj) => {
//     acc[obj[key]] = acc[obj[key]] || [];
//     acc[obj[key]].push(obj);
//     return acc;
//   }, {} as Record<string, T[]>);
// };

export const groupBy = <T extends Record<string, unknown>>(array: T[], key: string | Function): Record<string, T[]> => {
  const keyFn = typeof key === 'function' ? key : (obj: T) => obj[key];
  return array.reduce((acc, obj) => {
    acc[keyFn(obj)] = acc[keyFn(obj)] || [];
    acc[keyFn(obj)].push(obj);
    return acc;
  }, {} as Record<string, T[]>);
};

export const reverse = <T>(array: T[]) => [...array].reverse();

export const shuffle = <T>(array: T[]) => array.sort(() => Math.random() - 0.5);

export const flatten = <T extends T[]>(array: T[]): T[] => array.reduce((acc, obj) => acc.concat(isArray(obj) ? flatten(obj) : obj), [] as T[]);

export const transpose = (matrix: any[][]) => {
  const rows = matrix.length;
  const cols = matrix[0].length;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < row; col++) {
      [matrix[row][col], matrix[col][row]] = [matrix[col][row], matrix[row][col]];
    }
  }

  return matrix[0].map((col, colIdx) => matrix.map((row) => row[colIdx]).reverse());
};

const compose = (a: <T>(matrix: T[][]) => T[][], b: <T>(matrix: T[][]) => T[][]) => (matrix: any[][]) => a(b(matrix));

export const flipMatrix = (matrix: any[][]) => matrix[0].map((column, index) => matrix.map((row) => row[index]));
export const rotateMatrix = compose(flipMatrix, reverse);
export const flipMatrixCounterClockwise = compose(reverse, rotateMatrix);
export const rotateMatrixCounterClockwise = compose(reverse, flipMatrix);

export const cartesianProduct = <T extends any[][]>(...a: [...T]): Array<{ [K in keyof T]: T[K][number] }> =>
  a.reduce((a, b) => a.flatMap((d) => b.map((e) => [d, e].flat())));

const cartesianProduct2 = <T>(...sets: T[][]) =>
  sets.reduce<T[][]>((accSets, set) => accSets.flatMap((accSet) => set.map((value) => [...accSet, value])), [[]]);

export const cartesianProduct1 = <T>(...allEntries: T[][]): T[][] => {
  return allEntries.reduce<T[][]>(
    (results, entries) => results.map((result) => entries.map((entry) => result.concat([entry]))).reduce((subResults, result) => subResults.concat(result), []),
    [[]],
  );
};
