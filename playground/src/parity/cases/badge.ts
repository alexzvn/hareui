import type { VNode } from 'vue'
import { Badge } from 'herouse'
import { h } from 'vue'

const box = () => h('div', { class: 'size-10 rounded-full bg-default' })
const icon = () => h('svg', { class: 'size-2.5', viewBox: '0 0 16 16' }, [h('path', { d: 'M2 2h12v12H2z', fill: 'currentColor' })])

export const cases: Record<string, () => VNode> = {
  'badge-basic': () => h(Badge, { color: 'danger', size: 'sm', content: '5' }, box),
  'badge-dot': () => h(Badge, { color: 'success', size: 'sm' }, box),
  'badge-sm': () => h(Badge, { size: 'sm', content: 'New' }, box),
  'badge-lg': () => h(Badge, { size: 'lg', color: 'danger', content: '99+' }, box),
  'badge-secondary-warning': () => h(Badge, { variant: 'secondary', color: 'warning', content: '5' }, box),
  'badge-soft-accent': () => h(Badge, { variant: 'soft', color: 'accent', content: '5' }, box),
  'badge-primary-success': () => h(Badge, { color: 'success', content: '5' }, box),
  'badge-top-left': () => h(Badge, { placement: 'top-left', color: 'accent', size: 'sm' }, box),
  'badge-bottom-right': () => h(Badge, { placement: 'bottom-right', color: 'accent', size: 'sm' }, box),
  'badge-bottom-left': () => h(Badge, { placement: 'bottom-left', color: 'accent', size: 'sm' }, box),
  'badge-icon': () => h(Badge, { color: 'accent', size: 'sm' }, { default: box, content: icon }),
  'badge-custom': () => h(Badge, { class: 'min-w-5 font-semibold tabular-nums', color: 'accent', size: 'sm', variant: 'soft', content: '5' }, box),
  'badge-standalone': () => h('div', { class: 'relative size-10' }, [h(Badge, { color: 'danger', content: '3' })]),
}
