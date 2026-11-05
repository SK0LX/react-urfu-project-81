import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import HexletCode from '../src/index.js';

const readFixture = (name: string) => (
  readFileSync(new URL(`../__fixtures__/${name}`, import.meta.url), 'utf8').trim()
);

describe('Hexlet checker regressions', () => {
  const template = { name: 'rob', job: 'hexlet', gender: 'm' };

  test('renders method before action in a complete form', () => {
    const form = HexletCode.formFor(template, {}, (f) => {
      f.input('name');
      f.input('job', { as: 'textarea' });
      f.submit('Wow');
    });

    expect(form).toBe('<form method="post" action="#">'
      + '<label for="name">Name</label><input name="name" type="text" value="rob">'
      + '<label for="job">Job</label><textarea cols="20" rows="40" name="job">hexlet</textarea>'
      + '<input type="submit" value="Wow"></form>');
  });

  test('uses label and labelHtml as label options instead of input attributes', () => {
    const form = HexletCode.formFor(template, {}, (f) => {
      f.input('name', {
        label: 'User',
        labelHtml: { class: 'form-label', id: 'name-label' },
      });
      f.submit('Ok');
    });

    expect(form).toBe(readFixture('form-label-attributes.html'));
  });

  test('uses as to select textarea without rendering the option as an attribute', () => {
    const form = HexletCode.formFor(template, {}, (f) => {
      f.input('job', { as: 'textarea' });
      f.submit('Wow');
    });

    expect(form).toBe(readFixture('form-as-ignored.html'));
  });

  test('maps url to action while keeping method first', () => {
    const form = HexletCode.formFor(template, { url: '/users' }, (f) => {
      f.input('name');
      f.input('job', { as: 'textarea' });
      f.submit('Wow');
    });

    expect(form).toBe(readFixture('form-with-url.html'));
  });
});
