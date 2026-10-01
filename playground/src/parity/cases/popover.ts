import type { VNode } from 'vue'
import { Popover } from 'herouse'
import { h } from 'vue'

// Generous margin keeps the floating content away from the viewport edges so
// collision detection never flips the requested placement in either app. A plain
// <button> (not herouse's Button) keeps the comparison scoped to the popover itself.
function wrap(node: VNode) {
  return h('div', { style: { margin: '160px' } }, [node])
}

function trigger() {
  return h('button', { type: 'button' }, 'Trigger')
}

export const cases: Record<string, () => VNode> = {}

for (const side of ['top', 'right', 'bottom', 'left'] as const) {
  cases[`popover-${side}`] = () => wrap(
    h(Popover, { defaultOpen: true, side, arrow: true }, {
      default: trigger,
      content: () => h('p', { class: 'text-sm' }, `${side} placement`),
    }),
  )
}

cases['popover-no-arrow'] = () => wrap(
  h(Popover, { defaultOpen: true }, {
    default: trigger,
    content: () => h('p', { class: 'text-sm' }, 'No arrow'),
  }),
)

cases['popover-title'] = () => wrap(
  h(Popover, { defaultOpen: true, title: 'Popover Title' }, {
    default: trigger,
    content: () => h('p', { class: 'mt-2 text-sm text-muted' }, 'This is the popover content.'),
  }),
)
