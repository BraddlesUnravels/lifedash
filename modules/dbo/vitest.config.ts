import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json'],
    },
  },
  resolve: {
    alias: {
      '@app/shared': new URL('../shared/src', import.meta.url).pathname,
    },
  },
});
