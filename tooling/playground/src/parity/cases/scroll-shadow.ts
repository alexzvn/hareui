import type { VNode } from 'vue'
import { ScrollShadow } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

const lines = () => h('div', { class: 'space-y-4' }, Array.from({ length: 8 }, (_, i) => h('p', `Line ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit.`)))
const boxes = () => h('div', { class: 'flex flex-row gap-4' }, Array.from({ length: 8 }, (_, i) => h('div', { class: 'h-16 min-w-[120px] rounded-xl bg-default' }, `Box ${i + 1}`)))

cases['scroll-shadow-vertical'] = () => h(ScrollShadow, { class: 'max-h-[200px] w-[300px] p-4' }, lines)
cases['scroll-shadow-horizontal'] = () => h(ScrollShadow, { orientation: 'horizontal', class: 'w-[300px] p-4' }, boxes)
cases['scroll-shadow-size'] = () => h(ScrollShadow, { size: 80, class: 'max-h-[200px] w-[300px] p-4' }, lines)
cases['scroll-shadow-hide-scrollbar'] = () => h(ScrollShadow, { hideScrollBar: true, class: 'max-h-[200px] w-[300px] p-4' }, lines)
cases['scroll-shadow-visibility-both'] = () => h(ScrollShadow, { visibility: 'both', class: 'max-h-[200px] w-[300px] p-4' }, lines)
cases['scroll-shadow-visibility-none'] = () => h(ScrollShadow, { visibility: 'none', class: 'max-h-[200px] w-[300px] p-4' }, lines)
