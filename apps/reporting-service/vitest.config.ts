import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      reporter: ['text', 'html'],
      exclude: ['node_modules', 'dist/','repositories','publishers'],
    },
  },
  resolve: {
    alias: {
      '@packages': path.resolve(__dirname, '../../packages'),
    },
  },
});
