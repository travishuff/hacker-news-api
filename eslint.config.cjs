const globals = require('globals');
const tseslint = require('@typescript-eslint/eslint-plugin');
const tsParser = require('@typescript-eslint/parser');
const importPlugin = require('eslint-plugin-import');

const importRecommended = importPlugin.configs.recommended?.rules ?? {};
const importTypescript = importPlugin.configs.typescript?.rules ?? {};

module.exports = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...importRecommended,
      ...importTypescript,
      'no-console': 'off',
      'import/extensions': 'off',
      'import/no-unresolved': 'off',
    },
  },
  {
    files: ['test/**/*.test.ts'],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-expressions': 'off',
      'no-underscore-dangle': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
];
