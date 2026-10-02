import type { VNode } from 'vue'
import { TextArea, TextField } from 'herouse'
import { h } from 'vue'

const placeholder = 'Share a quick project update...'

export const cases: Record<string, () => VNode> = {
  'textarea-primary': () => h(TextArea, { placeholder }),
  'textarea-secondary': () => h(TextArea, { placeholder, variant: 'secondary' }),
  'textarea-full-width': () => h(TextArea, { placeholder, fullWidth: true }),
  'textarea-disabled': () => h(TextArea, { placeholder, disabled: true }),
  'textarea-invalid': () => h(TextArea, { placeholder, invalid: true }),
  'textarea-secondary-invalid': () => h(TextArea, { placeholder, variant: 'secondary', invalid: true }),
  'textarea-value': () => h(TextArea, { modelValue: 'Shipped the new onboarding flow.' }),
  'textarea-rows': () => h(TextArea, { placeholder, rows: 6, class: 'w-96' }),
  'textarea-in-textfield': () => h(TextField, { label: 'Message', name: 'message', class: 'w-full max-w-64' }, {
    default: () => h(TextArea, { placeholder: 'Write your message here...', rows: 4 }),
    description: () => 'Maximum 500 characters',
  }),
}
