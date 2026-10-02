import type { VNode } from 'vue'
import { SearchField } from 'herouse'
import { h } from 'vue'

const base = { label: 'Search', placeholder: 'Search...' }

export const cases: Record<string, () => VNode> = {
  'search-field-default': () => h(SearchField, base),
  'search-field-focus': () => h(SearchField, base),
  'search-field-with-value': () => h(SearchField, { ...base, modelValue: 'cats' }),
  'search-field-secondary': () => h(SearchField, { ...base, variant: 'secondary' }),
  'search-field-required': () => h(SearchField, { ...base, required: true }),
  'search-field-disabled': () => h(SearchField, { ...base, disabled: true, modelValue: 'Disabled search' }),
  'search-field-invalid': () => h(SearchField, { ...base, invalid: true, errorMessage: 'Search query must be at least 3 characters' }),
  'search-field-full-width': () => h(SearchField, { ...base, fullWidth: true }),
  'search-field-readonly': () => h(SearchField, { ...base, readonly: true, modelValue: 'jane@example.com' }),
  // user utilities beat the theme (HeroUI styles live in @layer components)
  'search-field-user-overrides': () => h(SearchField, { ...base, variant: 'secondary', ui: { group: 'rounded-xl bg-default', input: 'text-center' } }),
}
