import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import HexletCode from '../src/index.js';

const expectedForm = readFileSync(new URL('../__fixtures__/form.html', import.meta.url), 'utf8').trim();

describe('HexletCode.formFor', () => {
  test('renders inputs and a submit control', () => {
    const template = { name: 'rob', job: 'hexlet', gender: 'm' };
    const form = HexletCode.formFor(template, { method: 'post' }, (f) => {
      f.input('name');
      f.input('job', { as: 'textarea' });
      f.submit('Wow');
    });

    expect(form).toBe(expectedForm);
  });

  test('renders an empty form with default attributes', () => {
    expect(HexletCode.formFor({})).toBe('<form action="#" method="post"></form>');
  });

  test('accepts a URL, method and additional form attributes', () => {
    expect(HexletCode.formFor({}, { url: '/users', method: 'get', class: 'profile' }))
      .toBe('<form action="/users" method="get" class="profile"></form>');
    expect(HexletCode.formFor({}, { action: '/profiles' }))
      .toBe('<form action="/profiles" method="post"></form>');
  });

  test('overrides input attributes and accepts a custom id', () => {
    const form = HexletCode.formFor({ email: 'rob@example.com' }, {}, (f) => {
      f.input('email', { type: 'email', id: 'user-email', required: true, disabled: false });
    });

    expect(form).toBe('<form action="#" method="post">'
      + '<input name="email" type="email" value="rob@example.com" id="user-email" required>'
      + '</form>');
  });

  test('overrides textarea dimensions', () => {
    const form = HexletCode.formFor({ bio: 'Hello' }, {}, (f) => {
      f.input('bio', { as: 'textarea', cols: 50, rows: 5, class: 'bio' });
    });

    expect(form).toBe('<form action="#" method="post">'
      + '<textarea cols="50" rows="5" name="bio" class="bio">Hello</textarea>'
      + '</form>');
  });

  test('escapes text, field names and HTML attribute values', () => {
    const special = '<>&"\'';
    const escaped = '&lt;&gt;&amp;&quot;&#39;';
    const form = HexletCode.formFor({ '<field>': special, bio: special }, { url: `/users?q=${special}` }, (f) => {
      f.input('<field>', { title: special });
      f.input('bio', { as: 'textarea' });
      f.submit(special);
    });

    expect(form).toBe(`<form action="/users?q=${escaped}" method="post">`
      + `<input name="&lt;field&gt;" type="text" value="${escaped}" title="${escaped}">`
      + `<textarea cols="20" rows="40" name="bio">${escaped}</textarea>`
      + `<input type="submit" value="${escaped}">`
      + '</form>');
  });

  test.each([
    { value: 0, rendered: '0' },
    { value: false, rendered: 'false' },
    { value: '', rendered: '' },
    { value: null, rendered: '' },
    { value: undefined, rendered: '' },
  ])('renders the field value $value', ({ value, rendered }) => {
    const form = HexletCode.formFor({ value }, {}, (f) => f.input('value'));

    expect(form).toBe('<form action="#" method="post">'
      + `<input name="value" type="text" value="${rendered}">`
      + '</form>');
  });

  test('reports an unknown field', () => {
    expect(() => HexletCode.formFor({ name: 'rob' }, {}, (f) => {
      // @ts-expect-error Unknown keys must also be rejected by TypeScript.
      f.input('missing');
    })).toThrow("Field 'missing' does not exist in the template.");
  });

  test('rejects inherited properties', () => {
    const template: Record<string, string> = { name: 'rob' };

    expect(() => HexletCode.formFor(template, {}, (f) => f.input('toString')))
      .toThrow("Field 'toString' does not exist in the template.");
  });

  test('reports unsupported controls passed by JavaScript consumers', () => {
    expect(() => HexletCode.formFor({ name: 'rob' }, {}, (f) => {
      // @ts-expect-error JavaScript consumers can pass an unsupported control.
      f.input('name', { as: 'select' });
    })).toThrow("Unsupported input type 'select'.");
  });

  test('supports the default submit caption and custom attributes', () => {
    const form = HexletCode.formFor({}, {}, (f) => {
      f.submit();
      f.submit('Send', { class: 'button', disabled: true });
    });

    expect(form).toBe('<form action="#" method="post">'
      + '<input type="submit" value="Save">'
      + '<input type="submit" value="Send" class="button" disabled>'
      + '</form>');
  });

  test('does not modify shared data or options', () => {
    const template = Object.freeze({ job: 'hexlet' });
    const formOptions = Object.freeze({ method: 'get', url: '/users' });
    const inputOptions = Object.freeze({ as: 'textarea' as const, rows: 5 });
    const submitOptions = Object.freeze({ class: 'button' });
    const form = HexletCode.formFor(template, formOptions, (f) => {
      f.input('job', inputOptions);
      f.submit('Save', submitOptions);
    });

    expect(form).toBe('<form action="/users" method="get">'
      + '<textarea cols="20" rows="5" name="job">hexlet</textarea>'
      + '<input type="submit" value="Save" class="button">'
      + '</form>');
    expect(template).toEqual({ job: 'hexlet' });
    expect(formOptions).toEqual({ method: 'get', url: '/users' });
    expect(inputOptions).toEqual({ as: 'textarea', rows: 5 });
    expect(submitOptions).toEqual({ class: 'button' });
  });

  test('keeps nested forms independent', () => {
    let inner = '';
    const outer = HexletCode.formFor({ name: 'rob' }, {}, (f) => {
      f.input('name');
      inner = HexletCode.formFor({ job: 'hexlet' }, {}, (nested) => nested.input('job'));
      f.submit();
    });

    expect(inner).toBe('<form action="#" method="post">'
      + '<input name="job" type="text" value="hexlet">'
      + '</form>');
    expect(outer).toBe('<form action="#" method="post">'
      + '<input name="name" type="text" value="rob">'
      + '<input type="submit" value="Save">'
      + '</form>');
    expect(HexletCode.formFor({})).toBe('<form action="#" method="post"></form>');
  });
});
