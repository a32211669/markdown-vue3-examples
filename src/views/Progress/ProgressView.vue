<script setup lang="ts">
import { computed, onBeforeUnmount, watch } from 'vue';
import { ref } from 'vue';
import MarkdownIt from 'markdown-it';
import type { FixedPanelExpose } from '@npm-brx/markdown-vue3';
import { DefaultProgress, MarkdownVue3 } from '@npm-brx/markdown-vue3';
import DemoSplitLayout from '../../components/DemoSplitLayout.vue';
import iconUrl from '../../assets/icon.svg?url';

const md = new MarkdownIt({ html: true });

const source = ref(
  [
    '## 进度面板演示',
    '',
    '正文会正常渲染；`:::progress` 内容会进入固定区面板。',
    '',
    ':::progress',
    '```json',
    '[',
    '  { "status": "in_progress", "content": "正在开发中" },',
    '  { "status": "pending", "content": "等待资源" },',
    '  { "status": "completed", "content": "已完成一项" }',
    ']',
    '```',
    ':::',
    '',
    '---',
    '',
    '正文：结束。',
    '',
  ].join('\n'),
);

const placeholderSource = [
  '## 进度面板演示（placeholder）',
  '',
  '这里的 `:::progress` 故意留空，用于触发 placeholder 插槽展示。',
  '',
  ':::progress',
  ':::',
  '',
  '正文：结束。',
  '',
].join('\n');

const activeTab = ref<'default' | 'title-slot' | 'placeholder-slot'>('default');

/** 默认面板：是否显示固定区标题栏（库支持 showHeader / 模板 :show-header） */
const showDefaultProgressHeader = ref(true);

const placeholderPhase = ref<'placeholder' | 'content'>('content');
let placeholderTimer: ReturnType<typeof setTimeout> | null = null;

function clearPlaceholderTimer() {
  if (placeholderTimer) {
    clearTimeout(placeholderTimer);
    placeholderTimer = null;
  }
}

watch(
  activeTab,
  (tab) => {
    clearPlaceholderTimer();
    if (tab === 'placeholder-slot') {
      placeholderPhase.value = 'placeholder';
      placeholderTimer = setTimeout(() => {
        placeholderPhase.value = 'content';
      }, 3000);
    } else {
      placeholderPhase.value = 'content';
    }
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  clearPlaceholderTimer();
});

const currentSource = computed(() => {
  if (activeTab.value !== 'placeholder-slot') return source.value;
  return placeholderPhase.value === 'placeholder' ? placeholderSource : source.value;
});

const progressRef = ref<FixedPanelExpose | null>(null);

function toggleProgressCollapsed() {
  const inst = progressRef.value;
  if (!inst) return;
  inst.setCollapsed(!inst.collapsed);
}

const coreCode = `// 进度容器（:::progress）需要通过 containers 显式注册
// 预览区用 <DefaultProgress /> 渲染固定区（fixed-progress），并支持 title/placeholder 插槽

<MarkdownVue3 :md="md" :source="source" :containers="['progress']">
  <template #fixed-progress="{ nodes }">
    <DefaultProgress :nodes="nodes" :show-header="showDefaultProgressHeader" />
  </template>
</MarkdownVue3>

// 自定义 title 插槽时，如果想要折叠按钮，需要自己用 expose 来控制：
// const progressRef = ref<FixedPanelExpose | null>(null)
// progressRef.value?.setCollapsed(true/false)`;

const demoCode = computed(
  () =>
    `// ========== 示例 Markdown（source）==========\n\n` +
    currentSource.value +
    `\n\n// ========== 集成要点 ==========\n\n` +
    coreCode,
);

const noteItems = [
  '需要显式注册容器：`<MarkdownVue3 :containers="[\'progress\']" />`，否则 `:::progress` 不会生效。',
  '固定区插槽：使用 `#fixed-progress="{ nodes }"` 渲染进度固定面板（2.0 起为 progress 块数组，显示最后一个）。',
  '`DefaultProgress` 通过 `defineExpose` 暴露 `setCollapsed()` 和 `collapsed`，便于外部控制折叠。',
  '默认面板可用 `show-header`（`:show-header`）控制是否渲染标题栏；示例用按钮切换。',
  '第二个 Tab 使用 `title` 插槽时，折叠按钮需要你自己实现（示例里通过 expose 控制）。',
  '第三个 Tab 演示 `placeholder` 插槽：用空的 `:::progress` 触发占位渲染，并自定义占位样式。',
];
</script>

