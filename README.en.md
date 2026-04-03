#### Introduction

**markdown-vue3** is a lightweight and efficient Markdown rendering component built with Vue 3 and markdown-it.  
It supports common Markdown syntax, code highlighting, **Vue slot-based usage**, and **custom rules**, making it suitable for **AI streaming responses**, content management systems, and similar scenarios.

#### Architecture

- Built on **Vue 3** with the Composition API
- Uses **markdown-it** as the Markdown parser
  - Supports custom rendering rules
  - Allows overriding default render rules

#### Versions used in development

- `markdown-it`: `^14.1.1`
- `markdown-it-container`: `^4.0.0`
- `vue`: `^3.5.30`

#### Installation

1. Install the package:

   ```bash
   npm install @npm-brx/markdown-vue3
   # or
   pnpm add @npm-brx/markdown-vue3
   ```

2. If you need code highlighting, install a highlight library (for example `highlight.js`):

   ```bash
   npm install highlight.js
   ```

#### Basic usage

```vue
<template>
  <div class="markdown-body">
    <markdown-vue3 :md="md" :source="source" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MarkdownIt from 'markdown-it';

// Use MarkdownIt the same way as in normal projects
const md = new MarkdownIt({
  html: true,
});

const source = ref('# Title\\n\\nThis is a piece of **Markdown** content.');
</script>
```

#### Required plugin

```bash
npm install markdown-it-container
```

```javascript
// Note: you do NOT need to manually call md.use(container)
// The component will register containers internally when needed.
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({
  html: true,
});
```

#### Extras

1. GitHub example project: https://github.com/a32211669/markdown-vue3-examples.git
