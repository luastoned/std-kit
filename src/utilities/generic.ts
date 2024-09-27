/**
 * Checks if the given item is an array.
 *
 * @param item - The item to check.
 * @returns `true` if the item is an array, `false` otherwise.
 */
export const isArray = <T = unknown>(item: unknown): item is T[] | readonly T[] => typeof item === 'object' && Array.isArray(item);

/**
 * Checks if the given item is a boolean.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a boolean, `false` otherwise.
 */
export const isBoolean = (item: unknown): item is boolean => typeof item === 'boolean';

/**
 * Checks if the given item is a Date object.
 *
 * @param item The item to check.
 * @returns `true` if the item is a Date object, `false` otherwise.
 */
export const isDate = (item: unknown): item is Date => item instanceof Date;

/**
 * Checks if the given item is defined.
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is defined or not.
 */
export const isDefined = (item: unknown): boolean => item !== undefined;

/**
 * Checks if the given item is an instance of the Error class.
 *
 * @param item - The item to check.
 * @returns `true` if the item is an instance of Error, `false` otherwise.
 */
export const isError = (item: unknown): item is Error => item instanceof Error;

/**
 * Checks if the given item is a function.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a function, `false` otherwise.
 */
// biome-ignore lint/complexity/noBannedTypes: Allow Function for Type
export const isFunction = (item: unknown): item is Function => typeof item === 'function';

/**
 * Checks if the given item is an infinity number.
 * @param item - The item to be checked.
 * @returns A boolean indicating whether the item is an infinity number.
 */
export const isInfinity = (item: unknown): item is number => item === Number.POSITIVE_INFINITY || item === Number.NEGATIVE_INFINITY;

/**
 * Checks if the given item is null.
 *
 * @param item The item to check.
 * @returns `true` if the item is null, `false` otherwise.
 */
export const isNull = (item: unknown): item is null => item === null;

/**
 * Checks if the given item is a number.
 *
 * @param item - The item to be checked.
 * @returns `true` if the item is a number, `false` otherwise.
 */
export const isNumber = (item: unknown): item is number => typeof item === 'number' && Number.isFinite(item);

/**
 * Checks if the given item is an object.
 *
 * @param item - The item to check.
 * @returns `true` if the item is an object, `false` otherwise.
 */
export const isObject = (item: unknown): item is object => typeof item === 'object' && !Array.isArray(item) && item !== null;

/**
 * Checks if the given item is a plain object.
 *
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is a plain object.
 */
export const isPlainObject = (item: unknown): item is Record<PropertyKey, unknown> => isObject(item) && item.constructor === Object;

/**
 * Checks if the given item is a regular expression.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a regular expression, `false` otherwise.
 */
export const isRegExp = (item: unknown): item is RegExp => item instanceof RegExp;

/**
 * Checks if the given item is a string.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a string, `false` otherwise.
 */
export const isString = (item: unknown): item is string => typeof item === 'string';

/**
 * Checks if the given item is a symbol.
 *
 * @param item - The item to check.
 * @returns `true` if the item is a symbol, `false` otherwise.
 */
export const isSymbol = (item: unknown): item is symbol => typeof item === 'symbol';

/**
 * Checks if the given item is undefined.
 *
 * @param item - The item to check.
 * @returns A boolean indicating whether the item is undefined or not.
 */
export const isUndefined = (item: unknown): item is undefined => item === undefined;

/**
 * Creates a deep clone of an item.
 *
 * @param item - The item to clone.
 * @returns The cloned item.
 */
export const cloneObject = <T>(item: T): T => (item !== undefined ? JSON.parse(JSON.stringify(item)) : undefined);
