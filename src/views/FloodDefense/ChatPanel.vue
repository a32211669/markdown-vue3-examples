<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue';
import MarkdownIt from 'markdown-it';
import { MarkdownVue3 } from '@npm-brx/markdown-vue3';
import AiStreamEchart from '../AiStream/echart/AiStreamEchart.vue';
import AiStreamMap from '../AiStream/map/AiStreamMap.vue';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
};

const props = withDefaults(
  defineProps<{
    title?: string;
    /** 是否隐藏用户提问正文（保留气泡与头像） */
    hideUserContent?: boolean;
    /** 启用的 markdown 容器（用于图表/地图等） */
    containers?: string[];
    /**
     * 返回 Markdown 文本作为回答（可同步/异步）。
     * 你给 mock 数据后，把它接进来即可。
     */
    answerProvider?: (question: string) => string | Promise<string>;
  }>(),
  {
    title: '山洪防御 - 问答',
    hideUserContent: true,
    containers: () => ['map', 'chart'],
  },
);

const emit = defineEmits<{
  (e: 'send', question: string): void;
}>();

const md = new MarkdownIt({ html: true });

const input = ref('');
const sending = ref(false);
const messages = ref<ChatMessage[]>([]);

const scrollRef = ref<HTMLDivElement | null>(null);

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function scrollToBottom() {
  await nextTick();
  const el = scrollRef.value;
  if (!el) return;
  el.scrollTop = el.scrollHeight;
}

watch(
  () => messages.value.length,
  async () => {
    await scrollToBottom();
  },
);

const canSend = computed(() => !sending.value && !!input.value.trim());

async function send() {
  const q = input.value.trim();
  if (!q || sending.value) return;

  sending.value = true;
  input.value = '';

  emit('send', q);

  messages.value.push({
    id: uid(),
    role: 'user',
    content: q,
    createdAt: Date.now(),
  });

  const answer = await props.answerProvider?.(q);
  if (answer) {
    messages.value.push({
      id: uid(),
      role: 'assistant',
      content: answer,
      createdAt: Date.now(),
    });
  }

  sending.value = false;
}
</script>

<template>
  <div class="wx-chat">
    <header class="wx-chat__header">
      <div class="wx-chat__title">{{ props.title }}</div>
    </header>

    <div ref="scrollRef" class="wx-chat__body">
      <div v-for="m in messages" :key="m.id" :class="`is-${m.role}`" class="wx-msg">
        <div :class="`is-${m.role}`" aria-hidden="true" class="wx-avatar">
          {{ m.role === 'user' ? '我' : 'AI' }}
        </div>
        <div :class="`is-${m.role}`" class="wx-bubble">
          <template v-if="m.role === 'user' && props.hideUserContent">
            <div class="wx-user-placeholder">已发送</div>
          </template>
          <template v-else>
            <MarkdownVue3 :containers="props.containers" :md="md" :source="m.content">
              <template #container:chart="{ node }">
                <AiStreamEchart :node="node" />
              </template>
              <template #container:map="{ node }">
                <AiStreamMap :node="node" />
              </template>
            </MarkdownVue3>
          </template>
        </div>
      </div>
    </div>

    <footer class="wx-chat__footer">
      <input
        v-model="input"
        :disabled="sending"
        class="wx-input"
        placeholder="输入问题，回车发送"
        type="text"
        @keydown.enter.prevent="send"
      />
      <button :disabled="!canSend" class="wx-send" type="button" @click="send">发送</button>
    </footer>
  </div>
</template>

<style scoped>
.wx-chat {
  height: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  flex-direction: column;
}

.wx-chat__header {
  flex: 0 0 auto;
  padding: 10px 12px;
  background: #ffffff;
  border-bottom: 1px solid #e5e7eb;
}

.wx-chat__title {
  font-weight: 700;
  color: #111827;
  font-size: 14px;
}

.wx-chat__body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 14px 12px;
}

.wx-msg {
  display: flex;
  gap: 10px;
  margin: 10px 0;
  align-items: flex-start;
}

.wx-msg.is-user {
  flex-direction: row-reverse;
}

.wx-avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 800;
  color: #fff;
  user-select: none;
}

.wx-avatar.is-user {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.wx-avatar.is-assistant {
  background: linear-gradient(135deg, #60a5fa 0%, #2563eb 100%);
}

.wx-bubble {
  max-width: min(680px, 78%);
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
}

.wx-bubble.is-user {
  background: #dcfce7;
  border-color: #bbf7d0;
}

.wx-user-placeholder {
  color: rgba(17, 24, 39, 0.45);
  font-size: 12px;
  line-height: 1.4;
  min-height: 18px;
  user-select: none;
}

.wx-chat__footer {
  flex: 0 0 auto;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  padding: 10px 12px;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
}

.wx-input {
  height: 38px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 0 12px;
  outline: none;
}

.wx-input:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}

.wx-send {
  height: 38px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #111827;
  color: #fff;
  padding: 0 14px;
  cursor: pointer;
}

.wx-send:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
</style>
