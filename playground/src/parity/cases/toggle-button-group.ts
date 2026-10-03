import type { VNode } from 'vue'
import { ToggleButton, ToggleButtonGroup } from '@hareui/vue'
import { h } from 'vue'

const icon = () => h('svg', { 'viewBox': '0 0 16 16', 'width': '1em', 'height': '1em', 'fill': 'currentColor', 'aria-hidden': 'true' }, [h('rect', { x: 3, y: 3, width: 10, height: 10 })])
const keys = ['bold', 'italic', 'underline']
const group = (props: Record<string, unknown>, button: (k: string, i: number) => Record<string, unknown> = () => ({})) =>
  h(ToggleButtonGroup, { selectionMode: 'multiple', separator: true, ...props }, () => keys.map((k, i) =>
    h(ToggleButton, { 'value': k, 'iconOnly': true, 'aria-label': k, ...button(k, i) }, () => icon())))

export const cases: Record<string, () => VNode> = {
  'toggle-button-group-basic': () => group({}),
  'toggle-button-group-selected': () => group({ defaultValue: ['bold', 'italic'] }),
  'toggle-button-group-no-separator': () => group({ separator: false }),
  'toggle-button-group-vertical': () => group({ orientation: 'vertical', defaultValue: ['italic'] }),
  'toggle-button-group-detached': () => group({ detached: true, defaultValue: ['bold'] }),
  'toggle-button-group-full-width': () => h('div', { class: 'w-96' }, [group({ fullWidth: true })]),
  'toggle-button-group-sm': () => group({ size: 'sm', defaultValue: ['underline'] }),
  'toggle-button-group-disabled': () => group({ disabled: true, defaultValue: ['bold'] }, (_, i) => (i === 2 ? { disabled: false } : {})),
  'toggle-button-group-single-text': () => h(ToggleButtonGroup, { selectionMode: 'single', separator: true, defaultValue: ['center'] }, () =>
    ['left', 'center', 'right'].map(k => h(ToggleButton, { value: k }, () => k))),
}
