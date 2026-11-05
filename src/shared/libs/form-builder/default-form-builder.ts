import type { FormBuilder } from './form-builder.interface.js';
import type { AttributeValue, FormElement, HtmlAttributes, InputOptions } from '../../types/index.js';

export class DefaultFormBuilder<T extends object> implements FormBuilder<T> {
  private readonly elements: FormElement[] = [];

  constructor(private readonly template: Readonly<T>) {}

  public input(name: Extract<keyof T, string>, options: InputOptions = {}): void {
    if (!Object.hasOwn(this.template, name)) {
      throw new Error(`Field '${name}' does not exist in the template.`);
    }

    const {
      as = 'input',
      label = name.charAt(0).toUpperCase() + name.slice(1),
      labelHtml = {},
      ...inputAttributes
    } = options;

    if (as !== 'input' && as !== 'textarea') {
      throw new Error(`Unsupported input type '${as}'.`);
    }

    const attributes: HtmlAttributes = Object.fromEntries(
      Object.entries(inputAttributes).map(([key, value]): [string, AttributeValue] => {
        if (value !== null && typeof value === 'object') {
          throw new Error(`HTML attribute '${key}' must have a primitive value.`);
        }

        return [key, value];
      }),
    );

    this.elements.push({
      kind: as,
      name,
      label,
      labelAttributes: { ...labelHtml },
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
