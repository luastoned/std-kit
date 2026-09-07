import assert from 'node:assert/strict';
import { join } from 'node:path';

import ts from 'typescript';

import { contract, entrypoints, projectRoot, sorted, validateRuntimeExports } from './check-runtime.mjs';

function declarationExports(relativePath) {
  const file = join(projectRoot, relativePath);
  const program = ts.createProgram([file], {
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
    skipLibCheck: true,
  });
  const sourceFile = program.getSourceFile(file);
  assert.ok(sourceFile, `Missing declaration output: ${relativePath}`);

  const checker = program.getTypeChecker();
  const moduleSymbol = checker.getSymbolAtLocation(sourceFile);
  assert.ok(moduleSymbol, `Could not inspect declaration output: ${relativePath}`);

  return sorted(checker.getExportsOfModule(moduleSymbol).map((symbol) => symbol.name));
}

const runtimeCount = await validateRuntimeExports();
let declarationCount = 0;

for (const [name, files] of Object.entries(entrypoints)) {
  const expected = contract[name];
  assert.ok(expected, `Missing ${name} entrypoint in public export contract`);
  assert.deepEqual(expected.types, sorted(expected.types), `${name} type contract must be sorted`);

  const expectedDeclarations = sorted([...expected.runtime, ...expected.types]);
  assert.equal(new Set(expectedDeclarations).size, expectedDeclarations.length, `${name} export contract contains duplicates`);

  for (const declaration of files.declarations) {
    assert.deepEqual(declarationExports(declaration), expectedDeclarations, `${declaration} exports differ from scripts/public-exports.json`);
  }

  declarationCount += expectedDeclarations.length;
}

console.log(`Validated ${runtimeCount} runtime exports and ${declarationCount} declaration exports across CJS and ESM.`);
