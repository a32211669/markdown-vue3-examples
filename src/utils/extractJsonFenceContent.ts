/**
 * 从 markdown-vue3 容器插槽传入的 `node` token 树里，提取第一个 ```json fence``` 的内容。
 *
 * 约定：自定义容器（:::map / :::echart / :::carousel ...）内部用 ```json ...``` 承载结构化数据。
 */
export function extractJsonFenceContent(tokens: unknown): string | null {
  if (!tokens) return null;

  if (Array.isArray(tokens)) {
    for (const token of tokens) {
      const content = extractJsonFenceContent(token);
      if (content) return content;
    }
    return null;
  }

  const t: any = tokens;

  // markdown-it fence token: { type: 'fence', info: 'json', content: '...' }
  if (t?.type === 'fence' && typeof t?.info === 'string') {
    if (t.info.toLowerCase().includes('json') && typeof t.content === 'string') {
      return t.content;
    }
  }

  if (Array.isArray(t?.children)) {
    return extractJsonFenceContent(t.children);
  }

  return null;
}
