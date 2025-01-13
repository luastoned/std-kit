[**std-kit**](../README.md)

***

[std-kit](../modules.md) / utilities/generic

# utilities/generic

## Functions

### cloneObject()

> **cloneObject**\<`T`\>(`item`): `T`

Defined in: [utilities/generic.ts:171](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L171)

Creates a deep clone of an item.

#### Type Parameters

• **T**

#### Parameters

##### item

`T`

The item to clone.

#### Returns

`T`

The cloned item.

***

### isArray()

> **isArray**\<`T`\>(`item`): item is T\[\] \| readonly T\[\]

Defined in: [utilities/generic.ts:7](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L7)

Checks if the given item is an array.

#### Type Parameters

• **T** = `unknown`

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

item is T\[\] \| readonly T\[\]

`true` if the item is an array, `false` otherwise.

***

### isBoolean()

> **isBoolean**(`item`): `item is boolean`

Defined in: [utilities/generic.ts:15](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L15)

Checks if the given item is a boolean.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is boolean`

`true` if the item is a boolean, `false` otherwise.

***

### isDate()

> **isDate**(`item`): `item is Date`

Defined in: [utilities/generic.ts:23](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L23)

Checks if the given item is a Date object.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is Date`

`true` if the item is a Date object, `false` otherwise.

***

### isDefined()

> **isDefined**(`item`): `boolean`

Defined in: [utilities/generic.ts:30](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L30)

Checks if the given item is defined.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`boolean`

A boolean indicating whether the item is defined or not.

***

### isError()

> **isError**(`item`): `item is Error`

Defined in: [utilities/generic.ts:38](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L38)

Checks if the given item is an instance of the Error class.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is Error`

`true` if the item is an instance of Error, `false` otherwise.

***

### isFunction()

> **isFunction**(`item`): `item is Function`

Defined in: [utilities/generic.ts:47](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L47)

Checks if the given item is a function.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is Function`

`true` if the item is a function, `false` otherwise.

***

### isInfinity()

> **isInfinity**(`item`): `item is number`

Defined in: [utilities/generic.ts:54](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L54)

Checks if the given item is an infinity number.

#### Parameters

##### item

`unknown`

The item to be checked.

#### Returns

`item is number`

A boolean indicating whether the item is an infinity number.

***

### isMap()

> **isMap**\<`K`, `V`\>(`item`): `item is Map<K, V>`

Defined in: [utilities/generic.ts:64](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L64)

Checks if the given item is an instance of Map.

#### Type Parameters

• **K** = `unknown`

The type of keys in the Map.

• **V** = `unknown`

The type of values in the Map.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is Map<K, V>`

`true` if the item is a Map, `false` otherwise.

***

### isNull()

> **isNull**(`item`): `item is null`

Defined in: [utilities/generic.ts:72](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L72)

Checks if the given item is null.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is null`

`true` if the item is null, `false` otherwise.

***

### isNumber()

> **isNumber**(`item`): `item is number`

Defined in: [utilities/generic.ts:80](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L80)

Checks if the given item is a number.

#### Parameters

##### item

`unknown`

The item to be checked.

#### Returns

`item is number`

`true` if the item is a number, `false` otherwise.

***

### isObject()

> **isObject**(`item`): `item is object`

Defined in: [utilities/generic.ts:88](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L88)

Checks if the given item is an object.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is object`

`true` if the item is an object, `false` otherwise.

***

### isPlainObject()

> **isPlainObject**(`item`): `item is Record<PropertyKey, unknown>`

Defined in: [utilities/generic.ts:96](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L96)

Checks if the given item is a plain object.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is Record<PropertyKey, unknown>`

A boolean indicating whether the item is a plain object.

***

### isPromise()

> **isPromise**\<`T`\>(`item`): `item is Promise<T>`

Defined in: [utilities/generic.ts:104](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L104)

Checks if the given item is a Promise.

#### Type Parameters

• **T** = `unknown`

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is Promise<T>`

`true` if the item is a Promise, `false` otherwise.

***

### isRegExp()

> **isRegExp**(`item`): `item is RegExp`

Defined in: [utilities/generic.ts:112](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L112)

Checks if the given item is a regular expression.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is RegExp`

`true` if the item is a regular expression, `false` otherwise.

***

### isSet()

> **isSet**\<`T`\>(`item`): `item is Set<T>`

Defined in: [utilities/generic.ts:120](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L120)

Checks if the given item is a Set.

#### Type Parameters

• **T** = `unknown`

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is Set<T>`

A boolean indicating whether the item is a Set.

***

### isString()

> **isString**(`item`): `item is string`

Defined in: [utilities/generic.ts:128](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L128)

Checks if the given item is a string.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is string`

`true` if the item is a string, `false` otherwise.

***

### isSymbol()

> **isSymbol**(`item`): `item is symbol`

Defined in: [utilities/generic.ts:136](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L136)

Checks if the given item is a symbol.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is symbol`

`true` if the item is a symbol, `false` otherwise.

***

### isUndefined()

> **isUndefined**(`item`): `item is undefined`

Defined in: [utilities/generic.ts:144](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L144)

Checks if the given item is undefined.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is undefined`

A boolean indicating whether the item is undefined or not.

***

### isWeakMap()

> **isWeakMap**\<`K`, `V`\>(`item`): `item is WeakMap<K, V>`

Defined in: [utilities/generic.ts:154](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L154)

Checks if the given item is an instance of WeakMap.

#### Type Parameters

• **K** *extends* `WeakKey`

The type of the keys in the WeakMap.

• **V** = `unknown`

The type of the values in the WeakMap.

#### Parameters

##### item

`unknown`

The item to be checked.

#### Returns

`item is WeakMap<K, V>`

A boolean indicating whether the item is an instance of WeakMap.

***

### isWeakSet()

> **isWeakSet**\<`T`\>(`item`): `item is WeakSet<T>`

Defined in: [utilities/generic.ts:163](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/generic.ts#L163)

Checks if the given item is a WeakSet.

#### Type Parameters

• **T** *extends* `WeakKey`

The type of the WeakSet keys.

#### Parameters

##### item

`unknown`

The item to check.

#### Returns

`item is WeakSet<T>`

A boolean indicating whether the item is a WeakSet.
