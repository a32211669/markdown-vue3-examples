/**
 * 格式以 Prettier 为准；ESLint 通过 eslint-config-prettier/flat 关闭冲突规则。
 * prettier-plugin-vue@1.x 需配合 Prettier 2.8.x（与 Prettier 3 不兼容）。
 * @type {import('prettier').Options}
 */
module.exports = {
  $schema: 'https://json.schemastore.org/prettierrc',
  plugins: [require.resolve('prettier-plugin-vue')],

  // 一行最多 120 字符
  printWidth: 120,
  // 使用 2 个空格缩进
  tabWidth: 2,
  // 不使用 tab 缩进，而使用空格
  useTabs: false,
  // 行尾需要有分号
  semi: true,
  // 使用单引号代替双引号
  singleQuote: true,
  // 对象的 key 仅在必要时用引号
  quoteProps: 'as-needed',
  // 末尾使用逗号
  trailingComma: 'all',
  // 大括号内的首尾需要空格：{ foo: bar }、import { a } from 'b'
  bracketSpacing: true,
  // 箭头函数只有一个参数时也保留括号
  arrowParens: 'always',
  // 不需要写文件开头的 @prettier
  requirePragma: false,
  // 不需要自动在文件开头插入 @prettier
  insertPragma: false,
  // Markdown / 纯文本按原样折行
  proseWrap: 'preserve',
  // 根据显示样式决定 html 要不要折行
  htmlWhitespaceSensitivity: 'css',
  // 换行符使用 LF（与常见 CI / Git 配置一致）
  endOfLine: 'lf',
};
