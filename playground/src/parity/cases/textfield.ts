import type { VNode } from 'vue'
import { TextField } from 'herouse'
import { h } from 'vue'

const base = { label: 'Email', placeholder: 'john@example.com', description: 'We\'ll never share your email.' }

export const cases: Record<string, () => VNode> = {
  'textfield-default': () => h(TextField, base),
  'textfield-secondary': () => h(TextField, { ...base, variant: 'secondary' }),
  'textfield-required': () => h(TextField, { ...base, required: true }),
  'textfield-disabled': () => h(TextField, { ...base, disabled: true }),
  'textfield-invalid': () => h(TextField, { ...base, invalid: true, errorMessage: 'Please enter a valid email address' }),
  'textfield-full-width': () => h(TextField, { ...base, fullWidth: true }),
  'textfield-readonly': () => h(TextField, { ...base, readonly: true, defaultValue: 'jane@example.com' }),
}
