import type { VNode } from 'vue'
import { Chip } from 'herouse'
import { h } from 'vue'
import { gear } from '../icons'

export const cases: Record<string, () => VNode> = {}

for (const variant of ['primary', 'secondary', 'soft', 'tertiary'] as const) {
  for (const color of ['accent', 'danger', 'default', 'success', 'warning'] as const)
    cases[`chip-${variant}-${color}`] = () => h(Chip, { variant, color, label: 'Label' })
}
for (const size of ['sm', 'lg'] as const)
  cases[`chip-size-${size}`] = () => h(Chip, { size, label: 'Label' })
cases['chip-with-icon'] = () => h(Chip, { color: 'success', label: 'Completed' }, { leading: () => gear() })
