// src/router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  // 使用 hash 模式，便于直接丢到静态托管 / CDN，而不用额外配置服务端历史路由回退
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home/intro',
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeLayout.vue'),
      children: [
        {
          path: 'intro',
          name: 'home-intro',
          component: () => import('../views/IntroView.vue'),
        },
        {
          path: 'ai-stream',
          name: 'home-ai-stream',
          component: () => import('../views/AiStream/AiStream.vue'),
        },
        {
          path: 'render-tag',
          name: 'home-render-tag',
          component: () => import('../views/RenderTagView.vue'),
        },
        {
          path: 'render-fence',
          name: 'home-render-fence',
          component: () => import('../views/RenderFenceView.vue'),
        },
        {
          path: 'render-container',
          name: 'home-render-container',
          component: () => import('../views/RenderContainerView.vue'),
        },
        {
          path: 'progress',
          name: 'home-progress',
          component: () => import('../views/Progress/ProgressView.vue'),
        },
        {
          path: 'thinking',
          name: 'home-thinking',
          component: () => import('../views/Thinking/ThinkingView.vue'),
        },
      ],
    },
  ],
});

export default router;
