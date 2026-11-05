import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';
import HexletCode from '../src/index.js';

const readFixture = (name: string) => (
  readFileSync(new URL(`../__fixtures__/${name}`, import.meta.url), 'utf8').trim()
);

describe('HexletCode.formFor: inputs', () => {
  const template = Object.freeze({ name: 'rob', job: 'hexlet', gender: 'm' });

  test('renders only the requested inputs in the order of their calls', () => {
    const form = HexletCode.formFor(template, { method: 'post' }, (f) => {
      f.input('name');
      f.input('job', { as: 'textarea' });
    });

    expect(form).toBe(readFixture('input-and-textarea.html'));
  });

  test('adds custom HTML attributes and renders a text input by default', () => {
    const form = HexletCode.formFor(template, {}, (f) => {
      f.input('name', { class: 'user-input' });
      f.input('job');
    });

    expect(form).toBe(readFixture('input-attributes.html'));
  });

  test('uses default textarea dimensions', () => {
    const form = HexletCode.formFor(template, {}, (f) => f.input('job', { as: 'textarea' }));

    expect(form).toBe(readFixture('textarea.html'));
  });

  test('overrides textarea dimensions without rendering the as option as an attribute', () => {
    const form = HexletCode.formFor(template, { url: '#' }, (f) => {
      f.input('job', { as: 'textarea', rows: 50, cols: 50 });
    });

    expect(form).toBe(readFixture('textarea-attributes.html'));
  });

  test('reports a missing field after previously added inputs', () => {
    expect(() => HexletCode.formFor(template, { url: '/users' }, (f) => {
      f.input('name');
      f.input('job', { as: 'textarea' });
      // @ts-expect-error Missing fields must also be rejected by TypeScript.
      f.input('age');
    })).toThrow(new Error("Field 'age' does not exist in the template."));
  });
});
