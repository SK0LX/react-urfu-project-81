import type { HtmlAttributes } from '../../types/index.js';

export interface TagRenderer {
  render(name: string, attributes?: HtmlAttributes, content?: string): string;
}
