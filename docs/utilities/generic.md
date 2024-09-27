[**std-kit**](../README.md) • **Docs**

***

[std-kit](../modules.md) / utilities/generic

# utilities/generic

## Functions

### cloneObject()

> **cloneObject**\<`T`\>(`item`): `T`

Creates a deep clone of an item.

#### Type Parameters

• **T**

#### Parameters

• **item**: `T`

The item to clone.

#### Returns

`T`

The cloned item.

#### Defined in

utilities/generic.ts:126

***

### isArray()

> **isArray**\<`T`\>(`item`): item is T\[\] \| readonly T\[\]

Checks if the given item is an array.

#### Type Parameters

• **T** = `unknown`

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

item is T\[\] \| readonly T\[\]

`true` if the item is an array, `false` otherwise.

#### Defined in

utilities/generic.ts:7

***

### isBoolean()

> **isBoolean**(`item`): `item is boolean`

Checks if the given item is a boolean.

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

`item is boolean`

`true` if the item is a boolean, `false` otherwise.

#### Defined in

utilities/generic.ts:15

***

### isDate()

> **isDate**(`item`): `item is Date`

Checks if the given item is a Date object.

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

`item is Date`

`true` if the item is a Date object, `false` otherwise.

#### Defined in

utilities/generic.ts:23

***

### isDefined()

> **isDefined**(`item`): `boolean`

Checks if the given item is defined.

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

`boolean`

A boolean indicating whether the item is defined or not.

#### Defined in

utilities/generic.ts:30

***

### isError()

> **isError**(`item`): `item is Error`

Checks if the given item is an instance of the Error class.

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

`item is Error`

`true` if the item is an instance of Error, `false` otherwise.

#### Defined in

utilities/generic.ts:38

***

### isFunction()

> **isFunction**(`item`): `item is Function`

Checks if the given item is a function.

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

`item is Function`

`true` if the item is a function, `false` otherwise.

#### Defined in

utilities/generic.ts:47

***

### isInfinity()

> **isInfinity**(`item`): `item is number`

Checks if the given item is an infinity number.

#### Parameters

• **item**: `unknown`

The item to be checked.

#### Returns

`item is number`

A boolean indicating whether the item is an infinity number.

#### Defined in

utilities/generic.ts:54

***

### isNull()

> **isNull**(`item`): `item is null`

Checks if the given item is null.

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

`item is null`

`true` if the item is null, `false` otherwise.

#### Defined in

utilities/generic.ts:62

***

### isNumber()

> **isNumber**(`item`): `item is number`

Checks if the given item is a number.

#### Parameters

• **item**: `unknown`

The item to be checked.

#### Returns

`item is number`

`true` if the item is a number, `false` otherwise.

#### Defined in

utilities/generic.ts:70

***

### isObject()

> **isObject**(`item`): `item is object`

Checks if the given item is an object.

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

`item is object`

`true` if the item is an object, `false` otherwise.

#### Defined in

utilities/generic.ts:78

***

### isPlainObject()

> **isPlainObject**(`item`): `item is Record<PropertyKey, unknown>`

Checks if the given item is a plain object.

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

`item is Record<PropertyKey, unknown>`

A boolean indicating whether the item is a plain object.

#### Defined in

utilities/generic.ts:86

***

### isRegExp()

> **isRegExp**(`item`): `item is RegExp`

Checks if the given item is a regular expression.

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

`item is RegExp`

`true` if the item is a regular expression, `false` otherwise.

#### Defined in

utilities/generic.ts:94

***

### isString()

> **isString**(`item`): `item is string`

Checks if the given item is a string.

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

`item is string`

`true` if the item is a string, `false` otherwise.

#### Defined in

utilities/generic.ts:102

***

### isSymbol()

> **isSymbol**(`item`): `item is symbol`

Checks if the given item is a symbol.

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

`item is symbol`

`true` if the item is a symbol, `false` otherwise.

#### Defined in

utilities/generic.ts:110

***

### isUndefined()

> **isUndefined**(`item`): `item is undefined`

Checks if the given item is undefined.

#### Parameters

• **item**: `unknown`

The item to check.

#### Returns

`item is undefined`

A boolean indicating whether the item is undefined or not.

#### Defined in

utilities/generic.ts:118
