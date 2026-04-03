<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { computed, onBeforeUnmount, onMounted, ref, type Component } from 'vue';
import { Box, Document, DocumentCopy, Expand, Fold, Histogram, InfoFilled, Picture } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();

const isMobile = ref(false);
let mobileMql: MediaQueryList | null = null;

type MenuItem = {
  index: string;
  label: string;
  icon: Component;
  children?: MenuItem[];
};

const menuItems: MenuItem[] = [
  { index: '/home/intro', label: '介绍', icon: InfoFilled },

  { index: '/home/render-tag', label: 'tag插槽', icon: Picture },
  { index: '/home/render-fence', label: 'fence插槽', icon: DocumentCopy },
  { index: '/home/render-container', label: 'container插槽', icon: Box },
  { index: '/home/progress', label: '进度组件插槽', icon: Histogram },
  { index: '/home/thinking', label: '思考组件插槽', icon: Document },
  { index: '/home/ai-stream', label: 'AI流式回答', icon: Document },
];

// 默认展开所有子菜单
const defaultOpeneds = computed(() =>
  menuItems.filter((i): i is MenuItem & { children: MenuItem[] } => !!i.children).map((i) => i.index),
);

const isCollapsed = ref(false);

const isSidebarOpen = computed(() => (isMobile.value ? !isCollapsed.value : true));

function syncIsMobile() {
  isMobile.value = !!mobileMql?.matches;
  if (isMobile.value) isCollapsed.value = true;
}

const activeMenu = computed(() => {
  const fullPath = route.path;

  // 先精确匹配叶子节点，让子路由页面能正确高亮
  for (const item of menuItems) {
    if (fullPath === item.index) return item.index;
    if (item.children) {
      const child = item.children.find((c: MenuItem) => c.index === fullPath);
      if (child) return child.index;
    }
  }

  // 再做兜底（适配未来更多层级或子路由）
  const found = menuItems.find((item) => fullPath.startsWith(item.index));
  return found ? found.index : '/home/intro';
});

const handleSelect = (index: string) => {
  if (index !== route.path) {
    router.push(index);
  }
  if (isMobile.value) isCollapsed.value = true;
};

const toggleCollapsed = () => {
  isCollapsed.value = !isCollapsed.value;
};

const closeSidebar = () => {
  if (isMobile.value) isCollapsed.value = true;
};

onMounted(() => {
  mobileMql = window.matchMedia('(max-width: 768px)');
  syncIsMobile();
  mobileMql.addEventListener('change', syncIsMobile);
});

onBeforeUnmount(() => {
  mobileMql?.removeEventListener('change', syncIsMobile);
});
</script>

<template>
  <div class="layout">
    <div v-if="isMobile && isSidebarOpen" class="layout-overlay" @click="closeSidebar" />
    <aside
      class="layout-sidebar"
      :class="{ 'is-mobile': isMobile, 'is-open': isSidebarOpen }"
      :style="{ width: isMobile ? '240px' : isCollapsed ? '72px' : '240px' }"
    >
      <div class="layout-sidebar-header">
        <el-button class="layout-collapse-btn" :icon="isCollapsed ? Expand : Fold" circle @click="toggleCollapsed" />
        <div class="layout-title" v-show="!isCollapsed">Markdown 示例</div>
      </div>
      <el-menu
        :collapse="!isMobile && isCollapsed"
        :default-active="activeMenu"
        :default-openeds="defaultOpeneds"
        class="layout-menu"
        @select="handleSelect"
      >
        <template v-for="item in menuItems" :key="item.index">
          <el-sub-menu v-if="item.children" :index="item.index">
            <template #title>
              <el-tooltip :content="item.label" placement="right" :disabled="!isCollapsed">
                <el-icon class="layout-menu-icon">
                  <component :is="item.icon" />
                </el-icon>
              </el-tooltip>
              <span class="layout-menu-text" v-show="!isCollapsed">{{ item.label }}</span>
            </template>
            <el-menu-item v-for="child in item.children" :key="child.index" :index="child.index">
              <el-tooltip :content="child.label" placement="right" :disabled="!isCollapsed">
                <el-icon class="layout-menu-icon">
                  <component :is="child.icon" />
                </el-icon>
              </el-tooltip>
              <span class="layout-menu-text">{{ child.label }}</span>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item.index">
            <el-tooltip :content="item.label" placement="right" :disabled="!isCollapsed">
              <el-icon class="layout-menu-icon">
                <component :is="item.icon" />
              </el-icon>
            </el-tooltip>
            <span class="layout-menu-text" v-show="!isCollapsed">{{ item.label }}</span>
          </el-menu-item>
        </template>
      </el-menu>
    </aside>
    <main class="layout-content">
      <div v-if="isMobile" class="mobile-topbar">
        <el-button class="mobile-menu-btn" :icon="Expand" circle @click="toggleCollapsed" />
        <div class="mobile-topbar-title">Markdown 示例</div>
      </div>
      <router-view />
    </main>
  </div>
</template>
