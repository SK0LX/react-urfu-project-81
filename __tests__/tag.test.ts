import { describe, expect, test } from 'vitest';
import { Tag } from '../src/index.js';
import { HtmlTagRenderer } from '../src/shared/libs/tag-renderer/index.js';

describe('Tag', () => {
  test.each([
    { description: 'br', create: () => new Tag('br'), expected: '<br>' },
    {
      description: 'img with attributes',
      create: () => new Tag('img', { src: 'path/to/image' }),
      expected: '<img src="path/to/image">',
    },
    {
      description: 'submit input',
      create: () => new Tag('input', { type: 'submit', value: 'Save' }),
      expected: '<input type="submit" value="Save">',
    },
    { description: 'label with text', create: () => new Tag('label', {}, 'Email'), expected: '<label>Email</label>' },
    {
      description: 'label with attributes',
      create: () => new Tag('label', { for: 'email' }, 'Email'),
      expected: '<label for="email">Email</label>',
    },
    { description: 'empty div', create: () => new Tag('div'), expected: '<div></div>' },
  ])('renders $description from the assignment', ({ create, expected }) => {
    expect(create().toString()).toBe(expected);
  });

  test.each(['area', 'base', 'col', 'embed', 'hr', 'link', 'meta', 'param', 'source', 'track', 'wbr'])(
    'renders the void element %s without content or a closing tag',
    (name) => {
      expect(new Tag(name, {}, 'ignored').toString()).toBe(`<${name}>`);
    },
  );

  test('recognizes void elements regardless of letter case', () => {
    expect(new Tag('BR').toString()).toBe('<BR>');
    expect(new Tag('Img', { src: 'image.png' }).toString()).toBe('<Img src="image.png">');
  });

  test('supports arbitrary paired tags and nested HTML', () => {
    const content = new Tag('strong', {}, 'Hello').toString();

    expect(new Tag('article', { class: 'message' }, content).toString())
      .toBe('<article class="message"><strong>Hello</strong></article>');
    expect(new Tag('custom-element').toString()).toBe('<custom-element></custom-element>');
  });

  test('escapes special characters in attribute values', () => {
    expect(new Tag('input', { value: '<>&"\'' }).toString())
      .toBe('<input value="&lt;&gt;&amp;&quot;&#39;">');
  });

  test('preserves attribute order and handles numeric, empty and boolean values', () => {
    const tag = new Tag('input', {
      name: 'count',
      value: 0,
      title: '',
      required: true,
      disabled: false,
      placeholder: null,
      id: undefined,
    });

    expect(tag.toString()).toBe('<input name="count" value="0" title="" required>');
  });

  test('supports repeated conversion without changing shared attributes', () => {
    const attributes = Object.freeze({ for: 'email' });
    const tag = new Tag('label', attributes, 'Email');

    expect(String(tag)).toBe('<label for="email">Email</label>');
    expect(tag.toString()).toBe('<label for="email">Email</label>');
    expect(attributes).toEqual({ for: 'email' });
  });
});

describe('HtmlTagRenderer', () => {
  test('supports default arguments and arbitrary tags through the service', () => {
    const renderer = new HtmlTagRenderer();

    expect(renderer.render('br')).toBe('<br>');
    expect(renderer.render('img', { src: 'image.png' })).toBe('<img src="image.png">');
    expect(renderer.render('section', {}, 'Hello')).toBe('<section>Hello</section>');
  });
});
