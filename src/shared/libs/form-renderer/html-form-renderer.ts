import type { FormRenderer } from './form-renderer.interface.js';
import type { TagRenderer } from '../tag-renderer/index.js';
import type { FormElement, FormOptions } from '../../types/index.js';
import { escapeHtml } from '../../helpers/index.js';

export class HtmlFormRenderer implements FormRenderer {
  constructor(private readonly tagRenderer: TagRenderer) {}

  public render(elements: readonly FormElement[], options: FormOptions): string {
    const { url = '#', ...attributes } = options;

    return this.tagRenderer.render('form', {
      action: url,
      method: 'post',
      ...attributes,
    }, elements.map((element) => this.renderElement(element)).join(''));
  }

  private renderElement(element: FormElement): string {
    if (element.kind === 'submit') {
      return this.tagRenderer.render('input', {
        type: 'submit',
        value: element.value,
        ...element.attributes,
      });
    }

    const { name, value, attributes } = element;

    return element.kind === 'textarea'
      ? this.tagRenderer.render('textarea', {
        cols: 20,
        rows: 40,
        name,
        ...attributes,
      }, escapeHtml(value))
      : this.tagRenderer.render('input', {
        name,
        type: 'text',
        value,
        ...attributes,
      });
  }
}
