import type { Component, FunctionalComponent, HTMLAttributes } from 'vue'
import { h, isVNode } from 'vue'

type IconClass = HTMLAttributes['class']

const CHEVRON_RIGHT = 'M5.47 2.97a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1 0 1.06l-4.5 4.5a.75.75 0 1 1-1.06-1.06L9.44 8 5.47 4.03a.75.75 0 0 1 0-1.06Z'
const CHEVRON_DOWN = 'M2.97 5.47a.75.75 0 0 1 1.06 0L8 9.44l3.97-3.97a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 0-1.06'
// HeroUI's ExternalLinkIcon (viewBox 0 0 7 7).
const EXTERNAL = 'M1.20592 6.84333L0.379822 6.01723L4.52594 1.8672H1.37819L1.38601 0.731812H6.48742V5.83714H5.34421L5.35203 2.6933L1.20592 6.84333Z'
// Gravity UI's `ellipsis-vertical`, the per-item action glyph.
const ELLIPSIS_VERTICAL = 'M8 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0 5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0'

function svg(viewBox: string, d: string, evenodd = false): FunctionalComponent<{ class?: IconClass }> {
  const icon: FunctionalComponent<{ class?: IconClass }> = props => h('svg', {
    'aria-hidden': 'true',
    'fill': 'none',
    'role': 'presentation',
    'viewBox': viewBox,
    'xmlns': 'http://www.w3.org/2000/svg',
    'class': props.class,
  }, [h('path', { 'd': d, 'fill': 'currentColor', ...(evenodd ? { 'clip-rule': 'evenodd', 'fill-rule': 'evenodd' } : {}) })])
  icon.props = ['class']
  return icon
}

export const ChevronRightIcon = svg('0 0 16 16', CHEVRON_RIGHT, true)
export const ChevronDownIcon = svg('0 0 16 16', CHEVRON_DOWN, true)
export const ExternalIcon = svg('0 0 7 7', EXTERNAL)
export const EllipsisVerticalIcon = svg('0 0 16 16', ELLIPSIS_VERTICAL, true)

/**
 * Renders an item icon. A string is applied as a class on an empty `<span>` (icon-font / CSS-mask
 * utilities such as Tailwind's iconify plugin); a component or render function is rendered as-is
 * and receives the themed `class`.
 */
export const NavigationMenuIcon: FunctionalComponent<{ icon: string | Component, class?: IconClass }> = (props) => {
  const icon = props.icon
  if (typeof icon === 'string')
    return h('span', { 'aria-hidden': 'true', 'class': [icon, props.class] })
  if (isVNode(icon))
    return icon
  return h(icon as Component, { 'aria-hidden': 'true', 'class': props.class })
}
NavigationMenuIcon.props = ['icon', 'class']
