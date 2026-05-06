/**
 * 从 markdown-vue3 容器插槽传入的 `node` token 树里，提取第一个 ```json fence``` 的内容。
 *
 * 约定：自定义容器（:::map/:::chart/:::tip/:::warning）内部用 ```json ...``` 承载结构化数据。
 * 本工具函数负责递归遍历 token.children，找到第一个 json fence 并返回 fence.content（纯文本）。
 */
export { extractJsonFenceContent } from '../../../utils/extractJsonFenceContent';
