import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist']),

  {
    files: ['*/.{ts}'],

    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },

    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      indent: ['error', 2],
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always'],
      'no-console': 'warn',
      complexity: ['error', 10],
      'max-depth': ['error', 3],
      'max-lines-per-function': ['warn', 30],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },
]);