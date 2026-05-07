<script lang="ts" setup>
import { computed, ref } from 'vue';
import MarkdownIt from 'markdown-it';
import type { FixedPanelExpose } from '@npm-brx/markdown-vue3';
import { DefaultThinking, MarkdownVue3 } from '@npm-brx/markdown-vue3';
import DemoSplitLayout from '../../components/DemoSplitLayout.vue';

const md = new MarkdownIt({ html: true });

const source = ref(
  [
    '## 思考面板演示',
    '',
    '正文会正常渲染；`:::thinking` 内容会进入固定区面板。',
    '',
    ':::thinking',
    '这里是思考内容。',
    '- 支持多行',
    '- 支持 **Markdown**',
    ':::',
    '',
    '---',
    '',
    '正文：结束。',
    '',
  ].join('\n'),
);

const activeTab = ref<'default' | 'title-slot'>('default');

/** 默认面板：是否显示固定区标题栏（库支持 showHeader / 模板 :show-header） */
const showDefaultThinkingHeader = ref(true);

const thinkingRef = ref<FixedPanelExpose | null>(null);

function toggleThinkingCollapsed() {
  const inst = thinkingRef.value;
  if (!inst) return;
  inst.setCollapsed(!inst.collapsed);
}

const coreCode = `// 思考容器（:::thinking）需要通过 containers 显式注册
// 预览区用 <DefaultThinking /> 渲染固定区（fixed-thinking），并支持 title 插槽自定义标题栏

<MarkdownVue3 :md="md" :source="source" :containers="['thinking']">
  <template #fixed-thinking="{ node }">
    <DefaultThinking :node="node" :show-header="showDefaultThinkingHeader" />
  </template>
</MarkdownVue3>

// 自定义 title 插槽时，如果想要折叠按钮，需要自己用 expose 来控制：
// const thinkingRef = ref<FixedPanelExpose | null>(null)
// thinkingRef.value?.setCollapsed(true/false)`;

const demoCode = computed(
  () =>
    `// ========== 示例 Markdown（source）==========\n\n` +
    source.value +
    `\n\n// ========== 集成要点 ========== \n\n` +
    coreCode,
);

const noteItems = [
  '需要显式注册容器：`<MarkdownVue3 :containers="[\'thinking\']" />`，否则 `:::thinking` 不会生效。',
  '固定区插槽：使用 `#fixed-thinking` 渲染思考固定面板（默认用 `DefaultThinking`）。',
  '`DefaultThinking` 通过 `defineExpose` 暴露 `setCollapsed()` 和 `collapsed`，便于外部控制折叠。',
  '默认面板可用 `show-header`（`:show-header`）控制是否渲染标题栏；示例用按钮切换。',
  '第二个 Tab 使用 `title` 插槽时，折叠按钮需要你自己实现（示例里通过 expose 控制）。',
];
</script>

<template>
  <div class="demo-page-shell">
    <DemoSplitLayout :code="demoCode" title="思考组件插槽">
      <template #note>
        <div class="split-note-title">说明</div>
        <ul>
          <li v-for="(t, i) in noteItems" :key="i">{{ t }}</li>
        </ul>
      </template>
      <template #preview>
        <div class="markdown-body">
          <el-tabs v-model="activeTab" class="thinking-tabs">
            <el-tab-pane label="默认面板" name="default" />
            <el-tab-pane label="title 插槽（自定义折叠按钮）" name="title-slot" />
          </el-tabs>

          <div v-if="activeTab === 'default'" class="default-panel-toolbar">
            <el-button
              size="small"
              type="primary"
              plain
              @click="showDefaultThinkingHeader = !showDefaultThinkingHeader"
            >
              {{ showDefaultThinkingHeader ? '隐藏标题' : '显示标题' }}
            </el-button>
          </div>

          <MarkdownVue3 :containers="['thinking']" :md="md" :source="source">
            <template #fixed-thinking="{ node }">
              <DefaultThinking v-if="activeTab === 'default'" :node="node" :show-header="showDefaultThinkingHeader" />

              <DefaultThinking v-else ref="thinkingRef" :node="node">
                <template #title>
                  <div class="demo-slotted-title">
                    <span class="demo-slotted-title__label">思考（自定义 title 插槽）</span>
                    <button class="demo-slotted-title__toggle" type="button" @click="toggleThinkingCollapsed">
                      {{ thinkingRef?.collapsed ? '展开' : '收起' }}
                    </button>
                  </div>
                </template>
              </DefaultThinking>
            </template>
          </MarkdownVue3>
        </div>
      </template>
    </DemoSplitLayout>
  </div>
</template>

<style scoped>
.thinking-tabs {
  margin-bottom: 10px;
}

.default-panel-toolbar {
  margin: 0 0 10px;
}

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

.inline-hint {
  margin: 6px 0 8px;
  color: #6b7280;
  font-size: 13px;
}
</style>
