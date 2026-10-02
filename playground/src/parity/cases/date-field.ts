import type { VNode } from 'vue'
import { CalendarDate, CalendarDateTime } from '@internationalized/date'
import { DateField } from 'herouse'
import { h } from 'vue'

const base = { label: 'Date', description: 'Enter a date', defaultValue: new CalendarDate(2024, 3, 15) }

// Inline SVG (no icon package dependency): mirrored verbatim in reference/src/cases/date-field.tsx
function icon() {
  return h('svg', { viewBox: '0 0 16 16', class: 'size-4 text-muted', fill: 'currentColor' }, [
    h('path', { d: 'M4.75 1.5a.75.75 0 0 1 .75.75V3h5V2.25a.75.75 0 0 1 1.5 0V3h.25A2.5 2.5 0 0 1 14.75 5.5v6A2.5 2.5 0 0 1 12.25 14h-8.5A2.5 2.5 0 0 1 1.25 11.5v-6A2.5 2.5 0 0 1 3.75 3H4V2.25a.75.75 0 0 1 .75-.75ZM2.75 6.5v5c0 .69.56 1.25 1.25 1.25h8.5c.69 0 1.25-.56 1.25-1.25v-5h-11Z' }),
  ])
}

export const cases: Record<string, () => VNode> = {
  'date-field-default': () => h(DateField, base),
  'date-field-focus': () => h(DateField, base),
  'date-field-secondary': () => h(DateField, { ...base, variant: 'secondary' }),
  'date-field-secondary-focus': () => h(DateField, { ...base, variant: 'secondary' }),
  'date-field-required': () => h(DateField, { ...base, required: true }),
  'date-field-disabled': () => h(DateField, { ...base, disabled: true }),
  'date-field-readonly': () => h(DateField, { ...base, readonly: true }),
  'date-field-invalid': () => h(DateField, { ...base, invalid: true, errorMessage: 'Date must be in the future' }),
  'date-field-full-width': () => h(DateField, { ...base, fullWidth: true }),
  'date-field-granularity-second': () => h(DateField, { ...base, defaultValue: new CalendarDateTime(2024, 3, 15, 10, 30, 15), granularity: 'second' }),
  'date-field-with-prefix-icon': () => h(DateField, base, { prefix: icon }),
  'date-field-with-suffix-icon': () => h(DateField, base, { suffix: icon }),
  'date-field-with-prefix-and-suffix': () => h(DateField, base, { prefix: icon, suffix: icon }),
  // user utilities beat the theme (HeroUI styles live in @layer components)
  'date-field-user-overrides': () => h(DateField, { ...base, variant: 'secondary', ui: { group: 'rounded-xl bg-default', segment: 'text-foreground' } }),
}
