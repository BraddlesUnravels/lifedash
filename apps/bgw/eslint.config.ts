import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  ...tseslint.configs.recommendedTypeChecked,
  { ...pluginJs.configs.recommended },
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.json'],
        projectService: true,
        ecmaVersion: 2022,
      },
      globals: globals.node,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
    pluginds: {
      '@typescript-eslint': tseslint.plugin,
    },
  },
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
