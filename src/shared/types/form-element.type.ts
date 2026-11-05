import type { HtmlAttributes } from './html-attributes.type.js';

export type FormElement =
  | {
      kind: 'input' | 'textarea';
      name: string;
      label: string;
      value: string;
      attributes: HtmlAttributes;
    }
  | {
      kind: 'submit';
      value: string;
      attributes: HtmlAttributes;
    };
