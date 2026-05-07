<script setup lang="ts">
import { computed } from 'vue';
import type { GroupToken } from '@npm-brx/markdown-vue3';
import { extractJsonFenceContent } from '../../utils/extractJsonFenceContent';

type CarouselItem = {
  url: string;
  title?: string;
  caption?: string;
};

type CarouselData = {
  height?: number;
  interval?: number;
  items: CarouselItem[];
};

const props = defineProps<{
  node?: GroupToken;
}>();

const parsed = computed<CarouselData | null>(() => {
  const jsonContent = extractJsonFenceContent((props.node as any)?.children);
  if (!jsonContent) return null;

  try {
    const data = JSON.parse(jsonContent.trim());
    if (!data || !Array.isArray(data.items) || data.items.length === 0) return null;
    if (!data.items.every((it: any) => it && typeof it.url === 'string')) return null;
    return data as CarouselData;
  } catch {
    return null;
  }
});

const heightPx = computed(() => {
  const h = parsed.value?.height;
  return typeof h === 'number' && h > 120 ? `${h}px` : '280px';
});

const intervalMs = computed(() => {
  const n = parsed.value?.interval;
  return typeof n === 'number' && n >= 1000 ? n : 3500;
});

const items = computed(() => parsed.value?.items ?? []);
</script>

<template>
  <div class="carousel-wrapper">
    <el-carousel v-if="items.length" :interval="intervalMs" :height="heightPx" indicator-position="outside">
      <el-carousel-item v-for="(it, idx) in items" :key="idx">
        <div class="slide">
          <img class="slide__img" :src="it.url" :alt="it.title || `slide-${idx}`" />
          <div v-if="it.title || it.caption" class="slide__meta">
            <div v-if="it.title" class="slide__title">{{ it.title }}</div>
            <div v-if="it.caption" class="slide__caption">{{ it.caption }}</div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
    <div v-else class="carousel-empty">未解析到轮播数据（请在容器内提供 json fence）。</div>
  </div>
</template>

<style scoped>
.carousel-wrapper {
  margin: 12px 0;
  border: 1px solid #eaeaea;
  border-radius: 10px;
  overflow: hidden;
  background: #fafafa;
}

.slide {
  position: relative;
  width: 100%;
  height: 100%;
}

.slide__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slide__meta {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(17, 24, 39, 0.55);
  color: #fff;
  backdrop-filter: blur(6px);
}

.slide__title {
  font-weight: 700;
  font-size: 14px;
  line-height: 1.25;
}

.slide__caption {
  margin-top: 4px;
  font-size: 12px;
  opacity: 0.92;
  line-height: 1.35;
}

.carousel-empty {
  padding: 14px;
  color: #6b7280;
  font-size: 13px;
}
</style>
