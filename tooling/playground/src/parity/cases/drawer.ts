import type { VNode } from 'vue'
import { Button, Drawer } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

function body() {
  return h('p', 'This drawer slides in from the edge of the screen.')
}

function footer() {
  return [
    h(Button, { variant: 'secondary' }, () => 'Cancel'),
    h(Button, () => 'Done'),
  ]
}

for (const placement of ['bottom', 'top', 'left', 'right'] as const) {
  const handle = placement === 'bottom' || placement === 'top'
  cases[`drawer-placement-${placement}`] = () => h(Drawer, { defaultOpen: true, placement, handle, title: 'Drawer Title' }, { body, footer })
}

for (const variant of ['opaque', 'blur', 'transparent'] as const) {
  cases[`drawer-variant-${variant}`] = () => h(Drawer, { defaultOpen: true, variant, handle: true, title: 'Drawer Title' }, { body, footer })
}

cases['drawer-no-close'] = () => h(Drawer, { defaultOpen: true, closeButton: false, placement: 'right', title: 'Drawer Title' }, { body, footer })

cases['drawer-scrollable'] = () => h(Drawer, { defaultOpen: true, handle: true, title: 'Terms & Conditions' }, {
  body: () => Array.from({ length: 20 }, (_, i) => h('p', { class: 'mb-3' }, `Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis.`)),
  footer,
})
