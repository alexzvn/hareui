import type { VNode } from 'vue'
import { Spinner } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

for (const color of ['accent', 'current', 'danger', 'success', 'warning'] as const)
  cases[`spinner-${color}`] = () => h(Spinner, { color })
for (const size of ['sm', 'lg', 'xl'] as const)
  cases[`spinner-size-${size}`] = () => h(Spinner, { size })
