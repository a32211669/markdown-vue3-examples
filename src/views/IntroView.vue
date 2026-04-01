<template>
  <div class="demo-page-shell">
    <DemoSplitLayout :code="demoCode" title="介绍">
      <template #note>
        <div class="split-note-title">说明</div>
        <ul>
          <li>本页从项目根目录加载 <code>README.md</code>，用 markdown-vue3 渲染。</li>
          <li>左侧菜单可查看不同渲染策略,包括: tag,fence,container,进度组件,思考组件</li>
        </ul>
      </template>
      <template #preview>
        <div class="markdown-body">
          <MarkdownVue3 :md="md" :source="source" />
        </div>
      </template>
    </DemoSplitLayout>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import MarkdownIt from 'markdown-it';
import { MarkdownVue3 } from 'markdown-vue3';

import DemoSplitLayout from '../components/DemoSplitLayout.vue';

const md = new MarkdownIt({
  html: true,
});
const source = ref('');

const readmeUrl = new URL('../../README.md', import.meta.url).href;

const demoCode = computed(() => {
  if (!source.value) return '// 正在加载 README.md ...';
  return source.value;
});

onMounted(async () => {
  const res = await fetch(readmeUrl);
  source.value = await res.text();
});
</script>
