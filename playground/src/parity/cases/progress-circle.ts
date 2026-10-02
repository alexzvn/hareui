import type { VNode } from 'vue'
import { ProgressCircle } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

cases['progress-circle-basic'] = () => h(ProgressCircle, { 'aria-label': 'Loading', 'value': 60 })
for (const color of ['default', 'accent', 'success', 'warning', 'danger'] as const)
  cases[`progress-circle-color-${color}`] = () => h(ProgressCircle, { 'aria-label': color, color, 'value': 60 })
for (const size of ['sm', 'md', 'lg'] as const)
  cases[`progress-circle-size-${size}`] = () => h(ProgressCircle, { 'aria-label': 'Loading', size, 'value': 40 })
cases['progress-circle-indeterminate'] = () => h(ProgressCircle, { 'aria-label': 'Loading', 'indeterminate': true })
cases['progress-circle-zero'] = () => h(ProgressCircle, { 'aria-label': 'Loading', 'value': 0 })
cases['progress-circle-full'] = () => h(ProgressCircle, { 'aria-label': 'Loading', 'value': 100 })
cases['progress-circle-custom-range'] = () => h(ProgressCircle, { 'aria-label': 'Loading', 'minValue': 50, 'maxValue': 150, 'value': 75 })
cases['progress-circle-thin'] = () => h(ProgressCircle, { 'aria-label': 'Thin circle', 'strokeWidth': 2, 'value': 60 })
cases['progress-circle-thick'] = () => h(ProgressCircle, { 'aria-label': 'Thick circle', 'strokeWidth': 6, 'value': 60 })
cases['progress-circle-custom-styles'] = () => h(ProgressCircle, {
  'aria-label': 'Sync progress',
  'class': 'size-14 text-neutral-700 dark:text-neutral-300',
  'value': 68,
  'ui': {
    trackCircle: 'stroke-neutral-200 dark:stroke-neutral-800',
    fillCircle: 'stroke-neutral-700 dark:stroke-neutral-300',
  },
})
