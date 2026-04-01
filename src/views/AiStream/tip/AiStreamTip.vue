<script setup lang="ts">
import { computed } from 'vue';
import type { GroupToken } from 'markdown-vue3';
import { extractJsonFenceContent } from '../utils/extractJsonFenceContent';

type TipData = {
  title?: string;
  text?: string;
  items?: string[];
};

const props = defineProps<{
  node?: GroupToken;
}>();
console.log('tip');

const data = computed<TipData | null>(() => {
  const json = extractJsonFenceContent(props.node?.children);
  if (!json) return null;
  try {
    const parsed = JSON.parse(json.trim());
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed as TipData;
  } catch {
    return null;
  }
});
</script>

<template>
  <div class="tip-container">
    <div class="tip-title">💡 {{ data?.title ?? '提示' }}</div>
    <div v-if="data?.text" class="tip-text">{{ data.text }}</div>
    <ul v-if="data?.items?.length" class="tip-list">
      <li v-for="(it, idx) in data.items" :key="idx">{{ it }}</li>
    </ul>
  </div>
</template>

<style scoped>
.tip-container {
  margin: 12px 0;
  padding: 12px 14px;
  border: 1px solid #dbeafe;
  border-radius: 10px;
  background: #eff6ff;
}

.tip-title {
  font-weight: 800;
  margin: 0 0 6px;
  color: #1d4ed8;
}

.tip-text {
  color: #1f2937;
  line-height: 1.65;
}

.tip-list {
  margin: 6px 0 0;
  padding-left: 18px;
  color: #1f2937;
  line-height: 1.65;
}
</style>
