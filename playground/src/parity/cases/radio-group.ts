import type { VNode } from 'vue'
import type { RadioGroupItem, RadioGroupProps } from 'herouse'
import { RadioGroup } from 'herouse'
import { h } from 'vue'

const plans: RadioGroupItem[] = [
  { value: 'basic', label: 'Basic Plan' },
  { value: 'premium', label: 'Premium Plan' },
  { value: 'business', label: 'Business Plan' },
]
const head = { label: 'Plan selection', description: 'Choose the plan that suits you best' }

const group = (props: RadioGroupProps & Record<string, unknown>) => h(RadioGroup, { name: 'plan', items: plans, ...props })

export const cases: Record<string, () => VNode> = {
  'radio-group-primary': () => group({ 'defaultValue': 'premium', 'aria-label': 'Plan' }),
  'radio-group-secondary': () => group({ 'defaultValue': 'premium', 'variant': 'secondary', 'aria-label': 'Plan' }),
  'radio-group-horizontal': () => group({ 'defaultValue': 'premium', 'orientation': 'horizontal', 'aria-label': 'Plan' }),
  'radio-group-with-label': () => group({
    defaultValue: 'premium',
    items: [
      { value: 'basic', label: 'Basic Plan', description: 'Includes 100 messages per month' },
      { value: 'premium', label: 'Premium Plan', description: 'Includes 200 messages per month' },
      { value: 'business', label: 'Business Plan', description: 'Unlimited messages' },
    ],
    ...head,
  }),
  'radio-group-required': () => group({ required: true, ...head }),
  'radio-group-disabled': () => group({ 'defaultValue': 'premium', 'disabled': true, 'aria-label': 'Plan' }),
  'radio-group-item-disabled': () => group({
    'defaultValue': 'premium',
    'aria-label': 'Plan',
    'items': [
      { value: 'basic', label: 'Basic Plan' },
      { value: 'premium', label: 'Premium Plan' },
      { value: 'business', label: 'Business Plan', disabled: true },
    ],
  }),
  'radio-group-invalid': () => group({ invalid: true, label: 'Plan selection', errorMessage: 'Please select a plan' }),
  'radio-group-invalid-selected': () => group({ invalid: true, defaultValue: 'premium', label: 'Plan selection', errorMessage: 'Please select a plan' }),
  'radio-group-readonly': () => group({ 'defaultValue': 'premium', 'readonly': true, 'aria-label': 'Plan' }),
}

// Same renders, different interaction targets (see parity/cases/radio-group.json)
cases['radio-group-primary-item'] = cases['radio-group-primary']!
cases['radio-group-primary-selected-item'] = cases['radio-group-primary']!
cases['radio-group-secondary-item'] = cases['radio-group-secondary']!
cases['radio-group-secondary-selected-item'] = cases['radio-group-secondary']!
cases['radio-group-disabled-with-label'] = () => group({ defaultValue: 'premium', disabled: true, ...head })
