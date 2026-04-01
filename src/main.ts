import { createApp } from 'vue';
import App from './App.vue';

import 'element-plus/dist/index.css';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'ol/ol.css';
import router from './router';
import './style.css';
// markdown-vue3 样式
import 'markdown-vue3/dist/markdown-vue3.css';

// github-markdown-css 样式
import 'github-markdown-css/github-markdown.css';

const app = createApp(App);

app.use(ElementPlus, {
  locale: zhCn,
});

app.use(router);

app.mount('#app');
