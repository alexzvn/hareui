import type { VNode } from 'vue'
import { Surface } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

for (const variant of ['transparent', 'default', 'secondary', 'tertiary'] as const) {
  cases[`surface-${variant}`] = () => h(Surface, { variant, class: 'flex w-64 flex-col gap-2 rounded-3xl p-6' }, {
    default: () => [
      h('h3', { class: 'text-base font-semibold' }, 'Surface Content'),
      h('p', { class: 'text-sm' }, 'This is a surface variant.'),
    ],
  })
}
