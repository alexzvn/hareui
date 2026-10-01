import type { VNode } from 'vue'
import { TextField } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {
  'field-error-default': () => h(TextField, { invalid: true, label: 'Email', placeholder: 'john@example.com', errorMessage: 'Please enter a valid email address' }),
}
