import { describe, it, expect, vi } from 'vitest';

import { clamp, roundTo, randomInt, randomNum, deg2rad, rad2deg, range, sum, mean, lerp } from './number';

describe('math utils', () => {
  it('clamps value within bounds', () => {
    expect(clamp(5, 1, 10)).toBe(5);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(5, 10, 0)).toBe(5); // handles reversed bounds
  });

  it('rounds to correct decimal places', () => {
    expect(roundTo(1.2345)).toBe(1.23);
    expect(roundTo(1.2355)).toBe(1.24);
    expect(roundTo(1.2345, 3)).toBe(1.235);
    expect(roundTo(1.2, 0)).toBe(1);
    expect(roundTo(1234, -2)).toBe(1200);
  });

  it.each([1.5, Number.POSITIVE_INFINITY, 309, -309])('rejects an invalid decimal count of %s', (decimals) => {
    expect(() => roundTo(1.23, decimals)).toThrow('roundTo decimals must be an integer between -308 and 308.');
  });

  it('generates random integer in inclusive range', () => {
    for (let idx = 0; idx < 100; idx++) {
      const num = randomInt(5, 10);
      expect(num).toBeGreaterThanOrEqual(5);
      expect(num).toBeLessThanOrEqual(10);
      expect(Number.isInteger(num)).toBe(true);
    }
  });

  it('generates random integer in reversed inclusive range', () => {
    for (let idx = 0; idx < 100; idx++) {
      const num = randomInt(10, 5);
      expect(num).toBeGreaterThanOrEqual(5);
      expect(num).toBeLessThanOrEqual(10);
      expect(Number.isInteger(num)).toBe(true);
    }
  });

  it('normalizes fractional random integer bounds', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.999999);

    expect(randomInt(1.2, 3.8)).toBe(2);
    expect(randomInt(1.2, 3.8)).toBe(3);
    vi.restoreAllMocks();
  });

  it('rejects ranges with no finite integer', () => {
    expect(() => randomInt(1.2, 1.8)).toThrow(RangeError);
    expect(() => randomInt(0, Number.POSITIVE_INFINITY)).toThrow(RangeError);
  });

  it('returns finite integers when finite bounds have an overflowing span', () => {
    vi.spyOn(Math, 'random').mockReturnValueOnce(0).mockReturnValueOnce(0.75);

    expect(randomInt(-Number.MAX_VALUE, Number.MAX_VALUE)).toBe(-Number.MAX_VALUE);

    const result = randomInt(-Number.MAX_VALUE, Number.MAX_VALUE);
    expect(Number.isFinite(result)).toBe(true);
    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(-Number.MAX_VALUE);
    expect(result).toBeLessThanOrEqual(Number.MAX_VALUE);
    vi.restoreAllMocks();
  });

  it('generates random float in exclusive upper bound range', () => {
    for (let idx = 0; idx < 100; idx++) {
      const num = randomNum(5, 10);
      expect(num).toBeGreaterThanOrEqual(5);
      expect(num).toBeLessThan(10);
    }
  });

  it('generates random float in reversed exclusive upper bound range', () => {
    for (let idx = 0; idx < 100; idx++) {
      const num = randomNum(10, 5);
      expect(num).toBeGreaterThanOrEqual(5);
      expect(num).toBeLessThan(10);
    }
  });

  it('rejects non-finite random float bounds', () => {
    expect(() => randomNum(0, Number.POSITIVE_INFINITY)).toThrow('randomNum bounds must be finite numbers.');
    expect(() => randomNum(Number.NaN, 1)).toThrow('randomNum bounds must be finite numbers.');
  });

  it('converts degrees to radians', () => {
    expect(deg2rad(180)).toBeCloseTo(Math.PI);
    expect(deg2rad(90)).toBeCloseTo(Math.PI / 2);
    expect(deg2rad(0)).toBe(0);
  });

  it('converts radians to degrees', () => {
    expect(rad2deg(Math.PI)).toBeCloseTo(180);
    expect(rad2deg(Math.PI / 2)).toBeCloseTo(90);
    expect(rad2deg(0)).toBe(0);
  });

  it('generates range of numbers', () => {
    expect(range(1, 1)).toEqual([1]);
    expect(range(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10]);
    expect(range(5, 25, 5)).toEqual([5, 10, 15, 20, 25]);
  });

  it('generates descending ranges', () => {
    expect(range(5, 1)).toEqual([5, 4, 3, 2, 1]);
    expect(range(10, 0, 3)).toEqual([10, 7, 4, 1]);
  });

  it('clamps invalid step values to 1', () => {
    expect(range(1, 5, 0)).toEqual([1, 2, 3, 4, 5]); // step 0 clamped to 1
    expect(range(5, 1, 0)).toEqual([5, 4, 3, 2, 1]); // step 0 clamped to 1
    expect(range(1, 5, -2)).toEqual([1, 2, 3, 4, 5]); // negative step clamped to 1
    expect(range(1, 5, 0.5)).toEqual([1, 2, 3, 4, 5]); // fractional step clamped to 1
  });

  it('rejects non-finite endpoints and oversized results', () => {
    expect(() => range(0, Number.POSITIVE_INFINITY)).toThrow('range endpoints must be finite numbers.');
    expect(() => range(Number.NaN, 1)).toThrow('range endpoints must be finite numbers.');
    expect(() => range(0, 0xffff_ffff)).toThrow('range result exceeds the maximum JavaScript array length.');
  });

  it('calculates sum of numbers', () => {
    expect(sum([])).toBe(0);
    expect(sum([1, 2, 3])).toBe(6);
    expect(sum([-1, 2, -3])).toBe(-2);
  });

  it('calculates mean of numbers', () => {
    expect(mean([])).toBe(0);
    expect(mean([2, 4, 6])).toBe(4);
    expect(mean([-1, 1, 0])).toBe(0);
  });

  it('linearly interpolates between values', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(10, 20, 0)).toBe(10);
    expect(lerp(10, 20, 1)).toBe(20);
  });
});
