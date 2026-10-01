import type { VNode } from 'vue'
import { Input } from 'herouse'
import { h } from 'vue'

const placeholder = 'Enter your name'

export const cases: Record<string, () => VNode> = {
  'input-primary': () => h(Input, { placeholder }),
  'input-secondary': () => h(Input, { placeholder, variant: 'secondary' }),
  'input-full-width': () => h(Input, { placeholder, fullWidth: true }),
  'input-disabled': () => h(Input, { placeholder, disabled: true }),
  'input-invalid': () => h(Input, { placeholder, invalid: true }),
  'input-secondary-invalid': () => h(Input, { placeholder, variant: 'secondary', invalid: true }),
  'input-value': () => h(Input, { modelValue: 'Jane Doe' }),
  'input-readonly-default-value': () => h(Input, { defaultValue: 'Jane Doe', readonly: true }),
}
