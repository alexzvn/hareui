import type { VNode } from 'vue'
import { Meter } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

cases['meter-basic'] = () => h(Meter, { 'aria-label': 'Storage', 'class': 'w-64', 'label': 'Storage', 'value': 60 })
for (const color of ['default', 'accent', 'success', 'warning', 'danger'] as const)
  cases[`meter-color-${color}`] = () => h(Meter, { class: 'w-64', color, label: color, value: 50 })
for (const size of ['sm', 'md', 'lg'] as const)
  cases[`meter-size-${size}`] = () => h(Meter, { class: 'w-64', size, label: size, value: 40 })
cases['meter-without-label'] = () => h(Meter, { 'aria-label': 'Storage usage', 'class': 'w-64', 'value': 45 })
cases['meter-custom-value'] = () => h(Meter, {
  class: 'w-64',
  formatOptions: { currency: 'USD', style: 'currency' },
  label: 'Revenue',
  maxValue: 1000,
  minValue: 0,
  value: 750,
})
cases['meter-clamped'] = () => h(Meter, { class: 'w-64', label: 'Over', value: 150 })
cases['meter-value-label'] = () => h(Meter, { class: 'w-64', label: 'Steps', value: 3, maxValue: 4, valueLabel: '3 of 4' })
cases['meter-custom-styles'] = () => h(Meter, {
  'aria-label': 'Storage used',
  'class': 'w-64',
  'label': 'Storage used',
  'value': 68,
  'ui': {
    label: 'font-medium text-foreground',
    output: 'text-muted tabular-nums',
    track: 'rounded-full bg-default',
    fill: 'rounded-full bg-warning',
  },
})
