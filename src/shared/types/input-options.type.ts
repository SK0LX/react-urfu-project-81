import type { AttributeValue, HtmlAttributes } from './html-attributes.type.js';

export type InputOptions = {
  [name: string]: AttributeValue | HtmlAttributes;
  as?: 'input' | 'textarea';
  label?: string;
  labelHtml?: HtmlAttributes;
};
