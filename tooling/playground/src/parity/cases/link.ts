import type { VNode } from 'vue'
import { Link } from '@hareui/vue'
import { h } from 'vue'

const svg = () => h('svg', { viewBox: '0 0 16 16', width: '1em', height: '1em' }, [h('path', { d: 'M2 2h12v12H2z', fill: 'currentColor' })])

export const cases: Record<string, () => VNode> = {
  'link-basic': () => h(Link, { href: '#', icon: true }, () => 'Call to action'),
  'link-no-icon': () => h(Link, { href: '#' }, () => 'Call to action'),
  'link-icon-start': () => h(Link, { href: '#', icon: true, iconPlacement: 'start', class: 'gap-1' }, () => 'Icon at start'),
  'link-underline': () => h(Link, { href: '#', icon: true, class: 'underline underline-offset-2' }, () => 'Underline always visible'),
  'link-custom-icon': () => h(Link, { href: '#', ui: { icon: 'ms-1.5 size-3' } }, { default: () => 'External link', icon: svg }),
  'link-disabled': () => h(Link, { href: '#', icon: true, disabled: true }, () => 'Disabled link'),
  'link-custom-styles': () => h(Link, { href: '#', icon: true, class: 'font-medium text-neutral-700 underline decoration-neutral-300/80 underline-offset-4 transition-colors hover:text-neutral-900' }, () => 'Call to action'),
}
