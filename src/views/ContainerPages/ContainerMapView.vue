<script setup lang="ts">
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { MarkdownVue3, type GroupToken } from '@npm-brx/markdown-vue3';
import DemoSplitLayout from '../../components/DemoSplitLayout.vue';
import ContainerMap from '../../components/container/ContainerMap.vue';

const md = new MarkdownIt({ html: true });

const source = `
## Container + Map（静态数据）

下面的 \`:::map\` 容器由 \`#container:map\` 插槽接管渲染，并从容器内部的 \`\`\`json\`\`\` 读取静态数据。

::::map
\`\`\`json
{
  "center": [116.397, 39.907],
  "zoom": 8,
  "polygons": [
    {
      "id": "risk-area-1",
      "name": "高风险区A",
      "style": { "stroke": "#ff4d4f", "strokeWidth": 2, "fill": "#ff4d4f", "fillOpacity": 0.25 },
      "paths": [
        [116.10, 40.10],
        [116.35, 40.18],
        [116.52, 39.98],
        [116.28, 39.86],
        [116.10, 40.10]
      ]
    },
    {
      "id": "risk-area-2",
      "name": "高风险区B",
      "style": { "stroke": "#fa8c16", "strokeWidth": 2, "fill": "#fa8c16", "fillOpacity": 0.22 },
      "paths": [
        [116.55, 39.80],
        [116.80, 39.92],
        [116.72, 39.68],
        [116.50, 39.62],
        [116.55, 39.80]
      ]
    }
  ]
}
\`\`\`
::::
`;

const containers = ['map'];

const coreCode = `const source = \`
${source.trim()}
\`

<MarkdownVue3 :md="md" :source="source" :containers="['map']">
  <template #container:map="{ node }">
    <ContainerMap :node="node" />
  </template>
</MarkdownVue3>`;

const noteItems = computed(() => [
  '把结构化数据放在容器内部的 json fence，页面只需要接管对应插槽即可。',
  '`containers` 只声明你要接管的容器名（这里是 `map`）。',
]);
</script>

<template>
  <div class="demo-page-shell">
    <DemoSplitLayout title="container + map" :code="coreCode">
      <template #note>
        <div class="split-note-title">说明</div>
        <ul>
          <li v-for="(t, i) in noteItems" :key="i">{{ t }}</li>
        </ul>
      </template>
      <template #preview>
        <div class="markdown-body">
          <MarkdownVue3 :md="md" :source="source" :containers="containers">
            <template #container:map="{ node }">
              <ContainerMap :node="(node as GroupToken)" />
            </template>
          </MarkdownVue3>
        </div>
      </template>
    </DemoSplitLayout>
  </div>
</template>

