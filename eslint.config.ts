import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
// @ts-ignore
import nextjs from '@next/eslint-plugin-next';

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


  // @app/api workspace
  {
    files: ['apps/api/**/*.{ts,js}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['apps/api/*.js'],
          defaultProject: 'apps/api/tsconfig.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node, Bun: 'readonly' },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },

  // @app/dbo workspace
  {
    files: ['modules/dbo/**/*.{ts,js}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['modules/dbo/*.js'],
          defaultProject: 'modules/dbo/tsconfig.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },

  // @app/bgw workspace
  {
    files: ['apps/bgw/**/*.{ts,js}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['apps/bgw/*.js'],
          defaultProject: 'apps/bgw/tsconfig.json',
        },
        tsconfigRootDir: import.meta.dirname,
      },
      globals: { ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
    },
  },

  // @app/ui workspace (Next.js)
  {
    files: ['apps/ui/**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: {
          allowDefaultProject: ['apps/ui/*.js'],
          defaultProject: 'apps/ui/tsconfig.json',
        },
        tsconfigRootDir: import.meta.dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: react,
      'react-hooks': reactHooks,
      '@next/next': nextjs,
    },
    settings: { 
      react: { version: 'detect' },
      next: { rootDir: 'apps/ui' }
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...nextjs.configs.recommended.rules,
      ...nextjs.configs['core-web-vitals'].rules,
      // Next.js specific
      '@next/next/no-html-link-for-pages': ['error', 'apps/ui/src/app'],
    },
  },
);
