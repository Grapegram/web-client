import pluginVue from 'eslint-plugin-vue'
import {
  defineConfigWithVueTs,
  vueTsConfigs
} from '@vue/eslint-config-typescript'
import pluginVitest from '@vitest/eslint-plugin'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'
import fsdPlugin from 'eslint-plugin-fsd-lint'
// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}']
  },

  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**']
  },

  {
    plugins: {
      fsd: fsdPlugin
    },
    rules: {
      'fsd/forbidden-imports': 'error',
      'fsd/no-relative-imports': 'error',
      'fsd/no-public-api-sidestep': 'error',
      'fsd/no-cross-slice-dependency': 'error',
      'fsd/no-ui-in-business-logic': 'error',
      'fsd/no-global-store-imports': 'error',
      'fsd/ordered-imports': 'error'
    }
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ['src/**/__tests__/*']
  },
  skipFormatting
)
