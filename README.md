#### 介绍

**markdown-vue3** 是一个轻量、高效的 Markdown 渲染组件，基于 Vue 3 和 markdown-it 开发。  
支持常见 Markdown 语法、代码高亮、**vue 插槽写法**，**自定义规则** 适用于 **AI 流式回答**、内容管理系统等场景。

#### 软件架构

- 基于 **Vue 3** 开发，使用 Composition API
- 使用 **markdown-it** 作为 Markdown 解析器
  - 支持自定义渲染规则
  - 替换默认渲染规则

#### 开发版本说明

- `markdown-it`: `^14.1.1`
- `markdown-it-container`: `^4.0.0`
- `vue`: `^3.5.30`

#### 安装教程

1. 安装依赖：

   ```bash
   npm install @npm-brx/markdown-vue3
   # 或
   pnpm add @npm-brx/markdown-vue3
   ```

2. 若需要代码高亮，请额外安装高亮库：
   ```bash
   npm install highlight.js
   ```

#### 使用说明

```vue
<template>
  <div class="markdown-body">
    <MarkdownVue3 :md="md" :source="source"></MarkdownVue3>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MarkdownIt from 'markdown-it';
import { MarkdownVue3 } from '@npm-brx/markdown-vue3';

// 和正常使用的 MarkdownIt 实例一样使用

const md = new MarkdownIt({
  html: true,
});
const source = ref('# 标题\\n\\n这是一段 **Markdown** 内容。');
</script>
```

#### 思考面板（插槽用法）

#### 插槽完整写法（MarkdownVue3）

`MarkdownVue3` 会把解析出来的 token 分组后渲染，你可以用插槽接管不同类型的节点渲染。

- **固定区插槽（面板）**
  - `#fixed-thinking="{ node }"`：接收 `:::thinking` 容器的 `node`
  - `#fixed-progress="{ node }"`：接收 `:::progress` 容器的 `node`
- **动态插槽（按类型接管）**
  - `#container:<name>="{ node }"`：接管 `markdown-it-container` 容器（例如 `container:thinking`、`container:progress`）
  - `#fence:<lang>="{ node }"`：接管代码块（例如 `fence:js`、`fence:json`），需要在 `:fences="['js','json']"` 注册
  - `#tag:<tag>="{ node }"`：接管 HTML tag（例如 `tag:img`），需要在 `:tags="['img']"` 注册

> 注意：`:::thinking / :::progress` 这类容器语法必须通过 `:containers="['thinking','progress']"` 显式注册，才会生效。

1. 开启 `:::thinking` 容器并渲染固定区（需要显式注册 `containers`）：

   ```vue
   <template>
     <div class="markdown-body">
       <MarkdownVue3 :md="md" :source="source" :containers="['thinking']">
         <!-- fixed-thinking：思考固定区（面板） -->
         <template #fixed-thinking="{ node }">
           <DefaultThinking :node="node" />
         </template>
       </MarkdownVue3>
     </div>
   </template>
   ```

<script setup lang="ts">
import { ref } from 'vue'
import MarkdownIt from 'markdown-it'
import { MarkdownVue3, DefaultThinking } from '@npm-brx/markdown-vue3'

const md = new MarkdownIt({ html: true })
const source = ref([
  '正文内容...',
  '',
  ':::thinking',
  '这里是思考内容',
  ':::'
].join('\\n'))
</script>

````

2. `DefaultThinking` 的 `title` 插槽完整写法；**自定义标题栏时，折叠按钮需要你自己实现**（用 expose 的 `setCollapsed/collapsed`）：

```vue
<template>
<!-- node 由 #fixed-thinking 或 #container:thinking 提供 -->
<DefaultThinking ref="thinkingRef" :node="node">
 <template #title>
   <span class="title">思考（自定义 title 插槽）</span>
   <button class="collapse-toggle" type="button" @click="toggle">
     {{ thinkingRef?.collapsed ? '展开' : '收起' }}
   </button>
 </template>
</DefaultThinking>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { FixedPanelExpose } from '@npm-brx/markdown-vue3'

const thinkingRef = ref<FixedPanelExpose | null>(null)
function toggle() {
const inst = thinkingRef.value
if (!inst) return
inst.setCollapsed(!inst.collapsed)
}
</script>
````

3. 你也可以用 `useFixedPanelCollapse` 自己做“折叠状态”，再通过 expose 控制面板：

   ```vue
   <template>
     <DefaultThinking ref="thinkingRef" :node="node">
       <template #title>
         <span class="title">思考（useFixedPanelCollapse）</span>
         <button class="collapse-toggle" type="button" @click="setCollapsed(!collapsed)">
           {{ collapsed ? '展开' : '收起' }}
         </button>
       </template>
     </DefaultThinking>
   </template>
   ```

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FixedPanelExpose } from '@npm-brx/markdown-vue3'
import { useFixedPanelCollapse } from '@npm-brx/markdown-vue3'

const thinkingRef = ref<FixedPanelExpose | null>(null)
const { expanded, setCollapsed } = useFixedPanelCollapse(true)
const collapsed = computed(() => !expanded.value)

// 如果你希望同步控制组件内部折叠，也可以在 setCollapsed 后再调用：
// thinkingRef.value?.setCollapsed(nextCollapsed)
</script>

````

4. （可选）如果你想把 `:::thinking` 在正文区也渲染出来，可以接管 `#container:thinking`：

```vue
<MarkdownVue3 :md="md" :source="source" :containers="['thinking']">
<template #fixed-thinking="{ node }">
 <DefaultThinking :node="node" />
</template>

<template #container:thinking="{ node }">
 <div style="margin: 8px 0; color: #6b7280">（正文区容器：thinking）</div>
 <Renderer :tree="node.children" />
</template>
</MarkdownVue3>
````

3. **必须安装的插件**：

   ```bash
   npm install markdown-it-container
   ```

   ```javascript
   // 注意,不需要use 组件内部自动use注册
   import MarkdownIt from 'markdown-it';

   const md = new MarkdownIt({
     html: true,
   });
   ```

#### 特技

1. GitHub 示例地址 https://github.com/a32211669/markdown-vue3-examples.git
