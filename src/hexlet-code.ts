import { DefaultFormBuilder } from './shared/libs/form-builder/index.js';
import type { FormBuilder } from './shared/libs/form-builder/index.js';
import { HtmlFormRenderer } from './shared/libs/form-renderer/index.js';
import type { FormRenderer } from './shared/libs/form-renderer/index.js';
import { HtmlTagRenderer } from './shared/libs/tag-renderer/index.js';
import type { TagRenderer } from './shared/libs/tag-renderer/index.js';
import type { FormOptions } from './shared/types/index.js';

export default class HexletCode {
  public static formFor<T extends object>(
    template: T,
    options: FormOptions = {},
    build?: (form: FormBuilder<T>) => void,
  ): string {
    const builder: FormBuilder<T> = new DefaultFormBuilder(template);
    const tagRenderer: TagRenderer = new HtmlTagRenderer();
    const formRenderer: FormRenderer = new HtmlFormRenderer(tagRenderer);

    build?.(builder);

    return formRenderer.render(builder.getElements(), options);
  }
}
