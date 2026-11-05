import { expect, test } from 'vitest';
import { DefaultFormBuilder } from '../src/shared/libs/form-builder/index.js';
import type { FormBuilder } from '../src/shared/libs/form-builder/index.js';
import { HtmlFormRenderer } from '../src/shared/libs/form-renderer/index.js';
import type { FormRenderer } from '../src/shared/libs/form-renderer/index.js';
import type { TagRenderer } from '../src/shared/libs/tag-renderer/index.js';

test('accepts a replacement tag renderer through its interface', () => {
  const builder: FormBuilder<{ name: string }> = new DefaultFormBuilder({ name: 'rob' });
  const tagRenderer: TagRenderer = {
    render(name, attributes, content = '') {
      return `[${name}:${content}]`;
    },
  };
  const renderer: FormRenderer = new HtmlFormRenderer(tagRenderer);
  builder.input('name');

  expect(renderer.render(builder.getElements(), {})).toBe('[form:[label:Name][input:]]');
});
