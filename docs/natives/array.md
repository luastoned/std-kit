[**std-kit**](../README.md) • **Docs**

***

[std-kit](../modules.md) / natives/array

# natives/array

## Functions

### cartesian()

> **cartesian**\<`T`\>(`items`): `T`[][]

Calculates the cartesian product of the given array of arrays.

#### Type Parameters

• **T**

#### Parameters

• **items**: `T`[][]

The array of arrays to calculate the cartesian product from.

#### Returns

`T`[][]

The cartesian product as a 2D array.

#### Defined in

[natives/array.ts:184](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/array.ts#L184)

***

### combinations()

> **combinations**\<`T`\>(`items`): `T`[][]

Generates all possible non-empty combinations of the elements in an array.

#### Type Parameters

• **T**

The type of the array elements.

#### Parameters

• **items**: `T`[]

The array of elements.

#### Returns

`T`[][]

- An array of arrays representing the combinations.

#### Defined in

[natives/array.ts:193](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/array.ts#L193)

***

### countBy()

> **countBy**\<`T`, `K`\>(`array`, `key`): `Record`\<`K`, `number`\>

Counts the occurrences of each unique key in an array.
If a key function is provided, it will be used to extract the key from each element.
If a key property is provided, it will be used to extract the key from each element.

#### Type Parameters

• **T**

The type of elements in the array.

• **K** *extends* `PropertyKey`

The type of the key used for counting.

#### Parameters

• **array**: `T`[]

The array to count the occurrences in.

• **key**: `K` \| (`item`) => `K`

The key used for counting. Can be a property name or a function that returns the key.

#### Returns

`Record`\<`K`, `number`\>

- An object that maps each unique key to its count.

#### Defined in

[natives/array.ts:61](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/array.ts#L61)

***

### fill()

> **fill**\<`T`\>(`size`, `value`): `T`[]

Creates a new array of a specified size and fills it with the provided value.

#### Type Parameters

• **T**

The type of elements in the array.

#### Parameters

• **size**: `number`

The size of the array to create.

• **value**: `T`

The value to fill the array with.

#### Returns

`T`[]

An array of the specified size filled with the provided value.

#### Defined in

[natives/array.ts:48](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/array.ts#L48)

***

### flatten()

> **flatten**\<`T`\>(`array`): `T`[]

Flattens a nested array of type T.

#### Type Parameters

• **T** *extends* `T`[]

#### Parameters

• **array**: `T`[]

The array to flatten.

#### Returns

`T`[]

The flattened array.

#### Defined in

[natives/array.ts:38](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/array.ts#L38)

***

### groupBy()

> **groupBy**\<`T`, `K`\>(`array`, `key`): `Record`\<`K`, `T`[]\>

Groups the elements of an array by a specified key.
If a key function is provided, it will be used to extract the key from each element.
If a key property is provided, it will be used to extract the key from each element.

#### Type Parameters

• **T**

The type of the elements in the array.

• **K** *extends* `PropertyKey`

The type of the key used for grouping.

#### Parameters

• **array**: `T`[]

The array to group.

• **key**: `K` \| (`item`) => `K`

The key used for grouping. Can be a property name or a function that returns the key.

#### Returns

`Record`\<`K`, `T`[]\>

- An object where the keys are the grouped values and the values are arrays of elements that belong to each group.

#### Defined in

[natives/array.ts:81](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/array.ts#L81)

***

### orderBy()

> **orderBy**\<`T`, `K`\>(`array`, `keys`, `orders`, `inPlace`?): `T`[]

Sorts an array of objects based on the specified keys and orders.
If a key function is provided, it will be used to extract the key from each element.
If a key property is provided, it will be used to extract the key from each element.

#### Type Parameters

• **T**

The type of the array elements.

• **K** *extends* `string` \| `number`

The type of the keys used for sorting.

#### Parameters

• **array**: `T`[]

The array to be sorted.

• **keys**: (`K` \| (`item`) => `K`)[]

The keys or functions used for sorting.

• **orders**: (`"asc"` \| `"desc"`)[]

The sort orders for each key.

• **inPlace?**: `boolean` = `false`

Indicates whether to sort the array in place or return a new sorted array.

#### Returns

`T`[]

- The sorted array.

#### Defined in

[natives/array.ts:110](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/array.ts#L110)

***

### reverse()

> **reverse**\<`T`\>(`array`, `inPlace`?): `T`[]

Reverses the elements of an array.

#### Type Parameters

• **T**

The type of elements in the array.

#### Parameters

• **array**: `T`[]

The array to be reversed.

• **inPlace?**: `boolean` = `false`

Specifies whether to reverse the array in place or create a new reversed array.

#### Returns

`T`[]

- The reversed array.

#### Defined in

[natives/array.ts:20](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/array.ts#L20)

***

### shuffle()

> **shuffle**\<`T`\>(`array`, `inPlace`?): `T`[]

Shuffles the elements of an array.

#### Type Parameters

• **T**

The type of elements in the array.

#### Parameters

• **array**: `T`[]

The array to shuffle.

• **inPlace?**: `boolean` = `false`

Specifies whether to shuffle the array in place or create a new shuffled array.

#### Returns

`T`[]

The shuffled array.

#### Defined in

[natives/array.ts:30](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/array.ts#L30)

***

### unique()

> **unique**\<`T`\>(`array`): `T`[]

Returns a new array with unique elements from the input array.

#### Type Parameters

• **T**

The type of elements in the array.

#### Parameters

• **array**: `T`[]

The input array.

#### Returns

`T`[]

- A new array with unique elements.

#### Defined in

[natives/array.ts:10](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/array.ts#L10)

***

### uniqueBy()

> **uniqueBy**\<`T`, `K`\>(`array`, `key`): `T`[]

Returns a new array containing unique elements from the input array based on the specified key.
If a key function is provided, it will be used to extract the key from each element.
If a key property is provided, it will be used to extract the key from each element.

#### Type Parameters

• **T**

The type of elements in the input array.

• **K** *extends* `PropertyKey`

The type of the key used for uniqueness.

#### Parameters

• **array**: `T`[]

The input array.

• **key**: `K` \| (`item`) => `K`

The key property or function used to extract the key from each element.

#### Returns

`T`[]

- A new array containing unique elements based on the specified key.

#### Defined in

[natives/array.ts:147](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/array.ts#L147)
