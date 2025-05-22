import { FlatCompat } from '@eslint/eslintrc';
import pluginNext from '@next/eslint-plugin-next';
import eslintConfigPrettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config} */
const eslintConfig = [
  ...compat.extends('next', 'next/core-web-vitals', 'prettier'),
  {
    ignores: [
      '**/node_modules/*',
      '**/out/*',
      '**/.next/*',
      '**/coverage',
      'src/styles/globals.css',
    ],
    plugins: {
      prettier: prettierPlugin,
      'simple-import-sort': simpleImportSort,
      import: importPlugin,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...eslintConfigPrettier.rules,
      'prettier/prettier': 'error',
      'no-console': [
        'error',
        {
          allow: ['warn', 'error'],
        },
      ],
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // Packages `react` related packages come first.
            ['^react', '^@?\\w'],
            ['^next', '^@?\\w'],
            // Internal packages.
            ['^(@|components)(/.*|$)'],

            // Parent imports. Put `..` last.
            ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
            // Side effect imports.
            ['^\\u0000'],
            // Other relative imports. Put same-folder imports and `.` last.
            ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
            // Style imports.
            ['^.+\\.?(css|scss)$'],
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
