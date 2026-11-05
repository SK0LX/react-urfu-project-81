import type { TagRenderer } from './tag-renderer.interface.js';
import type { HtmlAttributes } from '../../types/index.js';
import { Tag } from './tag.js';

export class HtmlTagRenderer implements TagRenderer {
  public render(name: string, attributes: HtmlAttributes = {}, content: string = ''): string {
    return new Tag(name, attributes, content).toString();
  }
}
