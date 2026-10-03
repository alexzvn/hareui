import type { VNode } from 'vue'
import { Skeleton } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

for (const animationType of ['shimmer', 'pulse', 'none'] as const)
  cases[`skeleton-${animationType}`] = () => h(Skeleton, { animationType, class: 'h-10 w-40' })
cases['skeleton-default'] = () => h(Skeleton, { class: 'h-10 w-40' })
cases['skeleton-custom'] = () => h('div', { class: 'w-[250px] space-y-5 p-4' }, [
  h(Skeleton, { class: 'h-32 rounded-lg' }),
  h('div', { class: 'space-y-3' }, [
    h(Skeleton, { class: 'h-3 w-3/5 rounded-lg' }),
    h(Skeleton, { class: 'h-3 w-4/5 rounded-full bg-neutral-200/90' }),
  ]),
])
cases['skeleton-children'] = () => h(Skeleton, { class: 'w-40 p-2' }, () => h('span', { class: 'invisible' }, 'Loading text'))
