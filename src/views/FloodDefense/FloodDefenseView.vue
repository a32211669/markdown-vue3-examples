<script setup lang="ts">
import ChatPanel from '../../components/ChatPanel.vue';
import { FLOOD_DEFENSE_MOCK, type FloodDefenseMockItem } from './mock';

function normalizeQuestion(s: string): string {
  return s
    .replaceAll('“', '"')
    .replaceAll('”', '"')
    .replaceAll('？', '?')
    .replaceAll('，', ',')
    .replaceAll('。', '.')
    .replaceAll(/\s+/g, '')
    .replaceAll(/["'`]/g, '')
    .replaceAll(/[?？.!，,。]/g, '')
    .toLowerCase();
}

function findMock(question: string): FloodDefenseMockItem | undefined {
  const q = normalizeQuestion(question);
  return FLOOD_DEFENSE_MOCK.find((m) => {
    const a = normalizeQuestion(m.answer);
    return a.includes(q) || q.includes(a);
  });
}

async function answerProvider(question: string): Promise<string> {
  const item = findMock(question);
  if (!item) {
    return `未在 mock 中命中该问题。\n\n- 你的问题：${question}\n- 已收录问题：\n${FLOOD_DEFENSE_MOCK.map((m) => `  - ${m.answer}`).join('\n')}`;
  }
  // mock 的问答内容严格保持原样，不做任何加工或追加
  return item.content;
}
</script>

<template>
  <div class="demo-page-shell flood-defense-page">
    <ChatPanel :answer-provider="answerProvider" :hide-user-content="false" />
  </div>
</template>

<style scoped>
.flood-defense-page {
  height: 100%;
  padding: 0;
  margin: -16px -24px;
}

@media (max-width: 768px) {
  .flood-defense-page {
    margin: -12px -12px;
  }
}
</style>
