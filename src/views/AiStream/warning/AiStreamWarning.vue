<script setup lang="ts">
import { computed } from 'vue';
import type { GroupToken } from '@npm-brx/markdown-vue3';
import { extractJsonFenceContent } from '../utils/extractJsonFenceContent';

type WarningData = {
  title?: string;
  text?: string;
  items?: string[];
};

console.log('warning');
const props = defineProps<{
  node?: GroupToken;
}>();

const data = computed<WarningData | null>(() => {
  const json = extractJsonFenceContent(props.node?.children);
  if (!json) return null;
  try {
    const parsed = JSON.parse(json.trim());
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed as WarningData;
  } catch {
    return null;
  }
});
</script>

<template>
  <div class="warning-container">
    <div class="warning-title">⚠️ {{ data?.title ?? '注意' }}</div>
    <div v-if="data?.text" class="warning-text">{{ data.text }}</div>
    <ul v-if="data?.items?.length" class="warning-list">
      <li v-for="(it, idx) in data.items" :key="idx">{{ it }}</li>
    </ul>
  </div>
</template>

<style scoped>
.warning-container {
  margin: 12px 0;
  padding: 12px 14px;
  border: 1px solid #fecaca;
  border-radius: 10px;
  background: #fff1f2;
}

.warning-title {
  font-weight: 800;
  margin: 0 0 6px;
  color: #b91c1c;
}

.warning-text {
  color: #1f2937;
  line-height: 1.65;
}

.warning-list {
  margin: 6px 0 0;
  padding-left: 18px;
  color: #1f2937;
  line-height: 1.65;
}
</style>
