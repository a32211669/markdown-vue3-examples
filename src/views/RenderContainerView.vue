<script setup lang="ts">
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { MarkdownVue3, Renderer, type GroupToken } from 'markdown-vue3';
import DemoSplitLayout from '../components/DemoSplitLayout.vue';

const md = new MarkdownIt({
  html: true,
});

const source = `
## Container 插槽（替换 ::: 容器）

markdown-vue3 支持 \`markdown-it-container\` 风格的容器语法：

- 自定义容器：\`:::tip\` / \`:::warning\` …

### Tip 容器

:::tip
这里是 tip 容器内容。
支持 **加粗**、列表、以及其它 Markdown。
- item 1
- item 2
:::

### Warning 容器

:::warning
这里是 warning 容器内容。
:::
`;

const containers = ['tip', 'warning'];

const coreCode = `// 1) 测试用 Markdown（页面直接渲染）
const source = \`
${source.trim()}
\`

// 2) 开启需要接管的容器，并提供对应的 container 插槽
// - containers = ['tip','warning'] 表示接管 :::tip 与 :::warning
<MarkdownVue3 :md="md" :source="source" :containers="['tip','warning']">
  <template #container:tip="{ node }">
    <!-- node 是一个 group token：node.open.info 里有容器名字与参数，node.children 是容器内部内容 -->
    <YourTip :node="node" />
  </template>

  <template #container:warning="{ node }">
    <YourWarning :node="node" />
  </template>
</MarkdownVue3>

// 3) 解析 node 的辅助函数（示例：从 :::tip 后面取“标题”）
function titleFromContainer(node: any): string {
  // node.open.info 形如: "tip 这里是标题"
  const info = node?.open?.info || ''
  const parts = info.trim().split(/\\s+/)
  return parts.slice(1).join(' ').trim()
}`;

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function highlightTemplateBlocks(code: string): string {
  const START = '___TPL_START___';
  const END = '___TPL_END___';
  const marked = code.replace(/<template[\s\S]*?<\/template>/g, (m) => `${START}${m}${END}`);
  const escaped = escapeHtml(marked);
  return escaped.replaceAll(START, '<span class="code-hot">').replaceAll(END, '</span>');
}

const coreCodeHtml = computed(() => highlightTemplateBlocks(coreCode));

function titleFromContainer(node: GroupToken): string {
  const info = node.open?.info || '';
  const parts = info.trim().split(/\s+/);
  // e.g. "tip 标题文本" => ["tip","标题文本..."]
  return parts.slice(1).join(' ').trim();
}

const noteItems = computed(() => [
  'container 插槽通过 `#container:<名字>` 接管对应 `:::<名字>` 容器渲染。',
  '本页示例：`tip` / `warning` 走自定义组件样式。',
]);
</script>

<template>
  <div class="demo-page-shell">
    <DemoSplitLayout title="container 插槽" :code-html="coreCodeHtml">
      <template #note>
        <div class="split-note-title">说明</div>
        <ul>
          <li v-for="(t, i) in noteItems" :key="i">{{ t }}</li>
        </ul>
      </template>
      <template #preview>
        <div class="markdown-body">
          <MarkdownVue3 :md="md" :source="source" :containers="containers">
            <template #container:tip="{ node }">
              <div class="box box--tip">
                <div class="box__title">
                  Tip<span v-if="titleFromContainer(node)">：{{ titleFromContainer(node) }}</span>
                </div>
                <div class="box__body">
                  <Renderer :tree="node.children" />
                </div>
              </div>
            </template>

            <template #container:warning="{ node }">
              <div class="box box--warning">
                <div class="box__title">
                  Warning<span v-if="titleFromContainer(node)">：{{ titleFromContainer(node) }}</span>
                </div>
                <div class="box__body">
                  <Renderer :tree="node.children" />
                </div>
              </div>
            </template>
          </MarkdownVue3>
        </div>
      </template>
    </DemoSplitLayout>
  </div>
</template>

<style scoped>
.box {
  margin: 10px 0 18px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.box__title {
  padding: 10px 12px;
  font-weight: 700;
  border-bottom: 1px solid #e5e7eb;
}

.box__body {
  padding: 12px 14px;
}

.box--tip .box__title {
  background: #eff6ff;
  color: #1e40af;
}

.box--warning .box__title {
  background: #fff7ed;
  color: #9a3412;
}
</style>
