import type { VNode } from 'vue'
import { Accordion } from '@hareui/vue'
import { h } from 'vue'
import { gear } from '../icons'

export const cases: Record<string, () => VNode> = {}

const items = [
  { value: 'a', label: 'How do I place an order?', content: 'Browse our products and proceed to checkout.' },
  { value: 'b', label: 'Can I cancel my order?', content: 'Yes, before it ships.' },
  { value: 'c', label: 'Do you ship abroad?', content: 'We ship to most countries.' },
]

cases['accordion-default'] = () => h(Accordion, { items, class: 'w-[360px]' })

cases['accordion-expanded'] = () => h(Accordion, { items, defaultValue: ['a'], class: 'w-[360px]' })

cases['accordion-surface'] = () => h(Accordion, { items, variant: 'surface', defaultValue: ['b'], class: 'w-[360px]' })

cases['accordion-surface-last-expanded'] = () => h(Accordion, { items, variant: 'surface', defaultValue: ['c'], class: 'w-[360px]' })

cases['accordion-hide-separator'] = () => h(Accordion, { items, hideSeparator: true, class: 'w-[360px]' })

cases['accordion-disabled'] = () => h(Accordion, { items: [items[0], { ...items[1], disabled: true }, items[2]], class: 'w-[360px]' })

cases['accordion-multiple'] = () => h(Accordion, { items, multiple: true, defaultValue: ['a', 'c'], class: 'w-[360px]' })

cases['accordion-custom-indicator'] = () => h(Accordion, { items, defaultValue: ['a'], class: 'w-[360px]' }, {
  leading: () => h('span', { class: 'me-3 size-4 shrink-0 text-muted' }, gear()),
  indicator: () => h('svg', { viewBox: '0 0 16 16', width: '16', height: '16', fill: 'currentColor' }, [h('path', { d: 'M8 2v12M2 8h12', stroke: 'currentColor', 'stroke-width': '1.5' })]),
})
