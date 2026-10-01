import type { VNode } from 'vue'
import { Label } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {
  'label-default': () => h(Label, null, () => 'Email'),
  'label-disabled': () => h(Label, { disabled: true }, () => 'Email'),
  'label-invalid': () => h(Label, { invalid: true }, () => 'Email'),
  'label-required': () => h(Label, { required: true }, () => 'Email'),
}
