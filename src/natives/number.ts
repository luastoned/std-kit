export const clamp = (num: number, min: number, max: number): number => Math.min(Math.max(min, num), max);

export const roundTo = (num: number, digits: number = 2): number => Math.round(num * Math.pow(10, digits)) / Math.pow(10, digits);

export const randomInt = (min: number, max: number): number => Math.floor(Math.random() * (max - min + 1)) + min;

export const deg2rad = (angle: number): number => angle * (Math.PI / 180);

export const rad2deg = (radians: number): number => radians * (180 / Math.PI);

export const range = (start: number, end: number, step: number = 1): number[] =>
  Array.from(Array(Math.floor((end - start + 1) / step)).keys()).map((num) => start + num * step);
