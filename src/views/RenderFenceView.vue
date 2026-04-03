<script setup lang="ts">
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { MarkdownVue3, Renderer, type RendererToken } from '@npm-brx/markdown-vue3';
import DemoSplitLayout from '../components/DemoSplitLayout.vue';

const md = new MarkdownIt({
  html: true,
});

const source = `
## Fence 插槽（替换代码块）

markdown-vue3 可对 **fence 代码块**进行插槽替换（按语言标识区分）。

- 例如：\`\`\`json\` 替换为结构化组件（表格/描述列表）
- 例如：\`\`\`js\` 替换为自定义高亮容器

### JSON 示例

\`\`\`json
{
  "name": "Alice",
  "age": 18,
  "city": "Hangzhou",
  "active": true
}
\`\`\`

### JS 示例

\`\`\`js
export function sum(a, b) {
  return a + b
}
\`\`\`
`;

const coreCode = `// 1) 测试用 Markdown（页面直接渲染）
const source = \`
${source.trim()}
\`

// 2) 开启需要接管的 fence 语言，并提供对应的 fence 插槽
// - fences = ['json','js'] 表示只对 \`\`\`json 与 \`\`\`js 代码块做插槽替换
<MarkdownVue3 :md="md" :source="source" :fences="['json','js']">
  <template #fence:json="{ node }">
    <!-- node 是 fence token，node.content 是代码块内容 -->
    <YourJsonComponent :json="node.content" />
  </template>

  <template #fence:js="{ node }">
    <YourCodeComponent lang="js" :code="node.content" />
  </template>
</MarkdownVue3>

// 3) 解析 node 的辅助函数（示例：把 json fence 转成 Object.entries 渲染）
function safeJsonParse(input: string): unknown | null {
  try {
    return JSON.parse(input)
  } catch {
    return null
  }
}

function jsonObjectEntries(input: string): Array<[string, unknown]> | null {
  // 注意：Object.entries 只能用于“普通对象”，null/数组/基本类型都会出错或不符合预期
  const value = safeJsonParse(input)
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return Object.entries(value as Record<string, unknown>)
}`;

function collectText(node: RendererToken): string {
  if ('type' in node && node.type === 'group') {
    return node.children.map(collectText).join('');
  }
  const token = node as any;
  if (typeof token?.content === 'string') return token.content;
  if (Array.isArray(token?.children)) return token.children.map(collectText).join('');
  return '';
}

function safeJsonParse(input: string): unknown | null {
  try {
    return JSON.parse(input);
  } catch {
    return null;
  }
}

function jsonObjectEntries(input: string): Array<[string, unknown]> | null {
  const value = safeJsonParse(input);
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return Object.entries(value as Record<string, unknown>);
}

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

const fences = ['json', 'js'];

const noteItems = computed(() => [
  'fence 插槽通过 `#fence:<语言>` 接管对应代码块渲染（如 `#fence:json`）。',
  '本页示例：`json` → el-descriptions，`js` → 自定义代码块容器；解析失败会 fallback 回默认渲染。',
]);
</script>

<template>
  <div class="demo-page-shell">
    <DemoSplitLayout title="fence 插槽" :code-html="coreCodeHtml">
      <template #note>
        <div class="split-note-title">说明</div>
        <ul>
          <li v-for="(t, i) in noteItems" :key="i">{{ t }}</li>
        </ul>
      </template>
      <template #preview>
        <div class="markdown-body">
          <MarkdownVue3 :md="md" :source="source" :fences="fences">
            <template #fence:json="{ node }">
              <div class="fence-box">
                <template v-if="jsonObjectEntries(collectText(node))">
                  <el-descriptions border :column="1" size="small" class="fence-desc">
                    <el-descriptions-item v-for="[k, v] in jsonObjectEntries(collectText(node))!" :key="k" :label="k">
                      {{ typeof v === 'string' ? v : JSON.stringify(v) }}
                    </el-descriptions-item>
                  </el-descriptions>
                </template>
                <template v-else>
                  <Renderer :tree="[node]" />
                </template>
              </div>
            </template>

            <template #fence:js="{ node }">
              <div class="fence-box fence-code">
                <div class="fence-code__title">JavaScript</div>
                <pre class="fence-code__pre"><code>{{ collectText(node) }}</code></pre>
              </div>
            </template>
          </MarkdownVue3>
        </div>
      </template>
    </DemoSplitLayout>
  </div>
</template>

<style scoped>
.fence-box {
  margin: 10px 0 18px;
}

.fence-code {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
}

.fence-code__title {
  padding: 10px 12px;
  font-weight: 700;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.fence-code__pre {
  margin: 0;
  padding: 12px 14px;
  background: #0b1020;
  color: #e5e7eb;
  overflow: auto;
  line-height: 1.6;
}
</style>
