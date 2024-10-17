[**std-kit**](../README.md) • **Docs**

***

[std-kit](../modules.md) / natives/number

# natives/number

## Functions

### clamp()

> **clamp**(`value`, `rangeA`, `rangeB`): `number`

Clamps a value between a specified range.

#### Parameters

• **value**: `number`

The value to be clamped.

• **rangeA**: `number`

The first value of the range.

• **rangeB**: `number`

The second value of the range.

#### Returns

`number`

The clamped value.

#### Defined in

[natives/number.ts:9](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/number.ts#L9)

***

### deg2rad()

> **deg2rad**(`degrees`): `number`

Converts degrees to radians.

#### Parameters

• **degrees**: `number`

The number of degrees to convert.

#### Returns

`number`

The equivalent value in radians.

#### Defined in

[natives/number.ts:43](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/number.ts#L43)

***

### mean()

> **mean**(`values`): `number`

Calculates the mean of an array of numbers.

#### Parameters

• **values**: `number`[]

The array of numbers.

#### Returns

`number`

The mean value of the numbers.

#### Defined in

[natives/number.ts:77](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/number.ts#L77)

***

### rad2deg()

> **rad2deg**(`radians`): `number`

Converts radians to degrees.

#### Parameters

• **radians**: `number`

The value in radians to be converted.

#### Returns

`number`

The value in degrees.

#### Defined in

[natives/number.ts:50](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/number.ts#L50)

***

### randomInt()

> **randomInt**(`min`, `max`): `number`

Generates a random integer between the specified minimum and maximum values (inclusive).

#### Parameters

• **min**: `number`

The minimum value of the range.

• **max**: `number`

The maximum value of the range.

#### Returns

`number`

A random integer between the minimum and maximum values.

#### Defined in

[natives/number.ts:27](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/number.ts#L27)

***

### randomNum()

> **randomNum**(`min`, `max`): `number`

Generates a random number between the specified minimum and maximum values.

#### Parameters

• **min**: `number`

The minimum value of the range (inclusive).

• **max**: `number`

The maximum value of the range (exclusive).

#### Returns

`number`

A random number between the minimum and maximum values.

#### Defined in

[natives/number.ts:36](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/number.ts#L36)

***

### range()

> **range**(`start`, `end`, `step`): `number`[]

Generates an array of numbers within a specified range.

#### Parameters

• **start**: `number`

The starting number of the range.

• **end**: `number`

The ending number of the range.

• **step**: `number` = `1`

The increment value between numbers in the range. Default is 1.

#### Returns

`number`[]

An array of numbers within the specified range.

#### Defined in

[natives/number.ts:60](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/number.ts#L60)

***

### roundTo()

> **roundTo**(`value`, `decimals`): `number`

Rounds a number to the specified number of decimal places.

#### Parameters

• **value**: `number`

The number to round.

• **decimals**: `number` = `2`

The number of decimal places to round to. Default is 2.

#### Returns

`number`

The rounded number.

#### Defined in

[natives/number.ts:18](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/number.ts#L18)

***

### sum()

> **sum**(`values`): `number`

Calculates the sum of an array of numbers.

#### Parameters

• **values**: `number`[]

An array of numbers.

#### Returns

`number`

The sum of the numbers in the array.

#### Defined in

[natives/number.ts:69](https://github.com/luastoned/std-kit/blob/019ddf4e36ce84e216dda16e7c3c3f2700a06ed4/src/natives/number.ts#L69)
