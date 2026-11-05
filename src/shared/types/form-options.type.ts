import type { HtmlAttributes } from './html-attributes.type.js';

export type FormOptions = HtmlAttributes & {
  url?: string;
  method?: string;
};
