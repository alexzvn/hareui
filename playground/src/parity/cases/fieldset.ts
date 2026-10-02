import type { VNode } from 'vue'
import { Button, Fieldset, Input, Link } from 'herouse'
import { h } from 'vue'

const field = () => h(Input, { 'aria-label': 'Name', 'placeholder': 'John Doe' })
const actions = () => [h(Button, null, () => 'Save'), h(Button, { variant: 'secondary' }, () => 'Cancel')]

export const cases: Record<string, () => VNode> = {
  'fieldset-full': () => h(Fieldset, { class: 'w-80', legend: 'Profile Settings', description: 'Update your profile information.' }, { default: field, actions }),
  'fieldset-legend-only': () => h(Fieldset, { class: 'w-80', legend: 'Profile Settings' }, { default: field }),
  'fieldset-disabled': () => h(Fieldset, { class: 'w-80', legend: 'Disabled', disabled: true }, { default: () => [field(), h(Link, { href: '#' }, () => 'Help')], actions }),
  'fieldset-ui-override': () => h(Fieldset, { class: 'w-80 gap-3 rounded-xl border p-4', legend: 'Custom', ui: { legend: 'text-lg font-semibold', fieldGroup: 'space-y-2', actions: 'justify-end' } }, { default: () => [field(), field()], actions }),
}
