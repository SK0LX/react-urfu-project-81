import type { FormElement, HtmlAttributes, InputOptions } from '../../types/index.js';

export interface FormBuilder<T extends object> {
  input(name: Extract<keyof T, string>, options?: InputOptions): void;
  submit(value?: string, attributes?: HtmlAttributes): void;
  getElements(): readonly FormElement[];
}
