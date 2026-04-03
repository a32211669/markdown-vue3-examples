#### 介绍

**markdown-vue3** 是一个轻量、高效的 Markdown 渲染组件，基于 Vue 3 和 markdown-it 开发。  
支持常见 Markdown 语法、代码高亮、**vue插槽写法**，**自定义规则** 适用于 **AI流式回答**、内容管理系统等场景。

#### 软件架构

- 基于 **Vue 3** 开发，使用 Composition API
- 使用 **markdown-it** 作为 Markdown 解析器
  - 支持自定义渲染规则
  - 替换默认渲染规则

#### 开发版本说明

- `markdown-it`: `^14.1.1`
- `markdown-it-container`: `^4.0.0`
- `vue`: `^3.5.30`

#### 安装教程

1. 安装依赖：

   ```bash
   npm install @npm-brx/markdown-vue3
   # 或
   pnpm add @npm-brx/markdown-vue3
   ```

2. 若需要代码高亮，请额外安装高亮库：
   ```bash
   npm install highlight.js
   ```

#### 使用说明
   ```vue
   <template>
     <div class="markdown-body">
       <markdown-vue3 :md="md" :source="source"></markdown-vue3>
     </div>
   </template>

   <script setup>
   import { ref } from 'vue';
   import MarkdownIt from 'markdown-it';

   // 和正常使用的 MarkdownIt 实例一样使用

   const md = new MarkdownIt({
     html: true,
   });
   const source = ref('# 标题\\n\\n这是一段 **Markdown** 内容。');
   </script>
   ```

3. **必须安装的插件**：

   ```bash
   npm install markdown-it-container
   ```

   ```javascript
   // 注意,不需要use 组件内部自动use注册
   import MarkdownIt from 'markdown-it';

   const md = new MarkdownIt({
     html: true,
   });
   ```

#### 特技

1. GitHub示例地址 https://github.com/a32211669/markdown-vue3-examples.git
