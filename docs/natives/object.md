[**std-kit**](../README.md) • **Docs**

***

[std-kit](../modules.md) / natives/object

# natives/object

## Functions

### filterObject()

> **filterObject**\<`T`, `P`\>(`obj`, `filter`, `path`?): `FilterResult`\<`T`, `P`\>[]

Recursively filters a JSON-like object or array, applying the filter function to each sub-object or sub-array.
Returns matching objects, and optionally, the paths where the matches were found.

The return type is inferred dynamically based on the `path` argument. If `path: true`, the return type includes
both the path and the value. Otherwise, it returns just the values.

#### Type Parameters

• **T** *extends* `object`

The type of the object or array to filter.

• **P** *extends* `boolean` = `false`

A boolean, controlling whether the path should be included in the return type.

#### Parameters

• **obj**: `T`

The JSON-like object or array to filter.

• **filter**: `FilterFunction`\<`T`\>

The filter function that returns true for a matching sub-object.

• **path?**: `P` = `...`

Whether to include the path in the result.
If `true`, the path to the matching sub-object is returned alongside the result.

#### Returns

`FilterResult`\<`T`, `P`\>[]

- An array of matching sub-objects or matching objects with paths (if `path` is true).

#### Defined in

[natives/object.ts:101](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/object.ts#L101)

***

### getValue()

> **getValue**\<`TData`, `TPath`, `TDefault`\>(`data`, `path`, `defaultValue`): `TDefault` \| [`GetFieldType`](../utilities/types.md#getfieldtypet-path)\<`TData`, `TPath`\>

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

• **data**: `TData`

The object or array from which to retrieve the value.

• **path**: `TPath`

The string path specifying the property to retrieve.
Supports dot notation (e.g., 'user.name') and bracket notation (e.g., 'user.posts[0]').

• **defaultValue**: `TDefault`

The value to return if the specified path does not exist or is undefined.

#### Returns

`TDefault` \| [`GetFieldType`](../utilities/types.md#getfieldtypet-path)\<`TData`, `TPath`\>

- The value at the specified path, or the default value if the path does not exist.

#### Defined in

[natives/object.ts:21](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/object.ts#L21)

***

### setValue()

> **setValue**\<`TData`, `TPath`, `TValue`\>(`data`, `path`, `value`): `void`

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

• **data**: `TData`

The object or array in which the value will be set.

• **path**: `TPath`

The string path specifying the property to set.
Supports dot notation (e.g., 'user.name') and bracket notation (e.g., 'user.posts[0]').

• **value**: `TValue`

The value to set at the specified path.

#### Returns

`void`

#### Defined in

[natives/object.ts:57](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/object.ts#L57)
