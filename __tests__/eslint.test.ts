import { ESLint } from 'eslint';
import { describe, expect, test } from 'vitest';

describe('ESLint dependency compatibility', () => {
  test('detects code errors with the replacement URI resolver installed', async () => {
    const linter = new ESLint({
      overrideConfigFile: true,
      overrideConfig: {
        rules: {
          'no-var': 'error',
          eqeqeq: ['error', 'always'],
        },
      },
    });

    const [result] = await linter.lintText('var count = 1; if (count == 1) { count += 1; }');

    expect(result.errorCount).toBe(2);
    expect(result.messages.map(({ ruleId }) => ruleId).sort()).toEqual(['eqeqeq', 'no-var']);
  });

  test('validates rule options using a JSON Schema reference', async () => {
    const createLinter = (mode: string) => new ESLint({
      overrideConfigFile: true,
      overrideConfig: {
        plugins: {
          example: {
            rules: {
              mode: {
                meta: {
                  schema: {
                    type: 'array',
                    items: { $ref: '#/definitions/mode' },
                    definitions: {
                      mode: { enum: ['safe'] },
                    },
                  },
                },
                create: () => ({}),
              },
            },
          },
        },
        rules: { 'example/mode': ['error', mode] },
      },
    });

    const [result] = await createLinter('safe').lintText('const count = 1;');

    expect(result.errorCount).toBe(0);
    await expect(createLinter('invalid').lintText('const count = 1;'))
      .rejects.toThrow('example/mode');
  });
});
