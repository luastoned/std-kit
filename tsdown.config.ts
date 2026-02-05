import { defineConfig } from 'tsdown';

export default defineConfig([
  // Main bundle - browser/universal compatible
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    target: ['es2023'],
    platform: 'neutral',
    outDir: 'lib',
    sourcemap: true,
    treeshake: true,
    minify: true,
    clean: true,
    dts: true,
  },
  // Node.js-specific bundle
  {
    entry: ['src/node.ts'],
    format: ['cjs', 'esm'],
    target: ['node20'],
    platform: 'node',
    outDir: 'lib',
    sourcemap: true,
    treeshake: true,
    minify: true,
    dts: true,
  },
]);
