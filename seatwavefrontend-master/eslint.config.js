import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ['cypress/**/*.js', '**/*.cy.{js,jsx}'],
    languageOptions: {
      globals: {
        cy:          'readonly',
        Cypress:     'readonly',
        describe:    'readonly',
        context:     'readonly',
        it:          'readonly',
        before:      'readonly',
        beforeEach:  'readonly',
        after:       'readonly',
        afterEach:   'readonly',
        expect:      'readonly',
        assert:      'readonly',
      },
    },
  },
])