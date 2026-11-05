import type { HtmlAttributes } from './html-attributes.type.js';

export type InputOptions = HtmlAttributes & {
  as?: 'input' | 'textarea';
};
