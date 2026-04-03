<script lang="ts" setup>
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { type GroupToken, MarkdownVue3, Renderer, type RendererToken } from '@npm-brx/markdown-vue3';
import DemoSplitLayout from '../components/DemoSplitLayout.vue';

const md = new MarkdownIt({
  html: true,
});

const source = `
## Tag 插槽（替换原生标签）

markdown-vue3 可对 **HTML 原生标签**进行插槽替换。

- 例如：\`table\` 替换为 \`el-table\`
- 例如：\`img\` 替换为 \`el-image\`

### Table 示例

| name | age | city |
| ---- | --- | ---- |
| Alice | 18 | Hangzhou |
| Bob | 20 | Shenzhen |
| Carol | 22 | Chengdu |

### Img 示例

![示例图片](https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg)

`;

const coreCode = `// 1) 测试用 Markdown（页面直接渲染）
const source = \`
${source.trim()}
\`

// 2) 开启需要接管的标签，并提供对应的 tag 插槽
// - tags = ['img','table'] 表示只对 <img> 与 <table> 做插槽替换
<MarkdownVue3 :md="md" :source="source" :tags="['img','table']">
  <template #tag:img="{ node }">
    <!-- node.open.attrs 里能取到 src/alt/title 等属性 -->
    <el-image
      :src="getAttr(node.open, 'src')"
      :alt="getAttr(node.open, 'alt')"
      fit="cover"
      style="width: 100%; max-width: 640px; border-radius: 10px"
    />
  </template>

  <template #tag:table="{ node }">
    <!-- node 是一个 group token，children 里包含 thead/tbody/tr/td 等 -->
    <template v-if="parseTable(node)">
      <el-table :data="parseTable(node)!.rows" border style="width: 100%">
        <el-table-column
          v-for="col in parseTable(node)!.columns"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
        />
      </el-table>
    </template>
    <template v-else>
      <!-- 解析失败：回退到默认渲染（保持页面不空白） -->
      <Renderer :tree="[node]" />
    </template>
  </template>
</MarkdownVue3>

// 3) 解析 node 的辅助函数（演示用途：可按你的业务更严谨地处理）
function getAttr(openToken: any, name: string): string | undefined {
  // attrs: [ [key,value], ... ]
  const attrs: Array<[string, string]> | null | undefined = openToken?.attrs
  if (!attrs) return undefined
  const hit = attrs.find(([k]) => k === name)
  return hit ? hit[1] : undefined
}

function collectText(node: any): string {
  // group token：递归拼接 children 的文本
  if (node?.type === 'group') return (node.children || []).map(collectText).join('')
  // markdown-it Token：常见文本在 content
  if (typeof node?.content === 'string') return node.content
  if (Array.isArray(node?.children)) return node.children.map(collectText).join('')
  return ''
}

function parseTable(node: any) {
  // 简易解析：从 thead/tbody 取出列名与每行单元格文本，组装成 el-table 所需 data/columns
  // ...
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

function collectText(node: RendererToken): string {
  if ('type' in node && node.type === 'group') {
    return node.children.map(collectText).join('');
  }
  // markdown-it Token
  const token = node as any;
  if (typeof token?.content === 'string') return token.content;
  if (Array.isArray(token?.children)) return token.children.map(collectText).join('');
  return '';
}

function getAttr(openToken: any, name: string): string | undefined {
  const attrs: Array<[string, string]> | null | undefined = openToken?.attrs;
  if (!attrs) return undefined;
  const hit = attrs.find(([k]) => k === name);
  return hit ? hit[1] : undefined;
}

type TableColumn = { label: string; prop: string };
type ParsedTable = { columns: TableColumn[]; rows: Record<string, string>[] };

function parseTable(node: GroupToken): ParsedTable | null {
  const thead = node.children.find((c) => 'type' in c && c.type === 'group' && c.tag === 'thead') as
    | GroupToken
    | undefined;
  const tbody = node.children.find((c) => 'type' in c && c.type === 'group' && c.tag === 'tbody') as
    | GroupToken
    | undefined;

  const headerRow = thead?.children.find((c) => 'type' in c && c.type === 'group' && c.tag === 'tr') as
    | GroupToken
    | undefined;
  const headerCells = headerRow?.children.filter((c) => 'type' in c && c.type === 'group' && c.tag === 'th') ?? [];

  const columns = headerCells.map((cell, idx) => {
    const label = collectText(cell).trim() || `col_${idx + 1}`;
    return { label, prop: `c${idx}` };
  });

  const bodyRows = (tbody?.children.filter((c) => 'type' in c && c.type === 'group' && c.tag === 'tr') ?? []) as
    | GroupToken[]
    | undefined;

  if (!columns.length || !bodyRows?.length) return null;

  const rows = bodyRows.map((tr) => {
    const cells = tr.children.filter((c) => 'type' in c && c.type === 'group' && c.tag === 'td') as GroupToken[];
    const row: Record<string, string> = {};
    for (let i = 0; i < columns.length; i++) {
      row[columns[i].prop] = (cells[i] ? collectText(cells[i]) : '').trim();
    }
    return row;
  });

  return { columns, rows };
}

const tags = ['img', 'table'];

const noteItems = computed(() => [
  'tag 插槽通过 `#tag:<标签名>` 接管对应原生标签渲染。',
  '本页示例：`#tag:img` → el-image，`#tag:table` → el-table（演示用的简易解析）。',
]);
</script>

<template>
  <div class="demo-page-shell">
    <DemoSplitLayout :code-html="coreCodeHtml" title="tag 插槽">
      <template #note>
        <div class="split-note-title">说明</div>
        <ul>
          <li v-for="(t, i) in noteItems" :key="i">{{ t }}</li>
        </ul>
      </template>
      <template #preview>
        <div class="markdown-body">
          <MarkdownVue3 :md="md" :source="source" :tags="tags">
            <template #tag:img="{ node }">
              <div class="tag-img">
                <el-image
                  :alt="getAttr(node.open, 'alt')"
                  :src="getAttr(node.open, 'src')"
                  :title="getAttr(node.open, 'title')"
                  fit="cover"
                  style="width: 100%; max-width: 640px; border-radius: 10px"
                />
              </div>
            </template>

            <template #tag:table="{ node }">
              <div class="tag-table">
                <template v-if="parseTable(node)">
                  <el-table :data="parseTable(node)!.rows" border style="width: 100%">
                    <el-table-column
                      v-for="col in parseTable(node)!.columns"
                      :key="col.prop"
                      :label="col.label"
                      :prop="col.prop"
                    />
                  </el-table>
                </template>
                <template v-else>
                  <Renderer :tree="[node]" />
                </template>
              </div>
            </template>
          </MarkdownVue3>
        </div>
      </template>
    </DemoSplitLayout>
  </div>
</template>

<style scoped>
.tag-img {
  margin: 10px 0 18px;
}

.tag-table {
  margin: 10px 0 18px;
}
</style>
