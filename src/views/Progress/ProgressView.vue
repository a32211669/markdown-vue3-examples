<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import MarkdownIt from 'markdown-it';
import { MarkdownVue3, Renderer } from 'markdown-vue3';
import DemoSplitLayout from '../../components/DemoSplitLayout.vue';

const md = new MarkdownIt({ html: true });

/** 流式追加：多次输出完整 :::progress 块，模拟服务端/模型一段段推送（第二次起为「更新」同一进度区） */
const STREAM_CHUNKS = [
  '## 流式进度演示\n\n模拟 **source** 随时间增长；多次 `:::progress` 会**更新**同一 `#fixed-progress` 区域。\n\n',
  ':::progress\n**30%** — 正在初始化…\n:::\n\n',
  ':::progress\n**60%** — 处理中…\n:::\n\n',
  ':::progress\n**100%** — 完成。\n:::\n\n',
  '---\n\n正文：流式结束后的内容。\n',
];

const source = ref('');
const streamKey = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;
const chunkDelayMs = 700;

function clearTimer() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function runStream() {
  clearTimer();
  source.value = '';
  let i = 0;
  timer = setInterval(() => {
    if (i >= STREAM_CHUNKS.length) {
      clearTimer();
      return;
    }
    source.value += STREAM_CHUNKS[i];
    i++;
  }, chunkDelayMs);
}

function replay() {
  streamKey.value += 1;
  runStream();
}

onMounted(() => {
  runStream();
});

onBeforeUnmount(() => {
  clearTimer();
});

const coreCode = `// 流式：不断追加 source（含多次 :::progress），第二次起为更新同一进度组件
const source = ref('')
// watch 或 setInterval 中：source.value += nextChunk

<MarkdownVue3 :key="streamKey" :md="md" :source="source" :containers="['progress']">
  <template #fixed-progress="{ node }">
    <MyFixedProgress :node="node" />
  </template>
</MarkdownVue3>`;

/** 左侧：流式 chunk 全文 + 集成要点（与右侧实时 source 对应） */
const demoCode = computed(
  () =>
    `// ========== 流式 chunk（逐段追加到 source）==========\n\n` +
    STREAM_CHUNKS.join('') +
    `\n\n// ========== 集成要点 ==========\n\n` +
    coreCode,
);

const noteItems = [
  '容器语法：`:::progress` … `:::`；不写则不显示进度固定区。',
  '页面上只有一个 `#fixed-progress` 实例；多次 `:::progress` 为对同一组件的覆盖更新。',
  '本页用定时追加 `source` 模拟流式；可点「重新播放」再看一遍。',
  '可用默认 UI，也可用 `#fixed-progress` 插槽完全自定义。',
];
</script>

<template>
  <div class="demo-page-shell">
    <DemoSplitLayout title="进度组件插槽" :code="demoCode">
      <template #note>
        <div class="split-note-title">说明</div>
        <ul>
          <li v-for="(t, i) in noteItems" :key="i">{{ t }}</li>
        </ul>
        <div class="demo-replay-actions">
          <el-button type="primary" size="small" @click="replay">重新播放流式</el-button>
        </div>
      </template>
      <template #preview>
        <div class="markdown-body">
          <MarkdownVue3 :key="streamKey" :md="md" :source="source" :containers="['progress']">
            <template #fixed-progress="{ node }">
              <div class="fixed fixed--progress">
                <div class="fixed__title">Fixed Progress（随流式更新）</div>
                <div class="fixed__body">
                  <Renderer :tree="node.children" />
                </div>
              </div>
            </template>

            <template #container:progress="{ node }">
              <div class="inline-hint">（正文区容器：{{ (node.open?.info || '').trim() || 'progress' }}）</div>
              <Renderer :tree="node.children" />
            </template>
          </MarkdownVue3>
        </div>
      </template>
    </DemoSplitLayout>
  </div>
</template>

<style scoped>
.demo-replay-actions {
  margin-top: 10px;
}

.fixed {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  margin: 10px 0 12px;
  background: white;
}

.fixed__title {
  padding: 10px 12px;
  font-weight: 700;
  background: #ecfdf5;
  color: #065f46;
  border-bottom: 1px solid #e5e7eb;
}

.fixed__body {
  padding: 10px 12px;
}

.inline-hint {
  margin: 6px 0 8px;
  color: #6b7280;
  font-size: 13px;
}
</style>
