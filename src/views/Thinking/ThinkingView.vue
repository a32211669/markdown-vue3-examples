<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import MarkdownIt from 'markdown-it';
import { MarkdownVue3, Renderer } from '@npm-brx/markdown-vue3';
import FixedThinkingAccumulate from './FixedThinkingAccumulate.vue';
import DemoSplitLayout from '../../components/DemoSplitLayout.vue';

const md = new MarkdownIt({ html: true });

/**
 * 流式追加多段 :::thinking；库内 DefaultThinking 会对 node 去重后按 _stableKey 累加到 tree，
 * 与 FixedThinkingAccumulate 行为一致。
 */
const STREAM_CHUNKS = [
  '## 流式思考演示\n\n模拟 **source** 一段段增长；每出现一段新的 `:::thinking`（新 _stableKey）会**累加**到同一固定区。\n\n',
  ':::thinking\n第一段：检索上下文…\n:::\n\n',
  ':::thinking\n第二段：调用工具…\n:::\n\n',
  ':::thinking\n第三段：综合结论。\n:::\n\n',
  '---\n\n正文：流式结束。\n',
];

const source = ref('');
const streamKey = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;
const chunkDelayMs = 800;

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

const coreCode = `// 流式：追加多段 :::thinking；自定义固定区按 _stableKey 累加（见 FixedThinkingAccumulate.vue）
const source = ref('')

<MarkdownVue3 :key="streamKey" :md="md" :source="source" :containers="['thinking']">
  <template #fixed-thinking="{ node }">
    <FixedThinkingAccumulate :node="node" />
  </template>
</MarkdownVue3>

// FixedThinkingAccumulate：watch(node)，未出现过的 _stableKey 则 tree.push(node)，
// <Renderer :tree="tree" /> 与库内 DefaultThinking 一致。`;

const demoCode = computed(
  () =>
    `// ========== 流式 chunk（逐段追加到 source）==========\n\n` +
    STREAM_CHUNKS.join('') +
    `\n\n// ========== 集成要点（与库内 DefaultThinking 一致）==========\n\n` +
    coreCode,
);

const noteItems = [
  '容器语法：`:::thinking` … `:::`；不写则不显示思考固定区。',
  '页面上只有一个 `#fixed-thinking`；多段 thinking 在自定义组件内按 `_stableKey` **累加**（见下方实现）。',
  '本页用定时追加 `source` 模拟流式；可点「重新播放」。',
  '内置 DefaultThinking 与 `FixedThinkingAccumulate.vue` 思路相同：`watch(node)` + `tree` + `<Renderer :tree="tree" />`。',
];
</script>

<template>
  <div class="demo-page-shell">
    <DemoSplitLayout title="思考组件插槽" :code="demoCode">
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
          <MarkdownVue3 :key="streamKey" :md="md" :source="source" :containers="['thinking']">
            <template #fixed-thinking="{ node }">
              <FixedThinkingAccumulate :node="node" />
            </template>

            <template #container:thinking="{ node }">
              <div class="inline-hint">（正文区容器：{{ (node.open?.info || '').trim() || 'thinking' }}）</div>
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

.inline-hint {
  margin: 6px 0 8px;
  color: #6b7280;
  font-size: 13px;
}
</style>
