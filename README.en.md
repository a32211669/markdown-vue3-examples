#### Introduction

This repo is the demo project for [@npm-brx/markdown-vue3](https://www.npmjs.com/package/@npm-brx/markdown-vue3) **2.0.0**, covering thinking/progress panels, custom containers, and AI streaming.

#### Versions

- `@npm-brx/markdown-vue3`: `2.0.0`
- `markdown-it`: `^14.1.1`
- `markdown-it-container`: `^4.0.0`
- `vue`: `^3.5.30`

#### Install & run

```bash
npm install
npm run dev
```

#### Demo pages

| Route | Description |
|-------|-------------|
| Thinking | `#fixed-thinking="{ contents }"` + `DefaultThinking` |
| Progress | `#fixed-progress="{ nodes }"` + `DefaultProgress` |
| AI stream | Simulated streaming `source` with fixed panels |
| Containers | Custom `#container:*` slots (map, echart, carousel) |

#### Fixed-area API in 2.0 (breaking vs 1.x)

| Slot | 2.0 props | Component |
|------|-----------|-----------|
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

#### Dependency injection

`MarkdownVue3` provides the markdown-it instance via `provide('md', md)`. Custom components inside slots can use `inject('md')` instead of prop drilling; with `:sanitize` set, also use `inject('sanitizeHtml')`.

#### Security

The component renders HTML via `v-html`. Pass `:sanitize` for untrusted input (e.g. DOMPurify).

#### Links

- npm: https://www.npmjs.com/package/@npm-brx/markdown-vue3
- GitHub: https://github.com/a32211669/markdown-vue3-examples.git
