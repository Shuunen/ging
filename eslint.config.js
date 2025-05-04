import { base } from 'eslint-plugin-shuunen/configs/base'
import { browser } from 'eslint-plugin-shuunen/configs/browser'
import { typescript } from 'eslint-plugin-shuunen/configs/typescript'
import { vue } from 'eslint-plugin-shuunen/configs/vue'

export default [
  ...base,
  ...browser,
  ...typescript,
  ...vue,
  {
    name: 'project-overrides',
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
      'jsdoc/require-jsdoc': 'off',
    },
  },
]
