import { describe, expect, test } from 'vitest';
import HexletCode from '../src/index.js';

describe('Input label options', () => {
  test('supports label attributes while preserving the default caption', () => {
    const form = HexletCode.formFor({ name: 'rob' }, {}, (f) => {
      f.input('name', { labelHtml: { class: 'form-label' } });
    });

    expect(form).toBe('<form method="post" action="#">'
      + '<label for="name" class="form-label">Name</label>'
      + '<input name="name" type="text" value="rob"></form>');
  });

  test('escapes custom label text and attributes separately from input attributes', () => {
    const special = '<>&"\'';
    const escaped = '&lt;&gt;&amp;&quot;&#39;';
    const form = HexletCode.formFor({ name: 'rob' }, {}, (f) => {
      f.input('name', { label: special, labelHtml: { title: special }, class: 'user-input' });
    });

    expect(form).toBe('<form method="post" action="#">'
      + `<label for="name" title="${escaped}">${escaped}</label>`
      + '<input name="name" type="text" value="rob" class="user-input"></form>');
  });

  test('preserves an explicitly empty label caption', () => {
    const form = HexletCode.formFor({ name: 'rob' }, {}, (f) => f.input('name', { label: '' }));

    expect(form).toBe('<form method="post" action="#">'
      + '<label for="name"></label><input name="name" type="text" value="rob"></form>');
  });

  test('rejects nested values used as input HTML attributes', () => {
    expect(() => HexletCode.formFor({ name: 'rob' }, {}, (f) => {
      f.input('name', { class: { value: 'user-input' } });
    })).toThrow(new Error("HTML attribute 'class' must have a primitive value."));
  });
});
