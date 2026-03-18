import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['cjs'],
  target: 'node18',
  clean: true,
  sourcemap: true,
});
