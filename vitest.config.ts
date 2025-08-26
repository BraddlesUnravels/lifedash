import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'coverage/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/eslint.config.*',
      ],
    },
  },
  resolve: {
    alias: {
      '@app/ui': new URL('./apps/ui/src', import.meta.url).pathname,
      '@app/api': new URL('./apps/api/src', import.meta.url).pathname,
      '@app/bgw': new URL('./apps/bgw/src', import.meta.url).pathname,
      '@app/dbo': new URL('./modules/dbo/src', import.meta.url).pathname,
      '@app/shared': new URL('./modules/shared/src', import.meta.url).pathname,
    },
  },
});