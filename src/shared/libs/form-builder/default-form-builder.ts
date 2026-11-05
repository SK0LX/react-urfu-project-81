import type { FormBuilder } from './form-builder.interface.js';
import type { FormElement, HtmlAttributes, InputOptions } from '../../types/index.js';

export class DefaultFormBuilder<T extends object> implements FormBuilder<T> {
  private readonly elements: FormElement[] = [];

  constructor(private readonly template: Readonly<T>) {}

  public input(name: Extract<keyof T, string>, options: InputOptions = {}): void {
    if (!Object.hasOwn(this.template, name)) {
      throw new Error(`Field '${name}' does not exist in the template.`);
    }

    const { as = 'input', ...attributes } = options;

    if (as !== 'input' && as !== 'textarea') {
      throw new Error(`Unsupported input type '${as}'.`);
    }

    this.elements.push({
      kind: as,
      name,
      value: String(this.template[name] ?? ''),
      attributes,
    });
  }

  public submit(value: string = 'Save', attributes: HtmlAttributes = {}): void {
    this.elements.push({
      kind: 'submit',
      value,
      attributes: { ...attributes },
    });
  }

  public getElements(): readonly FormElement[] {
    return this.elements;
  }
}
