[**std-kit**](../README.md)

***

[std-kit](../modules.md) / natives/object

# natives/object

## Functions

### deepMerge()

> **deepMerge**\<`TSource`, `TPatch`\>(`source`, `patch`): `TSource` & `TPatch`

Defined in: [natives/object.ts:161](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/object.ts#L161)

Deeply merges a patch object into a source object.

- New keys in the patch object will be added to the source.
- Nested objects are recursively merged.
- Arrays are replaced entirely rather than merged.

#### Type Parameters

• **TSource** *extends* [`PlainObject`](../utilities/types.md#plainobject)

Type of the source object.

• **TPatch** *extends* [`PlainObject`](../utilities/types.md#plainobject)

Type of the patch object.

#### Parameters

##### source

`TSource`

The original object to be merged into.

##### patch

`TPatch`

The object containing updates or new keys to be merged.

#### Returns

`TSource` & `TPatch`

A new object that is the result of deeply merging the patch into the source.

***

### filterObject()

> **filterObject**\<`R`, `T`, `P`\>(`obj`, `filter`, `path`?): `FilterResult`\<`R`, `P`\>[]

Defined in: [natives/object.ts:102](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/object.ts#L102)

Recursively filters a JSON-like object or array, applying the filter function to each sub-object or sub-array.
Returns matching objects, and optionally, the paths where the matches were found.

The return type is inferred dynamically based on the `path` argument. If `path: true`, the return type includes
both the path and the value. Otherwise, it returns just the values.

#### Type Parameters

• **R** = `unknown`

The expected return type of the object.

• **T** = `unknown`

The type of the object or array to filter.

• **P** *extends* `boolean` = `false`

A boolean, controlling whether the path should be included in the return type.

#### Parameters

##### obj

`T`

The JSON-like object or array to filter.

##### filter

`FilterFunction`\<`unknown`\>

The filter function that returns true for a matching sub-object.

##### path?

`P` = `...`

Whether to include the path in the result.
If `true`, the path to the matching sub-object is returned alongside the result.

#### Returns

`FilterResult`\<`R`, `P`\>[]

- An array of matching sub-objects or matching objects with paths (if `path` is true).

***

### getValue()

> **getValue**\<`TData`, `TPath`, `TDefault`\>(`data`, `path`, `defaultValue`): `TDefault` \| [`GetFieldType`](../utilities/types.md#getfieldtypet-path)\<`TData`, `TPath`\>

Defined in: [natives/object.ts:21](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/object.ts#L21)

Retrieves a value from a nested object or array using a dot/bracket notation path.
If the value at the specified path doesn't exist, returns a default value.

Supports accessing both object properties and array indices using a path such as 'user.posts[0].title'.

#### Type Parameters

• **TData**

The type of the data object.

• **TPath** *extends* `string`

The dot/bracket notation path to the property in the object.

• **TDefault** = [`GetFieldType`](../utilities/types.md#getfieldtypet-path)\<`TData`, `TPath`\>

The type of the default value to be returned if the path does not exist.

#### Parameters

##### data

`TData`

The object or array from which to retrieve the value.

##### path

`TPath`

The string path specifying the property to retrieve.
Supports dot notation (e.g., 'user.name') and bracket notation (e.g., 'user.posts[0]').

##### defaultValue

`TDefault`

The value to return if the specified path does not exist or is undefined.

#### Returns

`TDefault` \| [`GetFieldType`](../utilities/types.md#getfieldtypet-path)\<`TData`, `TPath`\>

- The value at the specified path, or the default value if the path does not exist.

***

### setValue()

> **setValue**\<`TData`, `TPath`, `TValue`\>(`data`, `path`, `value`): `void`

Defined in: [natives/object.ts:57](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/object.ts#L57)

Sets a value in a nested object or array using a dot/bracket notation path.
If the path does not exist, it will create intermediate objects or arrays as needed.

Supports both object properties and array indices in the path, such as 'user.posts[0].title'.

#### Type Parameters

• **TData**

The type of the data object being modified.

• **TPath** *extends* `string`

The dot/bracket notation path to the property where the value will be set.

• **TValue**

The type of the value to set at the specified path.

#### Parameters

##### data

`TData`

The object or array in which the value will be set.

##### path

`TPath`

The string path specifying the property to set.
Supports dot notation (e.g., 'user.name') and bracket notation (e.g., 'user.posts[0]').

##### value

`TValue`

The value to set at the specified path.

#### Returns

`void`
