<h1 align="center">
  <br>
  🧰 std-kit
  <br>
</h1>

<h4 align="center">Essential utilities and standard library additions for Node.js & TypeScript</h4>

<p align="center">
  <a href="https://www.npmjs.com/package/std-kit" target="_blank">
    <img src="https://img.shields.io/npm/v/std-kit.svg?style=flat-square&color=success" alt="NPM version">
  </a>
  <a href="https://www.npmjs.com/package/std-kit" target="_blank">
    <img src="https://img.shields.io/npm/dm/std-kit.svg?style=flat-square&color=blueviolet" alt="NPM downloads">
  </a>
  <a href="./LICENSE" target="_blank">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License">
  </a>
  <a href="https://github.com/luastoned/std-kit" target="_blank">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square" alt="PRs Welcome">
  </a>
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-install">Install</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-usage--examples">Usage & Examples</a> •
  <a href="#-documentation">Documentation</a>
</p>

<br>

## ✨ Features

- 🎯 **Small & Focused** — Carefully crafted utilities for arrays, objects, numbers, promises, and more. Each function is designed to do one thing well.
- 🦾 **Type Strong** — Built with TypeScript from the ground up. Full type safety, intelligent autocomplete, and helpful type narrowings.
- 🔌 **Modular Design** — Zero dependencies in the core. Node-specific utilities are cleanly separated under `std-kit/node`.
- ⚡ **Lightweight** — Minimal footprint with tree-shaking support. Import only what you need without bloating your bundle.

## 📦 Install

```bash
npm install std-kit
```

<details>
<summary>Other package managers</summary>

```bash
# Yarn
yarn add std-kit

# pnpm
pnpm add std-kit

# Bun
bun add std-kit
```

</details>

## 🚀 Quick Start

```typescript
import { unique, chunk, sleep, getValue } from 'std-kit';

// Array utilities
const ids = unique([1, 2, 2, 3, 1]); // [1, 2, 3]
const groups = chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]

// Async helpers
await sleep(1000); // Sleep for 1 second

// Deep object access
const user = { profile: { name: 'Ada' } };
const name = getValue(user, 'profile.name', 'Guest'); // 'Ada'
```

## 💡 Usage & Examples

### 🔢 Arrays

Transform, filter, and manipulate arrays with ease:

```typescript
import { unique, chunk, shuffle, groupBy, orderBy } from 'std-kit';

// Remove duplicates
unique([1, 2, 2, 3]); // [1, 2, 3]

// Split into chunks
chunk(['a', 'b', 'c', 'd'], 2); // [['a', 'b'], ['c', 'd']]

// Shuffle array randomly
shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4]

// Group by property
const users = [
  { name: 'Alice', role: 'admin' },
  { name: 'Bob', role: 'user' },
  { name: 'Charlie', role: 'admin' },
];
groupBy(users, 'role');
// { admin: [{ name: 'Alice', ... }, { name: 'Charlie', ... }], user: [...] }

// Sort by multiple fields
orderBy(users, ['role', 'name'], ['asc', 'desc']);
```

### 🎯 Objects

Work with nested objects safely:

```typescript
import { getValue, setValue, mergeObject, filterObject } from 'std-kit';

const data = { user: { profile: { name: 'Ada', age: 30 } } };

// Safe nested access
getValue(data, 'user.profile.name', 'Unknown'); // 'Ada'
getValue(data, 'user.settings.theme', 'light'); // 'light' (fallback)

// Deep set values
setValue(data, 'user.profile.age', 31);
setValue(data, 'user.settings.theme', 'dark'); // Creates missing keys

// Deep merge with arrays
const source = { colors: ['red'], count: 5 };
const patch = { colors: ['blue'], theme: 'dark' };
mergeObject(source, patch); // { colors: ['blue'], count: 5, theme: 'dark' }

// Filter by keys or values
filterObject(data, { keys: ['name', 'age'] });
```

### 🔄 Promises

Control async execution flow:

```typescript
import { threads, defer, sleep, retry } from 'std-kit';

// Limit concurrent promises
const tasks = urls.map((url) => defer(fetch, url));
const results = await threads(3, tasks); // Max 3 concurrent requests

// Sleep/delay execution
await sleep(1000); // 1 second
await sleep(500); // 500ms

// Retry with exponential backoff
const data = await retry(
  async () => fetch('/api/data'),
  { attempts: 3, delay: 1000 }
);
```

### 🔢 Numbers

Clamp, format, and manipulate numbers:

```typescript
import { clamp, range, random, round } from 'std-kit';

// Constrain to range
clamp(150, 0, 100); // 100
clamp(-5, 0, 100); // 0

// Generate sequences
range(1, 5); // [1, 2, 3, 4, 5]
range(0, 10, 2); // [0, 2, 4, 6, 8, 10]

// Random numbers
random(1, 100); // Random integer between 1-100

// Precise rounding
round(3.14159, 2); // 3.14
```

### 🛡️ Type Guards

Type-safe checks and transformations:

```typescript
import { isString, isNumber, isArray, guard } from 'std-kit';

// Type narrowing
function process(value: unknown) {
  if (isString(value)) {
    return value.toUpperCase(); // TypeScript knows it's a string
  }
  if (isArray(value)) {
    return value.length; // TypeScript knows it's an array
  }
}

// Safe execution
const result = guard(() => JSON.parse(input)); // undefined on error
const safe = guard(() => riskyOperation(), (err) => err.code === 'SAFE');
```

### 🧬 TypeScript Utilities

Powerful type transformations:

```typescript
import type { DeepPartial, Prettify, NonEmptyArray } from 'std-kit';

// Make all nested properties optional
type UserInput = DeepPartial<User>;

// Simplify complex types for better IDE hints
type Config = Prettify<DefaultConfig & UserConfig>;

// Enforce non-empty arrays
function process(items: NonEmptyArray<string>) {
  return items[0]; // Safe! Array is guaranteed non-empty
}
```

### 💾 Node.js Specific

```ts
import { streamToBuffer, pipeToBuffer } from 'std-kit/node';

const buffer = await streamToBuffer(readableStream);
```

---

## 📚 Documentation

> **Complete API documentation with examples for every function**

### Core Modules

| Module | Description |
|--------|-------------|
| [📋 array](docs/natives/array.md) | Array manipulation, grouping, sorting, and transformations |
| [🎯 object](docs/natives/object.md) | Deep access, merge, filter, map, and query objects |
| [🔢 number](docs/natives/number.md) | Number operations, ranges, rounding, and formatting |
| [⚡ promise](docs/natives/promise.md) | Async control flow, concurrency, retry, and timing |
| [⏱️ timer](docs/natives/timer.md) | Sleep, delay, timeout, and interval utilities |
| [⚙️ function](docs/natives/function.md) | Function composition, memoization, and helpers |

### Utilities

| Module | Description |
|--------|-------------|
| [🛠️ generic](docs/utilities/generic.md) | Type guards, checks, and generic utility functions |
| [🛡️ guard](docs/utilities/guard.md) | Safe execution and error handling |
| [📘 types](docs/utilities/types.md) | TypeScript type utilities and transformations |

### Node.js Specific

| Module | Description |
|--------|-------------|
| [💾 buffer](docs/natives/buffer.md) | Stream to buffer conversion and buffer utilities |

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

- 🐛 Report bugs
- 💡 Suggest new features
- 📖 Improve documentation
- 🔧 Submit pull requests

## 📄 License

[MIT](./LICENSE) License © 2024-PRESENT [LuaStoned](https://github.com/luastoned)

---

<p align="center">
  <sub>Built with ❤️ for the Node.js & TypeScript community</sub>
</p>
