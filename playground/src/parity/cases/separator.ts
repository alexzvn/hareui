import type { VNode } from 'vue'
import { Separator } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

for (const variant of ['default', 'secondary', 'tertiary'] as const) {
  cases[`separator-horizontal-${variant}`] = () => h('div', { class: 'w-64' }, [
    h(Separator, { variant }),
  ])
}

cases['separator-vertical-default'] = () => h('div', { class: 'h-16' }, [
  h(Separator, { orientation: 'vertical' }),
])
