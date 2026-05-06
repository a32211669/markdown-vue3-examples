/// <reference types="vite/client" />

import type { DefineComponent, SlotsType } from 'vue';

declare module '*.vue' {
  const component: DefineComponent<
    Record<string, any>,
    Record<string, any>,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    any,
    SlotsType<Record<string, any>>
  >;
  export default component;
}
