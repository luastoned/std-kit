# number

[← Back to std-kit](../../README.md)

---

## Functions

- `clamp(value: number, rangeA: number, rangeB: number): number`
- `deg2rad(degrees: number): number`
- `lerp(from: number, to: number, t: number): number`
- `mean(values: readonly number[]): number`
- `rad2deg(radians: number): number`
- `randomInt(min: number, max: number): number`
- `randomNum(min: number, max: number): number`
- `range(start: number, end: number, step: number = 1): readonly number[]`
- `roundTo(value: number, decimals: number = 2): number`
- `sum(values: readonly number[]): number`

---

## clamp

```typescript
clamp(value: number, rangeA: number, rangeB: number): number
```

Clamps a value between a specified range.


**Returns:** The clamped value.


---

## deg2rad

```typescript
deg2rad(degrees: number): number
```

Converts degrees to radians.


**Returns:** The equivalent value in radians.


---

## lerp

```typescript
lerp(from: number, to: number, t: number): number
```

Linearly interpolates between two numbers.


**Returns:** The interpolated value.


---

## mean

```typescript
mean(values: readonly number[]): number
```

Calculates the mean of an array of numbers.


**Returns:** The mean value of the numbers.


---

## rad2deg

```typescript
rad2deg(radians: number): number
```

Converts radians to degrees.


**Returns:** The value in degrees.


---

## randomInt

```typescript
randomInt(min: number, max: number): number
```

Generates a random integer between the specified minimum and maximum values (inclusive).

Fractional bounds are normalized inward so every possible result is an integer contained by the original bounds.


**Returns:** A random integer between the minimum and maximum values.


**Throws:** When the bounds are non-finite or contain no integer.


---

## randomNum

```typescript
randomNum(min: number, max: number): number
```

Generates a random number between the specified minimum and maximum values.


**Returns:** A random number between the minimum and maximum values.


**Throws:** RangeError if either bound is non-finite.


---

## range

```typescript
range(start: number, end: number, step: number = 1): readonly number[]
```

Generates an array of numbers within a specified range.


**Returns:** A readonly array of numbers within the specified range.


**Throws:** RangeError if either endpoint is non-finite or the resulting array exceeds the maximum JavaScript array length.


---

## roundTo

```typescript
roundTo(value: number, decimals: number = 2): number
```

Rounds a number to the specified number of decimal places using JavaScript floating-point arithmetic.
Non-finite inputs are preserved. Results outside the finite number range become infinity.


**Returns:** The rounded number.


**Throws:** RangeError if `decimals` is not an integer between -308 and 308.


---

## sum

```typescript
sum(values: readonly number[]): number
```

Calculates the sum of an array of numbers.


**Returns:** The sum of the numbers in the array.


---

