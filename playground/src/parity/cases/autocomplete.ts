import type { VNode } from 'vue'
import { Autocomplete } from 'herouse'
import { h } from 'vue'
import { gear } from '../icons'

const states = ['Florida', 'Delaware', 'California', 'Texas'].map(label => ({ value: label.toLowerCase(), label }))
const base = { class: 'w-[256px]', placeholder: 'Select one', label: 'State', items: states, clearable: true, searchLabel: 'Search states', searchPlaceholder: 'Search states...' }
const sections = [
  { type: 'section' as const, label: 'South', items: [{ value: 'florida', label: 'Florida' }, { value: 'texas', label: 'Texas' }] },
  { type: 'separator' as const },
  { type: 'section' as const, label: 'West', items: [{ value: 'california', label: 'California' }] },
]
const empty = { empty: () => 'No results found' }

export const cases: Record<string, () => VNode> = {
  'autocomplete-default': () => h(Autocomplete, base, empty),
  'autocomplete-selected': () => h(Autocomplete, { ...base, defaultValue: 'texas' }, empty),
  'autocomplete-secondary': () => h(Autocomplete, { ...base, variant: 'secondary' }, empty),
  'autocomplete-disabled': () => h(Autocomplete, { ...base, disabled: true, defaultValue: 'florida' }, empty),
  'autocomplete-invalid': () => h(Autocomplete, { ...base, invalid: true, description: 'Pick a state', errorMessage: 'Please select a state' }, empty),
  'autocomplete-description': () => h(Autocomplete, { ...base, description: 'Select your state of residence' }, empty),
  'autocomplete-required': () => h(Autocomplete, { ...base, required: true }, empty),
  'autocomplete-full-width': () => h('div', { class: 'w-[400px]' }, [h(Autocomplete, { ...base, class: undefined, fullWidth: true }, empty)]),
  'autocomplete-custom-indicator': () => h(Autocomplete, base, { ...empty, indicator: () => gear() }),
  'autocomplete-multiple': () => h(Autocomplete, { ...base, selectionMode: 'multiple', defaultValue: ['florida', 'texas'] }, empty),
  'autocomplete-open': () => h(Autocomplete, { ...base, defaultOpen: true, defaultValue: 'delaware' }, empty),
  'autocomplete-open-no-search': () => h(Autocomplete, { ...base, defaultOpen: true, search: false, selectionMode: 'multiple', defaultValue: ['florida', 'texas'] }, empty),
  'autocomplete-open-sections': () => h(Autocomplete, { ...base, defaultOpen: true, items: sections }),
  'autocomplete-open-empty': () => h(Autocomplete, { ...base, defaultOpen: true, allowsEmptyCollection: true, items: [] }, empty),
  'autocomplete-user-overrides': () => h(Autocomplete, { ...base, ui: { trigger: 'bg-accent-soft rounded-xl', value: 'font-semibold' } }, empty),
}
