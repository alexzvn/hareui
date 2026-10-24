import type { VNode } from 'vue'
import { TextField } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {
  'field-error-default': () => h(TextField, { invalid: true, label: 'Email', placeholder: 'john@example.com', errorMessage: 'Please enter a valid email address' }),
}
