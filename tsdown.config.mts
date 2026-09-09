import { defineConfig } from 'tsdown';

// Keep the configuration explicitly ESM without changing the package's CommonJS default.

export default defineConfig([
  // Main bundle - browser/universal compatible
  {
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    target: ['es2022'],
    platform: 'neutral',
    outDir: 'lib',
    sourcemap: true,
    treeshake: true,
    minify: true,
    clean: true,
    dts: true,
    // Explicit export lists keep bundled declaration helpers private.
    footer: { dts: 'export {};' },
  },
  // Node.js-specific bundle
  {
    entry: ['src/node.ts'],
    format: ['cjs', 'esm'],
    target: ['es2022'],
    platform: 'node',
    outDir: 'lib',
    sourcemap: true,
    treeshake: true,
    minify: true,
    dts: true,
    // Explicit export lists keep bundled declaration helpers private.
    footer: { dts: 'export {};' },
  },
]);
