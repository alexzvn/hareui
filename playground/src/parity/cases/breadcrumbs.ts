import type { VNode } from 'vue'
import { Breadcrumbs } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

const items = [{ label: 'Home', href: '#' }, { label: 'Products', href: '#' }, { label: 'Laptop' }]

cases['breadcrumbs-default'] = () => h(Breadcrumbs, { items })
cases['breadcrumbs-two-levels'] = () => h(Breadcrumbs, { items: [{ label: 'Home', href: '#' }, { label: 'Current Page' }] })
cases['breadcrumbs-disabled'] = () => h(Breadcrumbs, { items, disabled: true })
cases['breadcrumbs-custom-separator'] = () => h(Breadcrumbs, { items }, {
  separator: () => h('svg', { viewBox: '0 0 16 16', fill: 'currentColor' }, [h('circle', { cx: '8', cy: '8', r: '3' })]),
})
