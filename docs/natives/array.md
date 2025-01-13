[**std-kit**](../README.md)

***

[std-kit](../modules.md) / natives/array

# natives/array

## Functions

### cartesian()

> **cartesian**\<`T`\>(`items`): `T`[][]

Defined in: [natives/array.ts:200](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/array.ts#L200)

Calculates the cartesian product of the given array of arrays.

#### Type Parameters

• **T**

#### Parameters

##### items

`T`[][]

The array of arrays to calculate the cartesian product from.

#### Returns

`T`[][]

The cartesian product as a 2D array.

***

### cluster()

> **cluster**\<`T`\>(`array`, `size`): `T`[][]

Defined in: [natives/array.ts:57](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/array.ts#L57)

Clusters an array into subarrays of a specified size.

#### Type Parameters

• **T**

#### Parameters

##### array

`T`[]

The array to be clustered.

##### size

`number` = `2`

The size of each subarray. Default is 2.

#### Returns

`T`[][]

An array of subarrays, each containing elements from the original array.

***

### combinations()

> **combinations**\<`T`\>(`items`): `T`[][]

Defined in: [natives/array.ts:209](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/array.ts#L209)

Generates all possible non-empty combinations of the elements in an array.

#### Type Parameters

• **T**

The type of the array elements.

#### Parameters

##### items

`T`[]

The array of elements.

#### Returns

`T`[][]

- An array of arrays representing the combinations.

***

### countBy()

> **countBy**\<`T`, `K`\>(`array`, `key`): `Record`\<`K`, `number`\>

Defined in: [natives/array.ts:77](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/array.ts#L77)

Counts the occurrences of each unique key in an array.
If a key function is provided, it will be used to extract the key from each element.
If a key property is provided, it will be used to extract the key from each element.

#### Type Parameters

• **T**

The type of elements in the array.

• **K** *extends* `PropertyKey`

The type of the key used for counting.

#### Parameters

##### array

`T`[]

The array to count the occurrences in.

##### key

The key used for counting. Can be a property name or a function that returns the key.

`K` | (`item`) => `K`

#### Returns

`Record`\<`K`, `number`\>

- An object that maps each unique key to its count.

***

### fill()

> **fill**\<`T`\>(`size`, `value`): `T`[]

Defined in: [natives/array.ts:48](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/array.ts#L48)

Creates a new array of a specified size and fills it with the provided value.

#### Type Parameters

• **T**

The type of elements in the array.

#### Parameters

##### size

`number`

The size of the array to create.

##### value

`T`

The value to fill the array with.

#### Returns

`T`[]

An array of the specified size filled with the provided value.

***

### flatten()

> **flatten**\<`T`\>(`array`): `T`[]

Defined in: [natives/array.ts:38](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/array.ts#L38)

Flattens a nested array of type T.

#### Type Parameters

• **T** *extends* `T`[]

#### Parameters

##### array

`T`[]

The array to flatten.

#### Returns

`T`[]

The flattened array.

***

### groupBy()

> **groupBy**\<`T`, `K`\>(`array`, `key`): `Record`\<`K`, `T`[]\>

Defined in: [natives/array.ts:97](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/array.ts#L97)

Groups the elements of an array by a specified key.
If a key function is provided, it will be used to extract the key from each element.
If a key property is provided, it will be used to extract the key from each element.

#### Type Parameters

• **T**

The type of the elements in the array.

• **K** *extends* `PropertyKey`

The type of the key used for grouping.

#### Parameters

##### array

`T`[]

The array to group.

##### key

The key used for grouping. Can be a property name or a function that returns the key.

`K` | (`item`) => `K`

#### Returns

`Record`\<`K`, `T`[]\>

- An object where the keys are the grouped values and the values are arrays of elements that belong to each group.

***

### orderBy()

> **orderBy**\<`T`, `K`\>(`array`, `keys`, `orders`, `inPlace`?): `T`[]

Defined in: [natives/array.ts:126](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/array.ts#L126)

Sorts an array of objects based on the specified keys and orders.
If a key function is provided, it will be used to extract the key from each element.
If a key property is provided, it will be used to extract the key from each element.

#### Type Parameters

• **T**

The type of the array elements.

• **K** *extends* `string` \| `number`

The type of the keys used for sorting.

#### Parameters

##### array

`T`[]

The array to be sorted.

##### keys

(`K` \| (`item`) => `K`)[]

The keys or functions used for sorting.

##### orders

(`"asc"` \| `"desc"`)[]

The sort orders for each key.

##### inPlace?

`boolean` = `false`

Indicates whether to sort the array in place or return a new sorted array.

#### Returns

`T`[]

- The sorted array.

***

### reverse()

> **reverse**\<`T`\>(`array`, `inPlace`?): `T`[]

Defined in: [natives/array.ts:20](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/array.ts#L20)

Reverses the elements of an array.

#### Type Parameters

• **T**

The type of elements in the array.

#### Parameters

##### array

`T`[]

The array to be reversed.

##### inPlace?

`boolean` = `false`

Specifies whether to reverse the array in place or create a new reversed array.

#### Returns

`T`[]

- The reversed array.

***

### shuffle()

> **shuffle**\<`T`\>(`array`, `inPlace`?): `T`[]

Defined in: [natives/array.ts:30](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/array.ts#L30)

Shuffles the elements of an array.

#### Type Parameters

• **T**

The type of elements in the array.

#### Parameters

##### array

`T`[]

The array to shuffle.

##### inPlace?

`boolean` = `false`

Specifies whether to shuffle the array in place or create a new shuffled array.

#### Returns

`T`[]

The shuffled array.

***

### unique()

> **unique**\<`T`\>(`array`): `T`[]

Defined in: [natives/array.ts:10](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/array.ts#L10)

Returns a new array with unique elements from the input array.

#### Type Parameters

• **T**

The type of elements in the array.

#### Parameters

##### array

`T`[]

The input array.

#### Returns

`T`[]

- A new array with unique elements.

***

### uniqueBy()

> **uniqueBy**\<`T`, `K`\>(`array`, `key`): `T`[]

Defined in: [natives/array.ts:163](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/array.ts#L163)

Returns a new array containing unique elements from the input array based on the specified key.
If a key function is provided, it will be used to extract the key from each element.
If a key property is provided, it will be used to extract the key from each element.

#### Type Parameters

• **T**

The type of elements in the input array.

• **K** *extends* `PropertyKey`

The type of the key used for uniqueness.

#### Parameters

##### array

`T`[]

The input array.

##### key

The key property or function used to extract the key from each element.

`K` | (`item`) => `K`

#### Returns

`T`[]

- A new array containing unique elements based on the specified key.
