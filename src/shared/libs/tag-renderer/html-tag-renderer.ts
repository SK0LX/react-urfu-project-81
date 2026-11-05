import type { TagRenderer } from './tag-renderer.interface.js';
import type { TagName } from './tag-name.type.js';
import type { HtmlAttributes } from '../../types/index.js';
import { escapeHtml } from '../../helpers/index.js';

export class HtmlTagRenderer implements TagRenderer {
  public render(name: TagName, attributes: HtmlAttributes, content: string = ''): string {
    const openingTag = `<${name}${this.renderAttributes(attributes)}>`;

    return name === 'input' ? openingTag : `${openingTag}${content}</${name}>`;
  }

  private renderAttributes(attributes: HtmlAttributes): string {
    return Object.entries(attributes)
      .filter(([, value]) => value !== undefined && value !== null && value !== false)
      .map(([name, value]) => (
        value === true ? ` ${name}` : ` ${name}="${escapeHtml(String(value))}"`
      ))
      .join('');
  }
}
