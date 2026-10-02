import type { VNode } from 'vue'
import { ToggleButton } from 'herouse'
import { h } from 'vue'

const heart = () => h('svg', { 'viewBox': '0 0 16 16', 'width': '1em', 'height': '1em', 'fill': 'currentColor', 'aria-hidden': 'true' }, [h('circle', { cx: 8, cy: 8, r: 6 })])

export const cases: Record<string, () => VNode> = {
  'toggle-button-default': () => h(ToggleButton, null, () => [heart(), 'Like']),
  'toggle-button-ghost': () => h(ToggleButton, { variant: 'ghost' }, () => [heart(), 'Like']),
  'toggle-button-selected': () => h(ToggleButton, { defaultValue: true }, () => [heart(), 'Liked']),
  'toggle-button-selected-ghost': () => h(ToggleButton, { defaultValue: true, variant: 'ghost' }, () => [heart(), 'Liked']),
  'toggle-button-sm': () => h(ToggleButton, { size: 'sm' }, () => [heart(), 'Small']),
  'toggle-button-lg': () => h(ToggleButton, { size: 'lg' }, () => [heart(), 'Large']),
  'toggle-button-icon-only': () => h(ToggleButton, { 'iconOnly': true, 'aria-label': 'Like' }, () => heart()),
  'toggle-button-icon-only-sm': () => h(ToggleButton, { 'iconOnly': true, 'size': 'sm', 'aria-label': 'Like' }, () => heart()),
  'toggle-button-disabled': () => h(ToggleButton, { disabled: true, defaultValue: true }, () => [heart(), 'Like']),
  'toggle-button-custom': () => h(ToggleButton, { defaultValue: true, class: 'h-12 rounded-lg px-6 data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground' }, () => 'Custom'),
}
