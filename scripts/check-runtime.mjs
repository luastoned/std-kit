import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
export const contract = JSON.parse(await readFile(join(projectRoot, 'scripts/public-exports.json'), 'utf8'));
export const entrypoints = {
  core: {
    esm: 'lib/index.mjs',
    cjs: 'lib/index.js',
    declarations: ['lib/index.d.ts', 'lib/index.d.mts'],
  },
  node: {
    esm: 'lib/node.mjs',
    cjs: 'lib/node.cjs',
    declarations: ['lib/node.d.cts', 'lib/node.d.mts'],
  },
};

export function sorted(values) {
  return [...values].sort();
}

export async function validateRuntimeExports() {
  const require = createRequire(import.meta.url);
  let runtimeCount = 0;

  for (const [name, files] of Object.entries(entrypoints)) {
    const expected = contract[name];
    assert.ok(expected, `Missing ${name} entrypoint in public export contract`);
    assert.deepEqual(expected.runtime, sorted(expected.runtime), `${name} runtime contract must be sorted`);

    const esm = await import(join(projectRoot, files.esm));
    const cjs = require(join(projectRoot, files.cjs));
    const runtimeExports = sorted(Object.keys(esm));

    assert.deepEqual(runtimeExports, sorted(Object.keys(cjs)), `${name} CJS and ESM exports differ`);
    assert.deepEqual(runtimeExports, expected.runtime, `${name} runtime exports differ from scripts/public-exports.json`);
    runtimeCount += expected.runtime.length;
  }

  return runtimeCount;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const runtimeCount = await validateRuntimeExports();
  console.log(`Validated ${runtimeCount} runtime exports across CJS and ESM.`);
}
