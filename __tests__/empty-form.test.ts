import { describe, expect, test } from 'vitest';
import HexletCode from '../src/index.js';

describe('HexletCode.formFor: empty form', () => {
  const template = Object.freeze({ name: 'rob', job: 'hexlet', gender: 'm' });

  test('returns an empty form with default attributes when the callback adds no fields', () => {
    const form = HexletCode.formFor(template, {}, () => {});

    expect(form).toBe('<form method="post" action="#"></form>');
  });

  test('uses the supplied URL as action and preserves the default post method', () => {
    const form = HexletCode.formFor(template, { url: '/users' }, () => {});

    expect(form).toBe('<form method="post" action="/users"></form>');
  });
});
