import type { VNode } from 'vue'
import { Button, Sheet } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

function body() {
  return h('p', { class: 'text-sm text-muted' }, 'This sheet slides in from the edge of the screen.')
}

function footer() {
  return [
    h(Button, { variant: 'secondary' }, () => 'Cancel'),
    h(Button, () => 'Done'),
  ]
}

for (const placement of ['bottom', 'top', 'left', 'right'] as const) {
  cases[`sheet-placement-${placement}`] = () => h(Sheet, { defaultOpen: true, placement, closeButton: true, title: 'Sheet Title' }, { body, footer })
}

for (const variant of ['opaque', 'blur', 'transparent'] as const) {
  cases[`sheet-variant-${variant}`] = () => h(Sheet, { defaultOpen: true, variant, closeButton: true, title: 'Sheet Title' }, { body, footer })
}

for (const placement of ['bottom', 'right'] as const) {
  cases[`sheet-detached-${placement}`] = () => h(Sheet, { defaultOpen: true, detached: true, placement, title: 'Sheet Title' }, { body })
}

cases['sheet-snap-points'] = () => h(Sheet, { defaultOpen: true, snapPoints: ['148px', '355px'], title: 'Snap Points' }, { body })

cases['sheet-scrollable'] = () => h(Sheet, { defaultOpen: true, closeButton: true, class: 'mx-auto max-h-[95vh] max-w-[420px]', title: 'Terms & Conditions' }, {
  body: () => Array.from({ length: 20 }, (_, i) => h('p', { class: 'mb-3 text-sm text-muted' }, `Paragraph ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non risus hendrerit venenatis.`)),
  footer,
})
