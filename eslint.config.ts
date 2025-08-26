import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: [
      '**/.backup/*',
      '**/eslint.config.mjs',
      '**/dist/**',
      '**/build/**',
      '**/node_modules/**',
      '**/vite.config.ts',
      '**/vitest.config.ts',
      '**/.env*',
      '**/.vscode/**',
      '**/.husky/**',
    ],
  },
);
