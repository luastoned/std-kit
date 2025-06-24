import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: ['es2023'],
  platform: 'neutral',
  outDir: 'lib',
  outExtension: ({ format }) => {
    if (format === 'cjs') return { js: '.cjs' };
    if (format === 'esm') return { js: '.mjs' };
    return { js: '.js' };
  },
  splitting: false,
  sourcemap: true,
  treeshake: true,
  minify: true,
  clean: true,
  dts: true,
});
