#### 介绍

本仓库是 [@npm-brx/markdown-vue3](https://www.npmjs.com/package/@npm-brx/markdown-vue3) **2.0.0** 的示例项目，演示思考/进度面板、自定义容器、AI 流式渲染等用法。

#### 依赖版本

- `@npm-brx/markdown-vue3`: `2.0.0`
- `markdown-it`: `^14.1.1`
- `markdown-it-container`: `^4.0.0`
- `vue`: `^3.5.30`

#### 安装与运行

```bash
npm install
npm run dev
```

#### 示例页面

| 路由 | 说明 |
|------|------|
| 思考组件 | `#fixed-thinking="{ contents }"` + `DefaultThinking` |
| 进度组件 | `#fixed-progress="{ nodes }"` + `DefaultProgress` |
| AI 流式 | 模拟流式追加 `source`，progress/thinking 固定区面板 |
| 自定义容器 | map / echart / carousel 等 `#container:*` 插槽 |

#### 2.0 固定区 API（相对 1.x 变更）

| 插槽 | 2.0 参数 | 组件 Prop |
|------|----------|-----------|
| `#fixed-thinking` | `{ contents: string[] }` | `DefaultThinking :contents` |
| `#fixed-progress` | `{ nodes: GroupToken[] }` | `DefaultProgress :nodes` |

```vue
<MarkdownVue3 :md="md" :source="source" :containers="['thinking', 'progress']">
  <template #fixed-thinking="{ contents }">
    <DefaultThinking :contents="contents" />
  </template>
  <template #fixed-progress="{ nodes }">
    <DefaultProgress :nodes="nodes" />
  </template>
</MarkdownVue3>
```

#### 依赖注入

`MarkdownVue3` 内部已通过 `provide('md', md)` 注册 markdown-it 实例。在插槽内的自定义组件中可直接 `inject('md')` 获取，无需再 prop 传递；若设置了 `:sanitize`，还可 `inject('sanitizeHtml')`。

#### 安全说明

组件内部使用 `v-html` 渲染 HTML。若 `source` 来自不可信输入，请传入 `:sanitize` 函数（例如 DOMPurify）。

#### 相关链接

- npm 包：https://www.npmjs.com/package/@npm-brx/markdown-vue3
- GitHub：https://github.com/a32211669/markdown-vue3-examples.git
