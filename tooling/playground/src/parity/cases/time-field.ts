import type { VNode } from 'vue'
import { Time } from '@internationalized/date'
import { TimeField } from '@hareui/vue'
import { h } from 'vue'

const base = { label: 'Time', description: 'Enter a time', defaultValue: new Time(9, 30) }

// Inline SVG (no icon package dependency): mirrored verbatim in reference/src/cases/time-field.tsx
function icon() {
  return h('svg', { viewBox: '0 0 16 16', class: 'size-4 text-muted', fill: 'none', stroke: 'currentColor', 'stroke-width': 1.5 }, [
    h('circle', { cx: 8, cy: 8, r: 6.25 }),
    h('path', { d: 'M8 4.75V8l2.5 1.5', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
  ])
}

export const cases: Record<string, () => VNode> = {
  'time-field-default': () => h(TimeField, base),
  'time-field-focus': () => h(TimeField, base),
  'time-field-secondary': () => h(TimeField, { ...base, variant: 'secondary' }),
  'time-field-secondary-focus': () => h(TimeField, { ...base, variant: 'secondary' }),
  'time-field-required': () => h(TimeField, { ...base, required: true }),
  'time-field-disabled': () => h(TimeField, { ...base, disabled: true }),
  'time-field-readonly': () => h(TimeField, { ...base, readonly: true }),
  'time-field-invalid': () => h(TimeField, { ...base, invalid: true, errorMessage: 'Time must be within business hours' }),
  'time-field-full-width': () => h(TimeField, { ...base, fullWidth: true }),
  'time-field-granularity-second': () => h(TimeField, { ...base, defaultValue: new Time(9, 30, 15), granularity: 'second' }),
  'time-field-12-hour': () => h(TimeField, { ...base, hourCycle: 12 }),
  'time-field-with-prefix-icon': () => h(TimeField, base, { prefix: icon }),
  'time-field-with-suffix-icon': () => h(TimeField, base, { suffix: icon }),
  'time-field-with-prefix-and-suffix': () => h(TimeField, base, { prefix: icon, suffix: icon }),
  // user utilities beat the theme (HeroUI styles live in @layer components)
  'time-field-user-overrides': () => h(TimeField, { ...base, variant: 'secondary', ui: { group: 'rounded-xl bg-default', segment: 'text-foreground' } }),
}
