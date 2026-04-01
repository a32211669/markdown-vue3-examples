import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import pluginVue from 'eslint-plugin-vue';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
  { ignores: ['dist/**', 'node_modules/**', 'src/env.d.ts'] },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  {
    files: ['**/*.{ts,mts,cts}'],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      'no-unused-vars': 'off',
    },
  },
  // 保存时用 ESLint --fix 即可跑 Prettier（不依赖 Prettier 扩展是否接管「格式化」）
  {
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  // 必须放最后：关闭与 Prettier 冲突的其它 ESLint 格式规则
  eslintConfigPrettier,
];
