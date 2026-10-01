import type { VNode } from 'vue'
import type { SwitchProps } from 'herouse'
import { Switch } from 'herouse'
import { h } from 'vue'
import { gear } from '../icons'

const sw = (props: SwitchProps & Record<string, unknown> = {}) => h(Switch, { label: 'Enable notifications', ...props })
const profile = { label: 'Public profile', description: 'Allow others to see your profile information' }

export const cases: Record<string, () => VNode> = {
  'switch-default': () => sw(),
  'switch-size-sm': () => sw({ size: 'sm' }),
  'switch-size-lg': () => sw({ size: 'lg' }),
  'switch-checked': () => sw({ defaultValue: true }),
  'switch-checked-sm': () => sw({ defaultValue: true, size: 'sm' }),
  'switch-checked-lg': () => sw({ defaultValue: true, size: 'lg' }),
  'switch-disabled': () => sw({ disabled: true }),
  'switch-disabled-checked': () => sw({ disabled: true, defaultValue: true }),
  'switch-with-description': () => sw(profile),
  'switch-with-description-sm': () => sw({ size: 'sm', ...profile }),
  'switch-with-description-lg': () => sw({ size: 'lg', ...profile }),
  'switch-no-label': () => sw({ 'label': undefined, 'aria-label': 'Enable notifications' }),
  'switch-with-icon': () => h(Switch, { 'defaultValue': true, 'size': 'lg', 'aria-label': 'Settings' }, { icon: () => gear() }),
  'switch-control-bg-override': () => sw({ defaultValue: true, ui: { control: 'bg-green-500/80' } }),
  'switch-invalid': () => sw({ invalid: true }),
  'switch-readonly': () => sw({ readonly: true, defaultValue: true }),
}
