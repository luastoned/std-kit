import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);

const coreEsm = await import(join(projectRoot, 'lib/index.mjs'));
const nodeEsm = await import(join(projectRoot, 'lib/node.mjs'));
const coreCjs = require(join(projectRoot, 'lib/index.js'));
const nodeCjs = require(join(projectRoot, 'lib/node.cjs'));

assert.deepEqual(Object.keys(coreEsm).sort(), Object.keys(coreCjs).sort(), 'Core CJS and ESM exports differ');
assert.deepEqual(Object.keys(nodeEsm).sort(), Object.keys(nodeCjs).sort(), 'Node CJS and ESM exports differ');
assert.equal(typeof coreEsm.mergeObject, 'function');
assert.equal(typeof coreEsm.createHeap, 'function');
assert.equal(typeof nodeEsm.streamToBuffer, 'function');

await Promise.all(['index.d.ts', 'index.d.mts', 'node.d.cts', 'node.d.mts'].map((file) => access(join(projectRoot, 'lib', file))));

console.log(`Validated ${Object.keys(coreEsm).length} core exports and ${Object.keys(nodeEsm).length} Node exports in CJS and ESM.`);
