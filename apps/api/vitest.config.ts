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
      '@app/dbo': new URL('../../modules/dbo/src', import.meta.url).pathname,
      '@app/shared': new URL('../../modules/shared/src', import.meta.url).pathname,
      '@app/bgw': new URL('../bgw/src', import.meta.url).pathname,
    },
  },
});