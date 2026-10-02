import type { VNode } from 'vue'
import { AlertDialog, Button } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

const title = 'Delete project permanently?'

function body() {
  return h('p', 'This will permanently delete the project and all of its data. This action cannot be undone.')
}

function footer() {
  return [
    h(Button, { variant: 'tertiary' }, () => 'Cancel'),
    h(Button, { variant: 'danger' }, () => 'Delete Project'),
  ]
}

for (const status of ['default', 'accent', 'success', 'warning', 'danger'] as const) {
  cases[`alert-dialog-status-${status}`] = () => h(AlertDialog, { defaultOpen: true, status, title }, { body, footer })
}

for (const size of ['xs', 'sm', 'md', 'lg', 'cover'] as const) {
  cases[`alert-dialog-size-${size}`] = () => h(AlertDialog, { defaultOpen: true, size, title }, { body, footer })
}

for (const variant of ['opaque', 'blur', 'transparent'] as const) {
  cases[`alert-dialog-variant-${variant}`] = () => h(AlertDialog, { defaultOpen: true, variant, title }, { body, footer })
}

for (const placement of ['auto', 'top', 'center', 'bottom'] as const) {
  cases[`alert-dialog-placement-${placement}`] = () => h(AlertDialog, { defaultOpen: true, placement, title }, { body, footer })
}

cases['alert-dialog-no-close'] = () => h(AlertDialog, { defaultOpen: true, closeButton: false, status: 'accent', title }, { body, footer })
