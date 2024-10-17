[**std-kit**](../README.md) • **Docs**

***

[std-kit](../modules.md) / natives/timer

# natives/timer

## Functions

### debounce()

> **debounce**\<`F`\>(`callback`, `waitFor`): (...`args`) => `void`

Creates a debounced version of the provided callback function.
The debounced function will delay invoking the callback until after a specified amount of time has passed since the last time it was invoked.

#### Type Parameters

• **F** *extends* (...`args`) => `ReturnType`\<`F`\>

The type of the original callback function.

#### Parameters

• **callback**: `F`

The original callback function to debounce.

• **waitFor**: `number`

The amount of time (in milliseconds) to wait before invoking the debounced callback.

#### Returns

`Function`

- The debounced callback function.

##### Parameters

• ...**args**: `Parameters`\<`F`\>

##### Returns

`void`

#### Defined in

[natives/timer.ts:17](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/timer.ts#L17)

***

### sleep()

> **sleep**(`ms`): `Promise`\<`unknown`\>

Pauses the execution for the specified number of milliseconds.

#### Parameters

• **ms**: `number`

The number of milliseconds to sleep.

#### Returns

`Promise`\<`unknown`\>

A promise that resolves after the specified number of milliseconds.

#### Defined in

[natives/timer.ts:6](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/timer.ts#L6)

***

### throttle()

> **throttle**\<`F`\>(`callback`, `waitFor`): (...`args`) => `Promise`\<`ReturnType`\<`F`\>\>

Throttles a function and returns a promise that resolves with the result of the function.
The function will be called at most once within the specified time interval.

#### Type Parameters

• **F** *extends* (...`args`) => `ReturnType`\<`F`\>

The type of the function to throttle.

#### Parameters

• **callback**: `F`

The function to throttle.

• **waitFor**: `number`

The time interval in milliseconds.

#### Returns

`Function`

- A throttled function that returns a promise.

##### Parameters

• ...**args**: `Parameters`\<`F`\>

##### Returns

`Promise`\<`ReturnType`\<`F`\>\>

#### Defined in

[natives/timer.ts:35](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/timer.ts#L35)
