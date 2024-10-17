[**std-kit**](../README.md) • **Docs**

***

[std-kit](../modules.md) / utilities/types

# utilities/types

## Type Aliases

### GenericFn()\<T\>

> **GenericFn**\<`T`\>: (...`args`) => `unknown`

Represents a generic function type.

#### Type Parameters

• **T**

The type of arguments accepted by the function.

#### Parameters

• ...**args**: `T`[]

#### Returns

`unknown`

#### Defined in

[utilities/types.ts:28](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/utilities/types.ts#L28)

***

### GenericFunction()\<TFunc\>

> **GenericFunction**\<`TFunc`\>: (...`args`) => `ReturnType`\<`TFunc`\>

Represents a generic function type.

#### Type Parameters

• **TFunc** *extends* (...`args`) => `unknown`

The type of the function.

#### Parameters

• ...**args**: `Parameters`\<`TFunc`\>

#### Returns

`ReturnType`\<`TFunc`\>

#### Defined in

[utilities/types.ts:39](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/utilities/types.ts#L39)

***

### GenericObject

> **GenericObject**: `Record`\<`PropertyKey`, `unknown`\>

Represents a generic object with dynamic keys and unknown values.

#### Defined in

[utilities/types.ts:33](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/utilities/types.ts#L33)

***

### GetFieldType\<T, Path\>

> **GetFieldType**\<`T`, `Path`\>: `Path` *extends* \`$\{infer Left\}.$\{infer Right\}\` ? `GetNestedField`\<`T`, `Left`, `Right`\> : `GetDirectOrIndexedField`\<`T`, `Path`\>

#### Type Parameters

• **T**

• **Path**

#### Defined in

[utilities/types.ts:55](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/utilities/types.ts#L55)

***

### KeyFn()\<T\>

> **KeyFn**\<`T`\>: (`arg`) => keyof `T`

Represents a function that extracts a key from a value.

#### Type Parameters

• **T**

The type of the value.

#### Parameters

• **arg**: `T`

The value from which to extract the key.

#### Returns

keyof `T`

The key extracted from the value.

#### Defined in

[utilities/types.ts:22](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/utilities/types.ts#L22)

***

### Maybe\<T\>

> **Maybe**\<`T`\>: `T` \| `null` \| `undefined`

Represents a type that can be either a value of type T, null, or undefined.

#### Type Parameters

• **T**

The type of the value.

#### Defined in

[utilities/types.ts:14](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/utilities/types.ts#L14)

***

### Prettify\<T\>

> **Prettify**\<`T`\>: `{ [K in keyof T]: T[K] }` & `object`

Represents a type that prettifies another type by preserving its properties.

#### Type Parameters

• **T**

The type to be prettified.

#### Defined in

[utilities/types.ts:5](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/utilities/types.ts#L5)
