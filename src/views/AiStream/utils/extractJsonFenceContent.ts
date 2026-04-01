/**
 * 从 markdown-vue3 容器插槽传入的 `node` token 树里，提取第一个 ```json fence``` 的内容。
 *
 * 约定：自定义容器（:::map/:::chart/:::tip/:::warning）内部用 ```json ...``` 承载结构化数据。
 * 本工具函数负责递归遍历 token.children，找到第一个 json fence 并返回 fence.content（纯文本）。
 */
export function extractJsonFenceContent(tokens: any): string | null {
  if (!tokens) return null;

  if (Array.isArray(tokens)) {
    for (const token of tokens) {
      const content = extractJsonFenceContent(token);
      if (content) return content;
    }
    return null;
  }

  // markdown-it fence token: { type: 'fence', info: 'json', content: '...' }
  if (tokens?.type === 'fence' && typeof tokens?.info === 'string') {
    if (tokens.info.toLowerCase().includes('json') && typeof tokens.content === 'string') {
      return tokens.content;
    }
  }

  if (Array.isArray(tokens?.children)) {
    return extractJsonFenceContent(tokens.children);
  }

  return null;
}
