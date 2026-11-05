import type { FormElement, FormOptions } from '../../types/index.js';

export interface FormRenderer {
  render(elements: readonly FormElement[], options: FormOptions): string;
}
