import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  // Global ignores careful not to duplicate
  {
    ignores: [
      '**/*.md',
      '**/*.yml',
      '**/*.yaml',
      '**/*.toml',
      '**/*.lock',
      '**/.env*',
      '**/.gitattributes',
      '**/.gitignore',
      '**/.git',
      '**/.vscode',
      '**/.husky',
      '**/.backup/*',
      '**/dist/**',
      '**/build/**',
      '**/backend-build/**',
      '**/__tests__/**',
      '**/node_modules/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,

  // Monorepo specific
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,json}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },

  // @app/api & @app/dbo overrides
  {
    files: ['apps/api/**/*.{ts,js,json}', 'packages/{dbo,admin-api}/**/*.{ts,js,json}'],
    languageOptions: {
      globals: { ...globals.node, Bun: 'readonly' },
    },
  },

  // UI package overrides
  {
    files: ['apps/ui/**/*.{ts,tsx,json,html}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // HMR saftey
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
);
