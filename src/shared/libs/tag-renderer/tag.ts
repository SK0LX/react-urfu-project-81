import type { HtmlAttributes } from '../../types/index.js';
import { escapeHtml } from '../../helpers/index.js';
import { VOID_TAGS } from './void-tags.constant.js';

export class Tag {
  constructor(
    private readonly name: string,
    private readonly attributes: Readonly<HtmlAttributes> = {},
    private readonly content: string = '',
  ) {}

  public toString(): string {
    const openingTag = `<${this.name}${this.renderAttributes()}>`;

    return VOID_TAGS.has(this.name.toLowerCase())
      ? openingTag
      : `${openingTag}${this.content}</${this.name}>`;
  }

  private renderAttributes(): string {
    return Object.entries(this.attributes)
      .filter(([, value]) => value !== undefined && value !== null && value !== false)
      .map(([name, value]) => (
        value === true ? ` ${name}` : ` ${name}="${escapeHtml(String(value))}"`
      ))
      .join('');
  }
}
