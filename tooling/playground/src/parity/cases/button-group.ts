import type { VNode } from 'vue'
import { Button, ButtonGroup, Dropdown } from '@hareui/vue'
import { h } from 'vue'

const three = (props: Record<string, unknown> = {}) => h(ButtonGroup, props, () => [
  h(Button, null, () => 'First'),
  h(Button, null, () => 'Second'),
  h(Button, null, () => 'Third'),
])

const mergeItemClass = 'flex flex-col items-start gap-1 [&>div]:items-start [&>div]:gap-1'
const chevronDown = () => h('svg', { 'aria-hidden': 'true', 'fill': 'none', 'height': '1em', 'viewBox': '0 0 16 16', 'width': '1em' }, [
  h('path', { 'd': 'M3.5 6 8 10.5 12.5 6', 'stroke': 'currentColor', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-width': '1.5' }),
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
  // docs/demos/button-group/basic.vue split button, menu open
  'button-group-dropdown': () => h('div', { style: { marginBottom: '320px' } }, [
    h(ButtonGroup, { separator: true }, () => [
      h(Button, null, () => 'Merge pull request'),
      h(Dropdown, {
        defaultOpen: true,
        class: 'max-w-[290px]',
        align: 'end',
        items: [
          { value: 'merge', label: 'Create a merge commit', description: 'All commits from this branch will be added to the base branch', class: mergeItemClass },
          { value: 'squash-and-merge', label: 'Squash and merge', description: 'The 14 commits from this branch will be combined into one commit in the base branch', class: mergeItemClass },
          { value: 'rebase-and-merge', label: 'Rebase and merge', description: 'The 14 commits from this branch will be rebased and added to the base branch', class: mergeItemClass },
        ],
      }, { default: () => h(Button, { 'iconOnly': true, 'aria-label': 'More options' }, () => chevronDown()) }),
    ]),
  ]),
}
