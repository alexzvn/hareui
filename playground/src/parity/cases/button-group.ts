import type { VNode } from 'vue'
import { Button, ButtonGroup } from 'herouse'
import { h } from 'vue'

const three = (props: Record<string, unknown> = {}) => h(ButtonGroup, props, () => [
  h(Button, null, () => 'First'),
  h(Button, null, () => 'Second'),
  h(Button, null, () => 'Third'),
])

export const cases: Record<string, () => VNode> = {
  'button-group-basic': () => three(),
  'button-group-separator': () => three({ separator: true, variant: 'tertiary' }),
  'button-group-outline': () => three({ separator: true, variant: 'outline' }),
  'button-group-vertical': () => three({ separator: true, orientation: 'vertical', variant: 'secondary' }),
  'button-group-single': () => h(ButtonGroup, { variant: 'outline' }, () => [h(Button, null, () => 'Only')]),
  'button-group-sm-secondary': () => three({ separator: true, size: 'sm', variant: 'secondary' }),
  'button-group-full-width': () => h('div', { class: 'w-[400px]' }, [three({ separator: true, fullWidth: true })]),
  'button-group-disabled': () => h(ButtonGroup, { disabled: true, separator: true }, () => [
    h(Button, null, () => 'First'),
    h(Button, { disabled: false }, () => 'Enabled'),
  ]),
  'button-group-rounded-override': () => h(ButtonGroup, { separator: true }, () => [
    h(Button, { class: 'rounded-none' }, () => 'Square'),
    h(Button, { class: 'rounded-none' }, () => 'Edges'),
  ]),
}
