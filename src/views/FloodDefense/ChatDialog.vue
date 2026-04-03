<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import MarkdownIt from 'markdown-it';
import { MarkdownVue3 } from '@npm-brx/markdown-vue3';

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: number;
};

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
  }>(),
  {
    title: '对话',
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'send', question: string): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const md = new MarkdownIt({ html: true });

const input = ref('');
const sending = ref(false);
const messages = ref<ChatMessage[]>([]);
const scrollRef = ref<HTMLDivElement | null>(null);

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function close() {
  isOpen.value = false;
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

async function send() {
  const q = input.value.trim();
  if (!q || sending.value) return;

  sending.value = true;
  input.value = '';

  messages.value.push({
    id: uid(),
    role: 'user',
    content: q,
    createdAt: Date.now(),
  });

  emit('send', q);

  // 临时占位：后续你给我真实回答来源/接口后，把这里替换掉
  const placeholder = [
    '收到问题：',
    '',
    '```text',
    q,
    '```',
    '',
    '（这里是临时占位回答，等你提供具体需求后接入真实内容）',
  ].join('\n');

  messages.value.push({
    id: uid(),
    role: 'assistant',
    content: placeholder,
    createdAt: Date.now(),
  });

  sending.value = false;
}
</script>

<template>
  <teleport to="body">
    <div v-if="isOpen" class="chat-mask" @click.self="close">
      <div class="chat-dialog" role="dialog" aria-modal="true" :aria-label="title">
        <header class="chat-header">
          <div class="chat-title">{{ title }}</div>
          <button class="chat-close" type="button" @click="close">×</button>
        </header>

        <div ref="scrollRef" class="chat-body markdown-body">
          <div v-if="messages.length === 0" class="chat-empty">输入问题开始对话</div>

          <div v-for="m in messages" :key="m.id" class="chat-msg" :class="`is-${m.role}`">
            <div class="chat-msg__role">{{ m.role === 'user' ? '你' : '助手' }}</div>
            <div class="chat-msg__bubble">
              <MarkdownVue3 :md="md" :source="m.content" />
            </div>
          </div>
        </div>

        <footer class="chat-footer">
          <input
            v-model="input"
            class="chat-input"
            type="text"
            placeholder="请输入问题…"
            :disabled="sending"
            @keydown.enter.prevent="send"
          />
          <button class="chat-send" type="button" :disabled="sending || !input.trim()" @click="send">
            发送
          </button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<style scoped>
.chat-mask {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
  z-index: 2000;
}

.chat-dialog {
  width: min(920px, 100%);
  height: min(78vh, 720px);
  background: #fff;
  border-radius: 14px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.22);
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.chat-title {
  font-weight: 700;
  color: #111827;
}

.chat-close {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
}

.chat-body {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 14px 14px 4px;
}

.chat-empty {
  color: #6b7280;
  font-size: 14px;
  padding: 10px 2px;
}

.chat-msg {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 10px;
  margin: 10px 0;
}

.chat-msg__role {
  font-size: 12px;
  color: #6b7280;
  padding-top: 8px;
  text-align: right;
}

.chat-msg__bubble {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 12px;
  background: #fff;
}

.chat-msg.is-user .chat-msg__bubble {
  background: #eff6ff;
  border-color: #dbeafe;
}

.chat-msg.is-assistant .chat-msg__bubble {
  background: #f9fafb;
}

.chat-footer {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 10px;
  padding: 12px 14px;
  border-top: 1px solid #e5e7eb;
  background: #fff;
}

.chat-input {
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  padding: 0 12px;
  outline: none;
}

.chat-input:focus {
  border-color: #93c5fd;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.18);
}

.chat-send {
  height: 40px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #111827;
  color: #fff;
  padding: 0 14px;
  cursor: pointer;
}

.chat-send:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

@media (max-width: 520px) {
  .chat-dialog {
    height: min(86vh, 760px);
  }
  .chat-msg {
    grid-template-columns: 36px 1fr;
  }
}
</style>

