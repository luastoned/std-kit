[**std-kit**](../README.md)

***

[std-kit](../modules.md) / natives/timer

# natives/timer

## Functions

### debounce()

> **debounce**\<`F`\>(`callback`, `waitFor`): (...`args`) => `void`

Defined in: [natives/timer.ts:17](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/timer.ts#L17)

Creates a debounced version of the provided callback function.
The debounced function will delay invoking the callback until after a specified amount of time has passed since the last time it was invoked.

#### Type Parameters

• **F** *extends* (...`args`) => `ReturnType`\<`F`\>

The type of the original callback function.

#### Parameters

##### callback

`F`

The original callback function to debounce.

##### waitFor

`number`

The amount of time (in milliseconds) to wait before invoking the debounced callback.

#### Returns

`Function`

- The debounced callback function.

##### Parameters

###### args

...`Parameters`\<`F`\>

##### Returns

`void`

***

### sleep()

> **sleep**(`ms`): `Promise`\<`unknown`\>

Defined in: [natives/timer.ts:6](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/timer.ts#L6)

Pauses the execution for the specified number of milliseconds.

#### Parameters

##### ms

`number`

The number of milliseconds to sleep.

#### Returns

`Promise`\<`unknown`\>

A promise that resolves after the specified number of milliseconds.

***

### throttle()

> **throttle**\<`F`\>(`callback`, `waitFor`): (...`args`) => `Promise`\<`ReturnType`\<`F`\>\>

Defined in: [natives/timer.ts:35](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/timer.ts#L35)

Throttles a function and returns a promise that resolves with the result of the function.
The function will be called at most once within the specified time interval.

#### Type Parameters

• **F** *extends* (...`args`) => `ReturnType`\<`F`\>

The type of the function to throttle.

#### Parameters

##### callback

`F`

The function to throttle.

##### waitFor

`number`

The time interval in milliseconds.

#### Returns

`Function`

- A throttled function that returns a promise.

##### Parameters

###### args

...`Parameters`\<`F`\>

##### Returns

`Promise`\<`ReturnType`\<`F`\>\>