<template>
  <div class="demo-page-shell">
    <DemoSplitLayout :code="demoCode" title="进度组件插槽">
      <template #note>
        <div class="split-note-title">说明</div>
        <ul>
          <li v-for="(t, i) in noteItems" :key="i">{{ t }}</li>
        </ul>
      </template>
      <template #preview>
        <div class="markdown-body">
          <el-tabs v-model="activeTab" class="progress-tabs">
            <el-tab-pane label="默认面板" name="default" />
            <el-tab-pane label="title 插槽（自定义折叠按钮）" name="title-slot" />
            <el-tab-pane label="placeholder 插槽（自定义样式）" name="placeholder-slot" />
          </el-tabs>

          <div v-if="activeTab === 'default'" class="default-panel-toolbar">
            <el-button
              size="small"
              type="primary"
              plain
              @click="showDefaultProgressHeader = !showDefaultProgressHeader"
            >
              {{ showDefaultProgressHeader ? '隐藏标题' : '显示标题' }}
            </el-button>
          </div>

          <MarkdownVue3
            :key="`${activeTab}-${placeholderPhase}`"
            :containers="['progress']"
            :md="md"
            :source="currentSource"
          >
            <template #fixed-progress="{ nodes }">
              <DefaultProgress v-if="activeTab === 'default'" :nodes="nodes" :show-header="showDefaultProgressHeader" />

              <DefaultProgress v-else-if="activeTab === 'title-slot'" ref="progressRef" :nodes="nodes">
                <template #title>
                  <div class="demo-slotted-title">
                    <span class="demo-slotted-title__label">进度（自定义 title 插槽）</span>
                    <button class="demo-slotted-title__toggle" type="button" @click="toggleProgressCollapsed">
                      {{ progressRef?.collapsed ? '展开' : '收起' }}
                    </button>
                  </div>
                </template>
              </DefaultProgress>

              <DefaultProgress v-else ref="progressRef" :nodes="nodes">
                <template #title>
                  <div class="demo-slotted-title">
                    <span class="demo-slotted-title__label">进度（placeholder 演示）</span>
                    <button class="demo-slotted-title__toggle" type="button" @click="toggleProgressCollapsed">
                      {{ progressRef?.collapsed ? '展开' : '收起' }}
                    </button>
                  </div>
                </template>

                <template #placeholder>
                  <div class="my-placeholder">
                    <img class="my-placeholder__icon" :src="iconUrl" alt="" aria-hidden="true" />
                    <div class="my-placeholder__main">
                      <div class="my-placeholder__title-row">
                        <div class="my-placeholder__title">进度生成中</div>
                        <div class="my-placeholder__dots" aria-hidden="true">
                          <span class="dot"></span>
                          <span class="dot"></span>
                          <span class="dot"></span>
                        </div>
                      </div>
                      <div class="my-placeholder__desc">任务列表为空时显示该占位内容（自定义样式）。</div>
                      <div class="my-placeholder__skeleton" aria-hidden="true">
                        <div class="bar bar--1"></div>
                        <div class="bar bar--2"></div>
                      </div>
                    </div>
                  </div>
                </template>
              </DefaultProgress>
            </template>
          </MarkdownVue3>
        </div>
      </template>
    </DemoSplitLayout>
  </div>
</template>

<style scoped>
.progress-tabs {
  margin-bottom: 10px;
}

.default-panel-toolbar {
  margin: 0 0 10px;
}

/* title 插槽内收起按钮：示例页自有样式，不依赖库内 class 名 */
.demo-slotted-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-height: 32px;
}

.demo-slotted-title__label {
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  line-height: 1.3;
}

.demo-slotted-title__toggle {
  flex-shrink: 0;
  padding: 4px 12px;
  font-size: 12px;
  line-height: 1.4;
  color: #2563eb;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  cursor: pointer;
}

.demo-slotted-title__toggle:hover {
  background: #dbeafe;
  border-color: #93c5fd;
}

.demo-slotted-title__toggle:active {
  transform: translateY(0.5px);
}

.my-placeholder {
  margin-left: 32px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px dashed #c7d2fe;
  background: #eef2ff;
  color: #3730a3;
  animation: my-fade-in 220ms ease-out;
}

.my-placeholder__icon {
  width: 18px;
  height: 18px;
  margin-top: 2px;
  flex-shrink: 0;
  display: block;
  animation: my-icon-breathe 1.2s ease-in-out infinite;
  filter: drop-shadow(0 1px 2px rgba(99, 102, 241, 0.25));
}

.my-placeholder__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.my-placeholder__title {
  font-size: 13px;
  font-weight: 700;
  line-height: 1.2;
}

.my-placeholder__desc {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.9;
  line-height: 1.4;
}

.my-placeholder__dots {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  height: 14px;
}

.my-placeholder__dots .dot {
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: currentColor;
  opacity: 0.35;
  animation: my-dot-bounce 900ms infinite ease-in-out;
}

.my-placeholder__dots .dot:nth-child(2) {
  animation-delay: 120ms;
}
.my-placeholder__dots .dot:nth-child(3) {
  animation-delay: 240ms;
}

.my-placeholder__skeleton {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.my-placeholder__skeleton .bar {
  height: 10px;
  border-radius: 999px;
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.14), rgba(34, 197, 94, 0.18), rgba(99, 102, 241, 0.14));
  background-size: 220% 100%;
  animation: my-shimmer 1.2s infinite linear;
}
.my-placeholder__skeleton .bar--1 {
  width: 220px;
}
.my-placeholder__skeleton .bar--2 {
  width: 160px;
}

@keyframes my-fade-in {
  from {
    opacity: 0;
    transform: translateY(-2px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes my-icon-breathe {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.9;
  }
  50% {
    transform: scale(1.06);
    opacity: 1;
  }
}

@keyframes my-dot-bounce {
  0%,
  100% {
    transform: translateY(0);
    opacity: 0.35;
  }
  50% {
    transform: translateY(-3px);
    opacity: 0.75;
  }
}

@keyframes my-shimmer {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}

.inline-hint {
  margin: 6px 0 8px;
  color: #6b7280;
  font-size: 13px;
}
</style>
