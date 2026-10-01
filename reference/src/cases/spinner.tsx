import type { ReactElement } from 'react'
import { Spinner } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

for (const color of ['accent', 'current', 'danger', 'success', 'warning'] as const)
  cases[`spinner-${color}`] = () => <Spinner color={color} />
for (const size of ['sm', 'lg', 'xl'] as const)
  cases[`spinner-size-${size}`] = () => <Spinner size={size} />
