import type { VNode } from 'vue'
import { NumberField } from 'herouse'
import { h } from 'vue'

const base = { label: 'Width', description: 'Enter the width in pixels', defaultValue: 1024, min: 0 }

export const cases: Record<string, () => VNode> = {
  'number-field-default': () => h(NumberField, base),
  'number-field-focus': () => h(NumberField, base),
  'number-field-increment': () => h(NumberField, base),
  'number-field-at-min': () => h(NumberField, { ...base, defaultValue: 0 }),
  'number-field-secondary': () => h(NumberField, { ...base, variant: 'secondary' }),
  'number-field-secondary-focus': () => h(NumberField, { ...base, variant: 'secondary' }),
  'number-field-required': () => h(NumberField, { ...base, required: true }),
  'number-field-disabled': () => h(NumberField, { ...base, disabled: true }),
  'number-field-invalid': () => h(NumberField, { ...base, invalid: true, errorMessage: 'Width must be at least 0' }),
  'number-field-full-width': () => h(NumberField, { ...base, fullWidth: true }),
  'number-field-readonly': () => h(NumberField, { ...base, readonly: true }),
  'number-field-percent': () => h(NumberField, { label: 'Percentage', defaultValue: 0.5, min: 0, max: 1, step: 0.1, formatOptions: { style: 'percent' } }),
  'number-field-no-buttons': () => h(NumberField, { ...base, increment: false, decrement: false }),
  // user utilities beat the theme (HeroUI styles live in @layer components)
  'number-field-user-overrides': () => h(NumberField, { ...base, variant: 'secondary', ui: { group: 'rounded-xl bg-default', input: 'text-center', incrementButton: 'text-muted' } }),
}
