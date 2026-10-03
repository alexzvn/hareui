import type { VNode } from 'vue'
import type { CheckboxProps } from '@hareui/vue'
import { Checkbox } from '@hareui/vue'
import { h } from 'vue'

const box = (props: CheckboxProps & Record<string, unknown> = {}) => h(Checkbox, { name: 'terms', label: 'Accept terms and conditions', ...props })
const terms = { label: 'I agree to the terms', errorMessage: 'You must accept the terms to continue' }

export const cases: Record<string, () => VNode> = {
  'checkbox-primary': () => box(),
  'checkbox-secondary': () => box({ variant: 'secondary' }),
  'checkbox-checked': () => box({ defaultValue: true }),
  'checkbox-secondary-checked': () => box({ variant: 'secondary', defaultValue: true }),
  'checkbox-indeterminate': () => box({ defaultValue: 'indeterminate' }),
  'checkbox-secondary-indeterminate': () => box({ variant: 'secondary', defaultValue: 'indeterminate' }),
  'checkbox-disabled': () => box({ disabled: true }),
  'checkbox-disabled-checked': () => box({ disabled: true, defaultValue: true }),
  'checkbox-required': () => box({ required: true }),
  'checkbox-invalid': () => box({ invalid: true, ...terms }),
  'checkbox-invalid-checked': () => box({ invalid: true, defaultValue: true, ...terms }),
  'checkbox-invalid-indeterminate': () => box({ invalid: true, defaultValue: 'indeterminate', label: 'I agree to the terms' }),
  'checkbox-with-description': () => box({ label: 'Email notifications', description: 'Get notified when someone mentions you in a comment' }),
  'checkbox-no-label': () => box({ 'label': undefined, 'aria-label': 'Accept terms' }),
  'checkbox-readonly': () => box({ readonly: true, defaultValue: true }),
  'checkbox-readonly-unchecked': () => box({ readonly: true }),
}
