<script setup lang="ts">
import { computed } from 'vue';
import MarkdownIt from 'markdown-it';
import { MarkdownVue3, type GroupToken } from '@npm-brx/markdown-vue3';
import DemoSplitLayout from '../../components/DemoSplitLayout.vue';
import ContainerCarousel from '../../components/container/ContainerCarousel.vue';

const md = new MarkdownIt({ html: true });

const source = `
## Container + 轮播图（静态数据）

下面的 \`:::carousel\` 容器由 \`#container:carousel\` 接管渲染。

::::carousel
\`\`\`json
{
  "height": 280,
  "interval": 3000,
  "items": [
    {
      "url": "https://picsum.photos/seed/markdown-vue3-1/1200/600",
      "title": "第一张",
      "caption": "使用静态 URL + 标题/描述"
    },
    {
      "url": "https://picsum.photos/seed/markdown-vue3-2/1200/600",
      "title": "第二张",
      "caption": "容器里仅保留结构化数据"
    },
    {
      "url": "https://picsum.photos/seed/markdown-vue3-3/1200/600",
      "title": "第三张",
      "caption": "页面用插槽接管并渲染组件"
    }
  ]
}
\`\`\`
::::
`;

const containers = ['carousel'];

const coreCode = `const source = \`
${source.trim()}
\`

<MarkdownVue3 :md="md" :source="source" :containers="['carousel']">
  <template #container:carousel="{ node }">
    <ContainerCarousel :node="node" />
  </template>
</MarkdownVue3>`;

const noteItems = computed(() => [
  '轮播内容来自容器内部的 json fence（items 数组）。',
  '此页用 Element Plus `el-carousel` 渲染，数据完全静态。',
]);
</script>

<template>
  <div class="demo-page-shell">
    <DemoSplitLayout title="container + 轮播图" :code="coreCode">
      <template #note>
        <div class="split-note-title">说明</div>
        <ul>
          <li v-for="(t, i) in noteItems" :key="i">{{ t }}</li>
        </ul>
      </template>
      <template #preview>
        <div class="markdown-body">
          <MarkdownVue3 :md="md" :source="source" :containers="containers">
            <template #container:carousel="{ node }">
              <ContainerCarousel :node="(node as GroupToken)" />
            </template>
          </MarkdownVue3>
        </div>
      </template>
    </DemoSplitLayout>
  </div>
</template>

