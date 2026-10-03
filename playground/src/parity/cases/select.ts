import type { VNode } from 'vue'
import { Select } from '@hareui/vue'
import { h } from 'vue'

const states = ['Florida', 'Delaware', 'California', 'Texas'].map(label => ({ value: label.toLowerCase(), label }))
const base = { class: 'w-[256px]', placeholder: 'Select one', label: 'State', items: states }

export const cases: Record<string, () => VNode> = {
  'select-default': () => h(Select, base),
  'select-selected': () => h(Select, { ...base, defaultValue: 'texas' }),
  'select-secondary': () => h(Select, { ...base, variant: 'secondary' }),
  'select-disabled': () => h(Select, { ...base, disabled: true, defaultValue: 'florida' }),
  'select-invalid': () => h(Select, { ...base, invalid: true, description: 'Pick a state', errorMessage: 'Please select a state' }),
  'select-description': () => h(Select, { ...base, description: 'Where you live' }),
  'select-required': () => h(Select, { ...base, required: true }),
  'select-full-width': () => h('div', { class: 'w-[400px]' }, [h(Select, { ...base, class: undefined, fullWidth: true })]),
  'select-clear-button': () => h(Select, { ...base, clearable: true, defaultValue: 'delaware' }),
  'select-multiple': () => h(Select, { ...base, selectionMode: 'multiple', defaultValue: ['florida', 'texas'] }),
  'select-open': () => h(Select, { ...base, defaultOpen: true, defaultValue: 'delaware' }),
  'select-open-multiple': () => h(Select, { ...base, defaultOpen: true, selectionMode: 'multiple', defaultValue: ['florida', 'texas'] }),
  'select-user-overrides': () => h(Select, { ...base, ui: { trigger: 'bg-accent-soft rounded-xl', value: 'font-semibold' } }),
}
