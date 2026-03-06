# array

[← Back to std-kit](../../README.md)

---

## Functions

- `cluster<T>(array: readonly T[], size: number = 2): T[][]` ~~(deprecated)~~
- `cartesian<T = unknown>(items: readonly T[][]): T[][]`
- `chunk<T>(array: readonly T[], size: number = 2): T[][]`
- `combinations<T>(items: readonly T[]): T[][]`
- `compact<T>(array: readonly T[]): NonNullable<T>[]`
- `countBy<T, K>(array: readonly T[], key: K | ((item: T) => K)): Record<K, number>`
- `fill<T>(size: number, value: T): T[]`
- `flatten<T>(array: readonly unknown[], depth: number = Infinity): T[]`
- `groupBy<T, K>(array: readonly T[], key: K | ((item: T) => K)): Record<K, T[]>`
- `orderBy<T, K>(array: readonly T[], keys: readonly K | ((item: T) => K)[], orders: readonly "asc" | "desc"[], inPlace: boolean = false): T[]`
- `reverse<T>(array: readonly T[], inPlace: boolean = false): T[]`
- `shuffle<T>(array: readonly T[], inPlace: boolean = false): T[]`
- `unique<T>(array: readonly T[]): T[]`
- `uniqueBy<T, K>(array: readonly T[], key: K | ((item: T) => K)): T[]`

---

## cluster

```typescript
cluster<T>(array: readonly T[], size: number = 2): T[][]
```

Splits an array into chunks of a specified size.

> **Deprecated:** Use chunk instead.

- **Type Parameter T**: The type of the array elements.
- **array**: The array to be chunked.
- **size**: The size of each chunk.

**Returns:** An array of chunks.


---

## cartesian

```typescript
cartesian<T = unknown>(items: readonly T[][]): T[][]
```

Calculates the cartesian product of the given array of arrays.


**Returns:** The cartesian product as a 2D array.


---

## chunk

```typescript
chunk<T>(array: readonly T[], size: number = 2): T[][]
```

Splits an array into chunks of a specified size.


**Returns:** An array of chunks, each containing elements from the original array.


---

## combinations

```typescript
combinations<T>(items: readonly T[]): T[][]
```

Generates all possible non-empty combinations of the elements in an array.


**Returns:** An array of arrays representing the combinations.


---

## compact

```typescript
compact<T>(array: readonly T[]): NonNullable<T>[]
```

Returns a new array with all falsy values removed.
Falsy values include: false, null, 0, "", undefined, and NaN.


**Returns:** A new array with only truthy values.


---

## countBy

```typescript
countBy<T, K>(array: readonly T[], key: K | ((item: T) => K)): Record<K, number>
```

Counts the occurrences of each unique key in an array.
If a key function is provided, it will be used to extract the key from each element.
If a key property is provided, it will be used to extract the key from each element.


**Returns:** An object that maps each unique key to its count.


---

## fill

```typescript
fill<T>(size: number, value: T): T[]
```

Creates a new array of a specified size and fills it with the provided value.


**Returns:** An array of the specified size filled with the provided value.


---

## flatten

```typescript
flatten<T>(array: readonly unknown[], depth: number = Infinity): T[]
```

Flattens a nested array up to the specified depth.


**Returns:** The flattened array.


---

## groupBy

```typescript
groupBy<T, K>(array: readonly T[], key: K | ((item: T) => K)): Record<K, T[]>
```

Groups the elements of an array by a specified key.
If a key function is provided, it will be used to extract the key from each element.
If a key property is provided, it will be used to extract the key from each element.


**Returns:** An object where the keys are the grouped values and the values are arrays of elements that belong to each group.


---

## orderBy

```typescript
orderBy<T, K>(array: readonly T[], keys: readonly K | ((item: T) => K)[], orders: readonly "asc" | "desc"[], inPlace: boolean = false): T[]
```

Sorts an array of objects based on the specified keys and orders.
If a key function is provided, it will be used to extract the key from each element.
If a key property is provided, it will be used to extract the key from each element.


**Returns:** The sorted array.


---

## reverse

```typescript
reverse<T>(array: readonly T[], inPlace: boolean = false): T[]
```

Reverses the elements of an array.


**Returns:** The reversed array.


---

## shuffle

```typescript
shuffle<T>(array: readonly T[], inPlace: boolean = false): T[]
```

Shuffles the elements of an array using the Fisher-Yates algorithm.


**Returns:** The shuffled array.


---

## unique

```typescript
unique<T>(array: readonly T[]): T[]
```

Returns a new array with unique elements from the input array.


**Returns:** A new array with unique elements.


---

## uniqueBy

```typescript
uniqueBy<T, K>(array: readonly T[], key: K | ((item: T) => K)): T[]
```

Returns a new array containing unique elements from the input array based on the specified key.
If a key function is provided, it will be used to extract the key from each element.
If a key property is provided, it will be used to extract the key from each element.


**Returns:** A new array containing unique elements based on the specified key.


---

