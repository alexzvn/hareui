import type { VNode } from 'vue'
import { ProgressBar } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

cases['progress-bar-basic'] = () => h(ProgressBar, { 'aria-label': 'Loading', 'class': 'w-64', 'label': 'Loading', 'value': 60 })
for (const color of ['default', 'accent', 'success', 'warning', 'danger'] as const)
  cases[`progress-bar-color-${color}`] = () => h(ProgressBar, { class: 'w-64', color, label: color, value: 50 })
for (const size of ['sm', 'md', 'lg'] as const)
  cases[`progress-bar-size-${size}`] = () => h(ProgressBar, { class: 'w-64', size, label: size, value: 40 })
cases['progress-bar-without-label'] = () => h(ProgressBar, { 'aria-label': 'Loading progress', 'class': 'w-64', 'value': 45 })
cases['progress-bar-indeterminate'] = () => h(ProgressBar, { 'aria-label': 'Loading', 'class': 'w-64', 'indeterminate': true, 'label': 'Loading...' })
cases['progress-bar-custom-value'] = () => h(ProgressBar, {
  class: 'w-52',
  formatOptions: { currency: 'USD', style: 'currency' },
  label: 'Progress',
  maxValue: 1000,
  minValue: 200,
  value: 750,
})
cases['progress-bar-clamped'] = () => h(ProgressBar, { class: 'w-64', label: 'Over', value: 150 })
cases['progress-bar-value-label'] = () => h(ProgressBar, { class: 'w-64', label: 'Steps', value: 3, maxValue: 4, valueLabel: '3 of 4' })
cases['progress-bar-custom-styles'] = () => h(ProgressBar, {
  'aria-label': 'Upload progress',
  'class': 'w-64',
  'label': 'Uploading resume.pdf',
  'value': 45,
  'ui': {
    label: 'font-medium text-foreground',
    output: 'text-xs text-muted tabular-nums',
    track: 'rounded-full bg-default',
    fill: 'rounded-full bg-accent',
  },
})
