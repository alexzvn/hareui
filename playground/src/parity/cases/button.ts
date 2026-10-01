import type { VNode } from 'vue'
import { Button } from 'herouse'
import { h } from 'vue'
import { gear } from '../icons'

export const cases: Record<string, () => VNode> = {}

for (const variant of ['primary', 'secondary', 'tertiary', 'ghost', 'outline', 'danger', 'danger-soft'] as const)
  cases[`button-${variant}`] = () => h(Button, { variant }, () => 'Button')
for (const size of ['sm', 'lg'] as const)
  cases[`button-size-${size}`] = () => h(Button, { size }, () => 'Button')
cases['button-full-width'] = () => h('div', { class: 'w-80' }, [h(Button, { fullWidth: true }, () => 'Button')])
for (const size of ['sm', 'md', 'lg'] as const)
  cases[`button-icon-only-${size}`] = () => h(Button, { 'iconOnly': true, size, 'variant': 'secondary', 'aria-label': 'Settings' }, () => gear())
cases['button-with-icon'] = () => h(Button, null, { leading: () => gear(), default: () => 'Settings' })
cases['button-disabled'] = () => h(Button, { disabled: true }, () => 'Button')
cases['button-pending'] = () => h(Button, { pending: true }, () => 'Uploading...')
