/**
 * Clamps a value between a specified range.
 *
 * @param value - The value to be clamped.
 * @param rangeA - The first value of the range.
 * @param rangeB - The second value of the range.
 * @returns The clamped value.
 */
export const clamp = (value: number, rangeA: number, rangeB: number): number => Math.max(Math.min(value, Math.max(rangeA, rangeB)), Math.min(rangeA, rangeB));

/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param value - The number to round.
 * @param decimals - The number of decimal places to round to. Default is 2.
 * @returns The rounded number.
 */
export const roundTo = (value: number, decimals = 2): number => Math.round(value * 10 ** decimals) / 10 ** decimals;

/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 *
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns A random integer between the minimum and maximum values.
 */
export const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Generates a random number between the specified minimum and maximum values.
 *
 * @param min - The minimum value of the range (inclusive).
 * @param max - The maximum value of the range (exclusive).
 * @returns A random number between the minimum and maximum values.
 */
export const randomNum = (min: number, max: number): number => Math.random() * (max - min) + min;

/**
 * Converts degrees to radians.
 * @param degrees The number of degrees to convert.
 * @returns The equivalent value in radians.
 */
export const deg2rad = (degrees: number): number => degrees * (Math.PI / 180);

/**
 * Converts radians to degrees.
 * @param radians The value in radians to be converted.
 * @returns The value in degrees.
 */
export const rad2deg = (radians: number): number => radians * (180 / Math.PI);

/**
 * Generates an array of numbers within a specified range.
 *
 * @param start - The starting number of the range.
 * @param end - The ending number of the range.
 * @param step - The increment value between numbers in the range. Default is 1.
 * @returns An array of numbers within the specified range.
 */
export const range = (start: number, end: number, step = 1): number[] =>
  Array.from(Array(Math.floor((end - start + 1) / step)).keys()).map((num) => start + num * step);

/**
 * Calculates the sum of an array of numbers.
 *
 * @param values - An array of numbers.
 * @returns The sum of the numbers in the array.
 */
export const sum = (values: number[]): number => values.reduce((acc, cur) => acc + cur, 0);

/**
 * Calculates the mean of an array of numbers.
 *
 * @param values - The array of numbers.
 * @returns The mean value of the numbers.
 */
export const mean = (values: number[]): number => (values.length === 0 ? 0 : sum(values) / values.length);
