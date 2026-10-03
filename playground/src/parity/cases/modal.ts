import type { VNode } from 'vue'
import { Button, Modal } from '@hareui/vue'
import { h } from 'vue'
import { gear } from '../icons'

export const cases: Record<string, () => VNode> = {}

function footer() {
  return [
    h(Button, { variant: 'ghost' }, () => 'Cancel'),
    h(Button, null, () => 'Confirm'),
  ]
}

function body() {
  return h('p', 'This is the modal body content.')
}

function longBody() {
  return Array.from({ length: 12 }, (_, i) =>
    h('p', `Paragraph ${i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`))
}

for (const size of ['xs', 'sm', 'md', 'lg', 'cover', 'full'] as const) {
  cases[`modal-size-${size}`] = () => h(Modal, { defaultOpen: true, size, title: 'Modal Title' }, { body, footer })
}

for (const variant of ['opaque', 'blur', 'transparent'] as const) {
  cases[`modal-variant-${variant}`] = () => h(Modal, { defaultOpen: true, variant, title: 'Modal Title' }, { body, footer })
}

for (const placement of ['auto', 'top', 'center', 'bottom'] as const) {
  cases[`modal-placement-${placement}`] = () => h(Modal, { defaultOpen: true, placement, title: 'Modal Title' }, { body, footer })
}

for (const scroll of ['inside', 'outside'] as const) {
  cases[`modal-scroll-${scroll}`] = () => h(Modal, { defaultOpen: true, scroll, title: 'Modal Title' }, { body: longBody, footer })
}

cases['modal-full'] = () => h(Modal, { defaultOpen: true, title: 'Delete item' }, {
  icon: () => gear(),
  body: () => h('p', 'This action cannot be undone. This will permanently delete the item.'),
  footer,
})
