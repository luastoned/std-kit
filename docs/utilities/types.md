[**std-kit**](../README.md)

***

[std-kit](../modules.md) / utilities/types

# utilities/types

## Type Aliases

### GenericFn()\<T\>

> **GenericFn**\<`T`\>: (...`args`) => `unknown`

Defined in: [utilities/types.ts:28](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/types.ts#L28)

Represents a generic function type.

#### Type Parameters

• **T**

The type of arguments accepted by the function.

#### Parameters

##### args

...`T`[]

#### Returns

`unknown`

***

### GenericFunction()\<TFunc\>

> **GenericFunction**\<`TFunc`\>: (...`args`) => `ReturnType`\<`TFunc`\>

Defined in: [utilities/types.ts:44](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/types.ts#L44)

Represents a generic function type.

#### Type Parameters

• **TFunc** *extends* (...`args`) => `unknown`

The type of the function.

#### Parameters

##### args

...`Parameters`\<`TFunc`\>

#### Returns

`ReturnType`\<`TFunc`\>

***

### GenericObject

> **GenericObject**: `Record`\<`PropertyKey`, `unknown`\>

Defined in: [utilities/types.ts:33](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/types.ts#L33)

Represents a generic object with dynamic keys and unknown values.

***

### GetFieldType\<T, Path\>

> **GetFieldType**\<`T`, `Path`\>: `Path` *extends* `` `${infer Left}.${infer Right}` `` ? `GetNestedField`\<`T`, `Left`, `Right`\> : `GetDirectOrIndexedField`\<`T`, `Path`\>

Defined in: [utilities/types.ts:60](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/types.ts#L60)

#### Type Parameters

• **T**

• **Path**

***

### KeyFn()\<T\>

> **KeyFn**\<`T`\>: (`arg`) => keyof `T`

Defined in: [utilities/types.ts:22](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/types.ts#L22)

Represents a function that extracts a key from a value.

#### Type Parameters

• **T**

The type of the value.

#### Parameters

##### arg

`T`

The value from which to extract the key.

#### Returns

keyof `T`

The key extracted from the value.

***

### Maybe\<T\>

> **Maybe**\<`T`\>: `T` \| `null` \| `undefined`

Defined in: [utilities/types.ts:14](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/types.ts#L14)

Represents a type that can be either a value of type T, null, or undefined.

#### Type Parameters

• **T**

The type of the value.

***

### PlainObject

> **PlainObject**: `Record`\<`string`, `unknown`\>

Defined in: [utilities/types.ts:38](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/types.ts#L38)

Represents a plain object with string keys and unknown values.

***

### Prettify\<T\>

> **Prettify**\<`T`\>: `{ [K in keyof T]: T[K] }` & `object`

Defined in: [utilities/types.ts:5](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/utilities/types.ts#L5)

Represents a type that prettifies another type by preserving its properties.

#### Type Parameters

• **T**

The type to be prettified.
