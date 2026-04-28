/**
 * Clamps a value between a specified range.
 *
 * @example
 *   ```ts
 *   import { clamp } from 'std-kit';
 *
 *   clamp(120, 0, 100);
 *   // 100
 *   ```;
 *
 * @param value - The value to be clamped.
 * @param rangeA - The first value of the range.
 * @param rangeB - The second value of the range.
 * @returns The clamped value.
 */
export function clamp(value: number, rangeA: number, rangeB: number): number {
  return Math.max(Math.min(value, Math.max(rangeA, rangeB)), Math.min(rangeA, rangeB));
}

/**
 * Rounds a number to the specified number of decimal places.
 *
 * @param value - The number to round.
 * @param decimals - The number of decimal places to round to. Default is 2.
 * @returns The rounded number.
 */
export function roundTo(value: number, decimals = 2): number {
  return Math.round(value * 10 ** decimals) / 10 ** decimals;
}

/**
 * Generates a random integer between the specified minimum and maximum values (inclusive).
 *
 * @param min - One bound of the range.
 * @param max - The other bound of the range.
 * @returns A random integer between the minimum and maximum values.
 */
export function randomInt(min: number, max: number): number {
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

/**
 * Generates a random number between the specified minimum and maximum values.
 *
 * @param min - One bound of the range.
 * @param max - The other bound of the range.
 * @returns A random number between the minimum and maximum values.
 */
export function randomNum(min: number, max: number): number {
  const lower = Math.min(min, max);
  const upper = Math.max(min, max);
  return Math.random() * (upper - lower) + lower;
}

/**
 * Converts degrees to radians.
 *
 * @param degrees - The number of degrees to convert.
 * @returns The equivalent value in radians.
 */
export function deg2rad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Converts radians to degrees.
 *
 * @param radians - The value in radians to be converted.
 * @returns The value in degrees.
 */
export function rad2deg(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Generates an array of numbers within a specified range.
 *
 * @example
 *   ```ts
 *   import { range } from 'std-kit';
 *
 *   range(2, 8, 2);
 *   // [2, 4, 6, 8]
 *
 *   range(5, 1);
 *   // [5, 4, 3, 2, 1]
 *   ```;
 *
 * @param start - The starting number of the range.
 * @param end - The ending number of the range.
 * @param step - The positive distance between numbers in the range. Default is 1. If not a positive integer, it will be clamped to 1.
 * @returns A readonly array of numbers within the specified range.
 */
export function range(start: number, end: number, step = 1): readonly number[] {
  const clampedStep = step <= 0 || !Number.isFinite(step) ? 1 : Math.max(1, Math.floor(step));
  const direction = start <= end ? 1 : -1;
  const length = Math.floor(Math.abs(end - start) / clampedStep) + 1;
  return Array.from({ length }, (_, i) => start + i * clampedStep * direction);
}

/**
 * Calculates the sum of an array of numbers.
 *
 * @param values - An array of numbers.
 * @returns The sum of the numbers in the array.
 */
export function sum(values: readonly number[]): number {
  return values.reduce((acc, cur) => acc + cur, 0);
}

/**
 * Calculates the mean of an array of numbers.
 *
 * @example
 *   ```ts
 *   import { mean } from 'std-kit';
 *
 *   mean([10, 20, 30]);
 *   // 20
 *   ```;
 *
 * @param values - The array of numbers.
 * @returns The mean value of the numbers.
 */
export function mean(values: readonly number[]): number {
  return values.length === 0 ? 0 : sum(values) / values.length;
}

/**
 * Linearly interpolates between two numbers.
 *
 * @param from - The starting value.
 * @param to - The ending value.
 * @param t - The interpolation factor.
 * @returns The interpolated value.
 */
export function lerp(from: number, to: number, t: number): number {
  return from + t * (to - from);
}
