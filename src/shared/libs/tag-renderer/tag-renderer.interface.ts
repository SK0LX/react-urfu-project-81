import type { HtmlAttributes } from '../../types/index.js';
import type { TagName } from './tag-name.type.js';

export interface TagRenderer {
  render(name: TagName, attributes: HtmlAttributes, content?: string): string;
}
