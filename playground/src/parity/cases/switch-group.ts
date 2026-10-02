import type { VNode } from 'vue'
import { Switch, SwitchGroup } from 'herouse'
import { h } from 'vue'

function group(props: Record<string, unknown> = {}) {
  return h(SwitchGroup, props, () => [
    h(Switch, { name: 'notifications', label: 'Allow Notifications' }),
    h(Switch, { name: 'marketing', label: 'Marketing emails' }),
    h(Switch, { name: 'social', label: 'Social media updates' }),
  ])
}

export const cases: Record<string, () => VNode> = {
  'switch-group-vertical': () => group(),
  'switch-group-horizontal': () => group({ orientation: 'horizontal' }),
}
