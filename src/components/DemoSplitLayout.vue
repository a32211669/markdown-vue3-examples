<script setup lang="ts">
/**
 * 文档式布局：上方说明 + 可选左侧源码 + 右侧演示（大屏并排，小屏先演示后源码）
 */
defineSlots<{
  note(): unknown;
  preview(): unknown;
}>();

withDefaults(
  defineProps<{
    /** 页面主标题（可选） */
    title?: string;
    /** 左侧源码标题 */
    codeLabel?: string;
    /** 右侧演示标题 */
    previewLabel?: string;
    /** 纯文本源码（与 codeHtml 二选一） */
    code?: string;
    /** 已转义/可安全 v-html 的源码（如带高亮 span） */
    codeHtml?: string;
    /** 是否展示左侧源码区（如流式演示页可关闭） */
    showCode?: boolean;
  }>(),
  {
    codeLabel: '源码',
    previewLabel: '演示',
    code: '',
    codeHtml: '',
    showCode: true,
  },
);
</script>

<template>
  <div class="demo-layout">
    <h2 v-if="title" class="demo-layout__title">{{ title }}</h2>

    <section v-if="$slots.note" class="demo-layout__note">
      <slot name="note" />
    </section>

    <div class="demo-layout__split" :class="{ 'demo-layout__split--preview-only': !showCode }">
      <div v-if="showCode" class="demo-layout__pane demo-layout__pane--code">
        <div class="demo-layout__pane-head">{{ codeLabel }}</div>
        <div class="demo-layout__pane-body demo-layout__pane-body--code">
          <pre class="demo-layout__pre">
            <code v-if="codeHtml" v-html="codeHtml"></code>
            <code v-else>{{ code }}</code>
          </pre>
        </div>
      </div>
      <div class="demo-layout__pane demo-layout__pane--preview">
        <div class="demo-layout__pane-head">{{ previewLabel }}</div>
        <div class="demo-layout__pane-body demo-layout__pane-body--preview">
          <slot name="preview" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.demo-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 16px 0 28px;
}

.demo-layout__title {
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 700;
}

.demo-layout__note {
  margin: 0 0 16px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f8fafc;
}

.demo-layout__note :deep(.split-note-title) {
  font-weight: 700;
  margin: 0 0 8px;
  font-size: 14px;
  color: #111827;
}

.demo-layout__note :deep(ul) {
  margin: 0;
  padding-left: 18px;
  color: #374151;
  line-height: 1.65;
}

.demo-layout__note :deep(li) {
  margin: 0.25em 0;
}

.demo-layout__note :deep(code) {
  padding: 1px 6px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.06);
  font-size: 0.92em;
}

.demo-layout__split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: stretch;
}

.demo-layout__split--preview-only {
  grid-template-columns: 1fr;
}

.demo-layout__pane {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 200px;
  background: #fff;
}

.demo-layout__pane-head {
  flex: 0 0 auto;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
  background: #f3f4f6;
  border-bottom: 1px solid #e5e7eb;
}

.demo-layout__pane-body {
  flex: 1;
  min-height: 0;
}

.demo-layout__pane-body--code {
  background: #0b1020;
  overflow: auto;
}

.demo-layout__pre {
  margin: 0;
  padding: 12px 14px;
  font-size: 12px;
  line-height: 1.55;
  color: #e5e7eb;
  white-space: pre-wrap;
  word-break: break-word;
}

.demo-layout__pre code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.demo-layout__pre :deep(.code-hot) {
  color: #ff4d4f;
  font-weight: 700;
}

/* 演示区不单独滚动，与外层 .layout-content 共用一条纵向滚动，避免双滚动条 */
.demo-layout__pane-body--preview {
  padding: 12px 14px;
  overflow: visible;
}

.demo-layout__pane-body--preview :deep(.markdown-body) {
  max-width: none;
}

/* 小屏：演示在上、源码在下 */
@media (max-width: 900px) {
  .demo-layout__split {
    grid-template-columns: 1fr;
  }

  .demo-layout__pane--preview {
    order: -1;
  }
}
</style>
