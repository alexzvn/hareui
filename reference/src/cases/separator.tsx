import type { ReactElement } from 'react'
import { Separator } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

for (const variant of ['default', 'secondary', 'tertiary'] as const) {
  cases[`separator-horizontal-${variant}`] = () => (
    <div className="w-64">
      <Separator variant={variant} />
    </div>
  )
}

cases['separator-vertical-default'] = () => (
  <div className="h-16">
    <Separator orientation="vertical" />
  </div>
)
