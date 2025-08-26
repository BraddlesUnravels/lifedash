import { FlatCompat } from '@eslint/eslintrc';
import tseslint from 'typescript-eslint';

const compat = new FlatCompat();

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.json'],
        projectService: true,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
    pluginds: {
      '@typescript-eslint': tseslint.plugin,
    },
  },
  // Enable ESLint core rules if needed
  ...compat.config({
    extends: ['eslint:recommended'],
  }),
  {
    ignores: ['**/node_modules/**', '**/build/**', '**/dist/**'],
  },
  {
    root: true,
  },
];
