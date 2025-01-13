[**std-kit**](../README.md)

***

[std-kit](../modules.md) / natives/number

# natives/number

## Functions

### clamp()

> **clamp**(`value`, `rangeA`, `rangeB`): `number`

Defined in: [natives/number.ts:9](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/number.ts#L9)

Clamps a value between a specified range.

#### Parameters

##### value

`number`

The value to be clamped.

##### rangeA

`number`

The first value of the range.

##### rangeB

`number`

The second value of the range.

#### Returns

`number`

The clamped value.

***

### deg2rad()

> **deg2rad**(`degrees`): `number`

Defined in: [natives/number.ts:43](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/number.ts#L43)

Converts degrees to radians.

#### Parameters

##### degrees

`number`

The number of degrees to convert.

#### Returns

`number`

The equivalent value in radians.

***

### lerp()

> **lerp**(`from`, `to`, `t`): `number`

Defined in: [natives/number.ts:87](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/number.ts#L87)

Linearly interpolates between two numbers.

#### Parameters

##### from

`number`

The starting value.

##### to

`number`

The ending value.

##### t

`number`

The interpolation factor.

#### Returns

`number`

The interpolated value.

***

### mean()

> **mean**(`values`): `number`

Defined in: [natives/number.ts:77](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/number.ts#L77)

Calculates the mean of an array of numbers.

#### Parameters

##### values

`number`[]

The array of numbers.

#### Returns

`number`

The mean value of the numbers.

***

### rad2deg()

> **rad2deg**(`radians`): `number`

Defined in: [natives/number.ts:50](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/number.ts#L50)

Converts radians to degrees.

#### Parameters

##### radians

`number`

The value in radians to be converted.

#### Returns

`number`

The value in degrees.

***

### randomInt()

> **randomInt**(`min`, `max`): `number`

Defined in: [natives/number.ts:27](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/number.ts#L27)

Generates a random integer between the specified minimum and maximum values (inclusive).

#### Parameters

##### min

`number`

The minimum value of the range.

##### max

`number`

The maximum value of the range.

#### Returns

`number`

A random integer between the minimum and maximum values.

***

### randomNum()

> **randomNum**(`min`, `max`): `number`

Defined in: [natives/number.ts:36](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/number.ts#L36)

Generates a random number between the specified minimum and maximum values.

#### Parameters

##### min

`number`

The minimum value of the range (inclusive).

##### max

`number`

The maximum value of the range (exclusive).

#### Returns

`number`

A random number between the minimum and maximum values.

***

### range()

> **range**(`start`, `end`, `step`): `number`[]

Defined in: [natives/number.ts:60](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/number.ts#L60)

Generates an array of numbers within a specified range.

#### Parameters

##### start

`number`

The starting number of the range.

##### end

`number`

The ending number of the range.

##### step

`number` = `1`

The increment value between numbers in the range. Default is 1.

#### Returns

`number`[]

An array of numbers within the specified range.

***

### roundTo()

> **roundTo**(`value`, `decimals`): `number`

Defined in: [natives/number.ts:18](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/number.ts#L18)

Rounds a number to the specified number of decimal places.

#### Parameters

##### value

`number`

The number to round.

##### decimals

`number` = `2`

The number of decimal places to round to. Default is 2.

#### Returns

`number`

The rounded number.

***

### sum()

> **sum**(`values`): `number`

Defined in: [natives/number.ts:69](https://github.com/luastoned/std-kit/blob/d6d9c66795f32f88d92ff1f7329818985963dcec/src/natives/number.ts#L69)

Calculates the sum of an array of numbers.

#### Parameters

##### values

`number`[]

An array of numbers.

#### Returns

`number`

The sum of the numbers in the array.
