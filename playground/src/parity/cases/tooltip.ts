import type { VNode } from 'vue'
import { Button, Tooltip } from 'herouse'
import { h } from 'vue'

// Generous margin keeps the floating content away from the viewport edges so
// collision detection never flips the requested placement in either app.
function wrap(node: VNode) {
  return h('div', { style: { margin: '160px' } }, [node])
}

function trigger() {
  return h(Button, { variant: 'tertiary' }, { default: () => 'Trigger' })
}

export const cases: Record<string, () => VNode> = {}

for (const side of ['top', 'right', 'bottom', 'left'] as const) {
  cases[`tooltip-${side}`] = () => wrap(
    h(Tooltip, { defaultOpen: true, delay: 0, side, arrow: true }, {
      default: trigger,
      content: () => h('p', null, `${side} placement`),
    }),
  )
}

cases['tooltip-no-arrow'] = () => wrap(
  h(Tooltip, { defaultOpen: true, delay: 0 }, {
    default: trigger,
    content: () => h('p', null, 'No arrow'),
  }),
)

cases['tooltip-text'] = () => wrap(
  h(Tooltip, { defaultOpen: true, delay: 0, text: 'This is a tooltip' }, {
    default: trigger,
  }),
)
