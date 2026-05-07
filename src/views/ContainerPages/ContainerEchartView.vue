<script setup lang="ts">
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { MarkdownVue3, type GroupToken } from '@npm-brx/markdown-vue3';
import DemoSplitLayout from '../../components/DemoSplitLayout.vue';
import ContainerEchart from '../../components/container/ContainerEchart.vue';

const md = new MarkdownIt({ html: true });

const source = `
## Container + ECharts（静态数据）

下面的 \`:::echart\` 容器由 \`#container:echart\` 接管渲染，并从 json fence 读取图表数据。

::::echart
\`\`\`json
{
  "xAxis": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
  "series": [
    { "name": "访问量", "type": "bar", "data": [120, 200, 150, 80, 70, 110, 130] },
    { "name": "转化率", "type": "line", "data": [12, 18, 15, 9, 8, 11, 13] }
  ]
}
\`\`\`
::::
`;

const containers = ['echart'];

const coreCode = `const source = \`
${source.trim()}
\`

<MarkdownVue3 :md="md" :source="source" :containers="['echart']">
  <template #container:echart="{ node }">
    <ContainerEchart :node="node" />
  </template>
</MarkdownVue3>`;

const noteItems = computed(() => [
  '容器名可以自由定义（这里用 `echart`），只要 `containers` 与插槽名一致。',
  '渲染时读取 json fence，避免把复杂配置散落在页面逻辑里。',
]);
</script>

<template>
  <div class="demo-page-shell">
    <DemoSplitLayout title="container + echart" :code="coreCode">
      <template #note>
        <div class="split-note-title">说明</div>
        <ul>
          <li v-for="(t, i) in noteItems" :key="i">{{ t }}</li>
        </ul>
      </template>
      <template #preview>
        <div class="markdown-body">
          <MarkdownVue3 :md="md" :source="source" :containers="containers">
            <template #container:echart="{ node }">
              <ContainerEchart :node="(node as GroupToken)" />
            </template>
          </MarkdownVue3>
        </div>
      </template>
    </DemoSplitLayout>
  </div>
</template>
