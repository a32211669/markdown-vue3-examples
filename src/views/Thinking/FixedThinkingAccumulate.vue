<script setup lang="ts">
import { ref, watch } from 'vue';
import { Renderer, type GroupToken } from 'markdown-vue3';

/**
 * 与 markdown-vue3 内置 DefaultThinking 相同思路：
 * 流式场景下多次出现 :::thinking，每次 node 的 _stableKey 不同则累加到 tree，
 * 用 Renderer 渲染每一段容器的 children。
 */
const props = defineProps<{
  node: GroupToken;
}>();

const tree = ref<GroupToken[]>([]);
const stableKeys: string[] = [];

watch(
  () => props.node,
  (node) => {
    if (!node) return;
    if (!stableKeys.includes(node._stableKey)) {
      tree.value.push(node);
      stableKeys.push(node._stableKey);
    }
  },
  { deep: true, immediate: true },
);
</script>

<template>
  <div class="default-thinking">
    <header>
      <div class="icon" aria-hidden="true" />
      <div class="title">已深度思考</div>
    </header>
    <main>
      <div class="main-icon" aria-hidden="true" />
      <Renderer :tree="tree" />
    </main>
  </div>
</template>

<style scoped>
.default-thinking {
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 8px;
}

.default-thinking header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.default-thinking header .icon {
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background: linear-gradient(135deg, #a78bfa 0%, #6366f1 100%);
}

.default-thinking header .title {
  font-size: 16px;
  color: #5b606b;
  margin-left: 8px;
}

.default-thinking main {
  flex: 1;
  margin-left: 8px;
  position: relative;
  padding-left: 18px;
}

.default-thinking main::before {
  content: '';
  position: absolute;
  left: 0;
  top: 24px;
  bottom: 0;
  width: 2px;
  background-color: #e9e9e9;
}

.default-thinking main .main-icon {
  position: absolute;
  left: -7px;
  top: 0;
  width: 16px;
  height: 24px;
  border-radius: 4px 4px 0 0;
  background: linear-gradient(180deg, #c4b5fd 0%, #e9e9e9 100%);
}

.default-thinking :deep(p) {
  margin: 0.35em 0;
  font-size: 14px !important;
  color: #5b606b !important;
}
</style>
