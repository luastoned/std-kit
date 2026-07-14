# array

[← Back to std-kit](../../README.md)

---

## Functions

- `cartesian<T = unknown>(items: readonly T[][]): T[][]`
- `chunk<T>(array: readonly T[], size: number = 2): T[][]`
- `combinations<T>(items: readonly T[], options: Readonly<CombinationsOptions> = {}): T[][]`
- `compact<T>(array: readonly T[]): Exclude<T, Falsy>[]`
- `countBy<T, K extends PropertyKey>(array: readonly T[], key: (item: T) => K): Record<K, number>`
- `fill<T>(size: number, value: T): T[]`
- `flatten<T>(array: readonly unknown[], depth: number = Infinity): T[]`
- `groupBy<T, K extends PropertyKey>(array: readonly T[], key: (item: T) => K): Record<K, T[]>`
- `iterateCombinations<T>(items: readonly T[]): IterableIterator<T[]>`
- `orderBy<T, InPlace extends boolean = false>(array: readonly T[] & (true extends InPlace ? T[] : unknown), keys: readonly OrderSelector<T>[], orders: readonly ("asc" | "desc")[], inPlace?: InPlace): T[]`
- `reverse<T, InPlace extends boolean = false>(array: readonly T[] & (true extends InPlace ? T[] : unknown), inPlace?: InPlace): T[]`
- `shuffle<T, InPlace extends boolean = false>(array: readonly T[] & (true extends InPlace ? T[] : unknown), inPlace?: InPlace): T[]`
- `unique<T>(array: readonly T[]): T[]`
- `uniqueBy<T, K extends PropertyKey>(array: readonly T[], key: (item: T) => K): T[]`

## Types

- `interface CombinationsOptions`
- `type Falsy = false | 0 | 0n | '' | null | undefined`
- `type KeyableProperty<T> = { [P in keyof T]-?: T[P] extends PropertyKey ? P : never }[keyof T]`
- `type KeySelector<T, K extends PropertyKey = PropertyKey> = { [P in keyof T]-?: T[P] extends K ? P : never }[keyof T] | ((item: T) => K)`
- `type OrderSelector<T> = keyof T | ((item: T) => string | number | null | undefined)`

---

## CombinationsOptions

```typescript
interface CombinationsOptions {
  readonly maxResults?: number;
}
```

Options for eagerly collecting combinations.

---

## Falsy

```typescript
type Falsy = false | 0 | 0n | '' | null | undefined
```

Values removed by compact. `NaN` is also removed at runtime but cannot be represented as a distinct TypeScript type.

---

## KeyableProperty

```typescript
type KeyableProperty<T> = { [P in keyof T]-?: T[P] extends PropertyKey ? P : never }[keyof T]
```

Property names whose values can safely be used as record keys.

---

## KeySelector

```typescript
type KeySelector<T, K extends PropertyKey = PropertyKey> = { [P in keyof T]-?: T[P] extends K ? P : never }[keyof T] | ((item: T) => K)
```

Selects a record key from an array item.

---

## OrderSelector

```typescript
type OrderSelector<T> = keyof T | ((item: T) => string | number | null | undefined)
```

Selects a directly orderable value from an array item.

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
combinations<T>(items: readonly T[], options: Readonly<CombinationsOptions> = {}): T[][]
```

Collects all possible non-empty combinations of the elements in an array.


**Returns:** An array of arrays representing the combinations.


**Throws:** RangeError if `maxResults` is invalid or the result would exceed it.


---

## compact

```typescript
compact<T>(array: readonly T[]): Exclude<T, Falsy>[]
```

Returns a new array with all falsy values removed. Falsy values include: false, null, 0, "", undefined, and NaN.


**Returns:** A new array with only truthy values. Literal falsy members are excluded from the element type.


---

## countBy

```typescript
countBy<T, K extends PropertyKey>(array: readonly T[], key: (item: T) => K): Record<K, number>
countBy<T, P extends string | number | symbol>(array: readonly T[], key: P): Record<Extract<T[P], PropertyKey>, number>
```

Counts the occurrences of each unique key in an array. If a key function is provided, it will be used to extract the key from each element. If a key property
is provided, it will be used to extract the key from each element.


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
groupBy<T, K extends PropertyKey>(array: readonly T[], key: (item: T) => K): Record<K, T[]>
groupBy<T, P extends string | number | symbol>(array: readonly T[], key: P): Record<Extract<T[P], PropertyKey>, T[]>
```

Groups the elements of an array by a specified key. If a key function is provided, it will be used to extract the key from each element. If a key property is
provided, it will be used to extract the key from each element.


**Returns:** An object where the keys are the grouped values and the values are arrays of elements that belong to each group.


---

## iterateCombinations

```typescript
iterateCombinations<T>(items: readonly T[]): IterableIterator<T[]>
```

Lazily generates all possible non-empty combinations of the elements in an array.


**Returns:** An iterable iterator of combinations.


---

## orderBy

```typescript
orderBy<T, InPlace extends boolean = false>(array: readonly T[] & (true extends InPlace ? T[] : unknown), keys: readonly OrderSelector<T>[], orders: readonly ("asc" | "desc")[], inPlace?: InPlace): T[]
```

Sorts an array of objects based on the specified keys and orders. If a key function is provided, it will be used to extract the key from each element. If a
key property is provided, it will be used to extract the key from each element.


**Returns:** The sorted array.


---

## reverse

```typescript
reverse<T, InPlace extends boolean = false>(array: readonly T[] & (true extends InPlace ? T[] : unknown), inPlace?: InPlace): T[]
```

Reverses the elements of an array.


**Returns:** The reversed array.


---

## shuffle

```typescript
shuffle<T, InPlace extends boolean = false>(array: readonly T[] & (true extends InPlace ? T[] : unknown), inPlace?: InPlace): T[]
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
uniqueBy<T, K extends PropertyKey>(array: readonly T[], key: (item: T) => K): T[]
uniqueBy<T, P extends string | number | symbol>(array: readonly T[], key: P): T[]
```

Returns a new array containing unique elements from the input array based on the specified key. If a key function is provided, it will be used to extract the
key from each element. If a key property is provided, it will be used to extract the key from each element.


**Returns:** A new array containing unique elements based on the specified key.


---

