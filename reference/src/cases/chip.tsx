import type { ReactElement } from 'react'
import { Chip } from '@heroui/react'
import { gear } from '../icons'

export const cases: Record<string, () => ReactElement> = {}

for (const variant of ['primary', 'secondary', 'soft', 'tertiary'] as const) {
  for (const color of ['accent', 'danger', 'default', 'success', 'warning'] as const)
    cases[`chip-${variant}-${color}`] = () => <Chip variant={variant} color={color}>Label</Chip>
}
for (const size of ['sm', 'lg'] as const)
  cases[`chip-size-${size}`] = () => <Chip size={size}>Label</Chip>
cases['chip-with-icon'] = () => <Chip color="success">{gear()}<Chip.Label>Completed</Chip.Label></Chip>
