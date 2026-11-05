import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import HexletCode from '../src/index.js';

const readFixture = (name: string) => (
  readFileSync(new URL(`../__fixtures__/${name}`, import.meta.url), 'utf8').trim()
);

describe('HexletCode.formFor: labels and submit', () => {
  const template = Object.freeze({ name: 'rob', job: 'hexlet', gender: 'm' });

  test('adds a label before each field and uses Save as the default submit caption', () => {
    const form = HexletCode.formFor(template, { method: 'post' }, (f) => {
      f.input('name');
      f.input('job');
      f.submit();
    });

    expect(form).toBe(readFixture('form-submit-default.html'));
  });

  test('supports a custom submit caption', () => {
    const form = HexletCode.formFor(template, { method: 'post' }, (f) => {
      f.input('name');
      f.input('job');
      f.submit('Wow');
    });

    expect(form).toBe(readFixture('form-submit-custom.html'));
  });

  test('renders a submit control without a label', () => {
    const form = HexletCode.formFor({}, {}, (f) => f.submit());

    expect(form).toBe('<form method="post" action="#"><input type="submit" value="Save"></form>');
  });
});
