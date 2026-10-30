import type { VNode } from 'vue'
import type { CheckboxGroupItem, CheckboxGroupProps } from '@hareui/vue'
import { CheckboxGroup } from '@hareui/vue'
import { h } from 'vue'

const interests: CheckboxGroupItem[] = [
  { value: 'coding', label: 'Coding' },
  { value: 'design', label: 'Design' },
  { value: 'writing', label: 'Writing' },
]
const head = { label: 'Select your interests', description: 'Choose all that apply' }

const group = (props: CheckboxGroupProps & Record<string, unknown>) => h(CheckboxGroup, { name: 'interests', items: interests, ...props })

export const cases: Record<string, () => VNode> = {
  'checkbox-group-primary': () => group({ 'defaultValue': ['design'], 'aria-label': 'Interests' }),
  'checkbox-group-secondary': () => group({ 'defaultValue': ['design'], 'variant': 'secondary', 'aria-label': 'Interests' }),
  'checkbox-group-with-label': () => group({
    defaultValue: ['design'],
    items: [
      { value: 'coding', label: 'Coding', description: 'Love building software' },
      { value: 'design', label: 'Design', description: 'Enjoy creating beautiful interfaces' },
      { value: 'writing', label: 'Writing', description: 'Passionate about content creation' },
    ],
    ...head,
  }),
  'checkbox-group-required': () => group({ required: true, ...head }),
  'checkbox-group-disabled': () => group({ 'defaultValue': ['design'], 'disabled': true, 'aria-label': 'Interests' }),
  'checkbox-group-item-disabled': () => group({
    'defaultValue': ['design'],
    'aria-label': 'Interests',
    'items': [
      { value: 'coding', label: 'Coding' },
      { value: 'design', label: 'Design' },
      { value: 'writing', label: 'Writing', disabled: true },
    ],
  }),
  'checkbox-group-invalid': () => group({ invalid: true, label: 'Interests', errorMessage: 'Select at least one interest' }),
  'checkbox-group-invalid-selected': () => group({ invalid: true, defaultValue: ['design'], label: 'Interests', errorMessage: 'Select at least one interest' }),
  'checkbox-group-readonly': () => group({ 'defaultValue': ['design'], 'readonly': true, 'aria-label': 'Interests' }),
  // user utilities beat the mt-4 item spacing; content classes can key on data-selected
  'checkbox-group-user-overrides': () => group({ 'defaultValue': ['design'], 'aria-label': 'Interests', 'class': '**:data-[slot=checkbox]:mt-0', 'ui': { content: 'rounded-xl data-[selected=true]:bg-accent/10' } }),
}

// Same renders, different interaction targets (see parity/cases/checkbox-group.json)
cases['checkbox-group-primary-item'] = cases['checkbox-group-primary']!
cases['checkbox-group-primary-selected-item'] = cases['checkbox-group-primary']!
cases['checkbox-group-secondary-item'] = cases['checkbox-group-secondary']!
cases['checkbox-group-secondary-selected-item'] = cases['checkbox-group-secondary']!
cases['checkbox-group-disabled-with-label'] = () => group({ defaultValue: ['design'], disabled: true, ...head })
