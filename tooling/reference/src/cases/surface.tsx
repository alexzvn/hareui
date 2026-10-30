import type { ReactElement } from 'react'
import { Surface } from '@heroui/react'

export const cases: Record<string, () => ReactElement> = {}

for (const variant of ['transparent', 'default', 'secondary', 'tertiary'] as const) {
  cases[`surface-${variant}`] = () => (
    <Surface className="flex w-64 flex-col gap-2 rounded-3xl p-6" variant={variant}>
      <h3 className="text-base font-semibold">Surface Content</h3>
      <p className="text-sm">This is a surface variant.</p>
    </Surface>
  )
}
