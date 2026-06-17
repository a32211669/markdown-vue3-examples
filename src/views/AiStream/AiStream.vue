<template>
  <div class="aistream-page">
    <div ref="scrollContainerRef" class="markdown-body aistream-content">
      <h2 class="aistream-title">模拟ai流式回答</h2>

      <div class="aistream-note" role="note" aria-label="说明">
        <div class="aistream-note__title">说明</div>
        <ul class="aistream-note__list">
          <li>本页演示 <b>AI 流式回答</b>：通过不断追加 <code>source</code> 来驱动渲染（更接近“打字机”效果）。</li>
          <li>
            <b>进度（progress）</b>与<b>思考（thinking）</b>使用固定区插槽 <code>#fixed-progress="{ nodes }"</code> /
            <code>#fixed-thinking="{ contents }"</code> 渲染成面板；若 Markdown 中没有 <code>:::progress</code> 或
            <code>:::thinking</code>，对应面板不会出现。
          </li>
          <li>
            本页注册了 4 个<b>自定义容器插槽</b>：<code>container:map</code> / <code>container:chart</code> /
            <code>container:tip</code> / <code>container:warning</code>，并把 <code>node</code> 传给对应组件。
          </li>
          <li>
            <b>AiStreamMap</b> / <b>AiStreamEchart</b> / <b>AiStreamTip</b> / <b>AiStreamWarning</b> 会从
            <code>node</code> 的 token 树中提取首个 <b>json fence</b>（<code>```json</code>）内容进行渲染。
          </li>
          <li>
            为了保证解析稳定与性能，建议结构化 json 数据<b>一次性输出整块</b>（避免流式过程中出现“半截
            JSON”导致解析失败与重复渲染）。
          </li>
          <li>页面默认会<b>贴底自动滚动</b>；当你手动上滑离开底部后会暂停贴底，滚回底部附近会自动恢复。</li>
        </ul>
      </div>

      <MarkdownVue3
        :containers="['thinking', 'progress', 'map', 'chart', 'tip', 'warning']"
        :md="md"
        :sanitize="sanitize"
        :source="source"
      >
        <template #fixed-progress="{ nodes }">
          <DefaultProgress :nodes="nodes" />
        </template>

        <template #fixed-thinking="{ contents }">
          <DefaultThinking :contents="contents" />
        </template>

        <template #container:map="{ node }">
          <AiStreamMap :node="node" />
        </template>

        <template #container:chart="{ node }">
          <AiStreamEchart :node="node" />
        </template>

        <template #container:tip="{ node }">
          <AiStreamTip :node="node" />
        </template>

        <template #container:warning="{ node }">
          <AiStreamWarning :node="node" />
        </template>
      </MarkdownVue3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import MarkdownIt from 'markdown-it';
import { DefaultProgress, DefaultThinking, MarkdownVue3 } from '@npm-brx/markdown-vue3';

import AiStreamMap from './map/AiStreamMap.vue';
import AiStreamEchart from './echart/AiStreamEchart.vue';
import AiStreamTip from './tip/AiStreamTip.vue';
import AiStreamWarning from './warning/AiStreamWarning.vue';

// @ts-expect-error mock.js is a plain JS file (no TS typings in this repo)
import mock from '../mock.js';

// 净化html的回调函数 可选
const sanitize = (html: string) => {
  // 简单移除所有 script 标签 或者使用DOMPurify.sanitize(html)
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

const md = new MarkdownIt({
  html: true,
});

const scrollContainerRef = ref<HTMLElement | null>(null);
const stickToBottom = ref(true);
const bottomThresholdPx = 24;

type ScrollTarget = { kind: 'element'; el: HTMLElement } | { kind: 'window'; scrollEl: Element };

const scrollTarget = ref<ScrollTarget | null>(null);

function getScrollParent(startEl: HTMLElement | null): HTMLElement | null {
  let el: HTMLElement | null = startEl;
  while (el) {
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    const scrollable =
      (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') && el.scrollHeight > el.clientHeight;
    if (scrollable) return el;
    el = el.parentElement;
  }
  return null;
}

function computeScrollTarget(): ScrollTarget {
  const from = scrollContainerRef.value;
  const parent = getScrollParent(from);
  if (parent) return { kind: 'element', el: parent };
  const scrollEl = document.scrollingElement || document.documentElement;
  return { kind: 'window', scrollEl };
}

function isNearBottom(target: ScrollTarget): boolean {
  if (target.kind === 'element') {
    const el = target.el;
    const distance = el.scrollHeight - (el.scrollTop + el.clientHeight);
    return distance <= bottomThresholdPx;
  }
  const scrollEl = target.scrollEl as HTMLElement;
  const distance = scrollEl.scrollHeight - (scrollEl.scrollTop + window.innerHeight);
  return distance <= bottomThresholdPx;
}

function scrollToBottom(target: ScrollTarget) {
  if (target.kind === 'element') {
    target.el.scrollTop = target.el.scrollHeight;
  } else {
    const scrollEl = target.scrollEl as HTMLElement;
    window.scrollTo({ top: scrollEl.scrollHeight });
  }
}

function onScroll() {
  const target = scrollTarget.value;
  if (!target) return;
  stickToBottom.value = isNearBottom(target);
}

const source = ref('');
mock((str: string) => {
  source.value += str;
});

onMounted(() => {
  scrollTarget.value = computeScrollTarget();
  const target = scrollTarget.value;
  if (target.kind === 'element') target.el.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  const target = scrollTarget.value;
  if (target?.kind === 'element') target.el.removeEventListener('scroll', onScroll);
  window.removeEventListener('scroll', onScroll);
});

watch(
  source,
  async () => {
    // 内容变长后，原先不滚动的容器可能开始滚动：重新计算一次更稳
    const prevTarget = scrollTarget.value;
    const nextTarget = computeScrollTarget();
    if (prevTarget?.kind === 'element' && (nextTarget.kind !== 'element' || prevTarget.el !== nextTarget.el)) {
      prevTarget.el.removeEventListener('scroll', onScroll);
    }
    if (nextTarget.kind === 'element' && prevTarget?.kind !== 'element') {
      nextTarget.el.addEventListener('scroll', onScroll, { passive: true });
    }
    scrollTarget.value = nextTarget;

    const target = scrollTarget.value;
    if (!target) return;
    // 在用户上滑过的情况下不贴底；但当用户滚回底部附近会自动恢复 stickToBottom=true
    if (!stickToBottom.value) return;
    await nextTick();
    scrollToBottom(target);
  },
  { flush: 'post' },
);
</script>

<style scoped>
.aistream-page {
  padding: 0 20px;
}

.aistream-content {
  max-width: 980px;
  margin: 0 auto;
  padding: 16px 0 28px;
}

.aistream-title {
  margin: 0 0 12px;
  font-size: 22px;
  font-weight: 700;
}

.aistream-note {
  margin: 0 0 14px;
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #f8fafc;
}

.aistream-note__title {
  font-weight: 700;
  margin: 0 0 6px;
}

.aistream-note__list {
  margin: 0;
  padding-left: 18px;
  color: #374151;
  line-height: 1.6;
}

.aistream-note :deep(code) {
  padding: 1px 6px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.06);
}
</style>
