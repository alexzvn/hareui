import type { VNode } from 'vue'
import { Button, ButtonGroup, Separator, ToggleButton, ToggleButtonGroup, Toolbar } from '@hareui/vue'
import { h } from 'vue'

const icon = () => h('svg', { 'viewBox': '0 0 16 16', 'width': '1em', 'height': '1em', 'fill': 'currentColor', 'aria-hidden': 'true' }, [h('rect', { x: 3, y: 3, width: 10, height: 10 })])
const styles = (props: Record<string, unknown> = {}) => h(ToggleButtonGroup, { selectionMode: 'multiple', separator: true, defaultValue: ['bold'], ...props }, () =>
  ['bold', 'italic', 'underline'].map(v => h(ToggleButton, { 'value': v, 'iconOnly': true, 'aria-label': v }, () => icon())))
const actions = (text = false) => h(ButtonGroup, { variant: 'tertiary', separator: true }, () =>
  ['copy', 'cut'].map(v => h(Button, text ? {} : { 'iconOnly': true, 'aria-label': v }, () => (text ? [icon(), v] : icon()))))
const toolbar = (props: Record<string, unknown>, children: () => VNode[]) => h(Toolbar, { 'aria-label': 'Text formatting', ...props }, children)

export const cases: Record<string, () => VNode> = {
  'toolbar-basic': () => toolbar({}, () => [styles(), h(Separator), actions()]),
  'toolbar-vertical': () => toolbar({ orientation: 'vertical' }, () => [styles(), h(Separator), actions()]),
  'toolbar-attached': () => toolbar({ attached: true }, () => [styles(), h(Separator), actions()]),
  'toolbar-attached-vertical': () => toolbar({ attached: true, orientation: 'vertical' }, () => [styles(), h(Separator), actions()]),
  'toolbar-with-button-group': () => toolbar({}, () => [actions(true), h(Separator), styles(), h(Separator), actions()]),
  'toolbar-custom': () => toolbar({ class: 'gap-1 rounded-xl border border-border/80 bg-surface-secondary p-1.5' }, () => [
    styles({ separator: false, class: 'gap-0.5', ui: { button: 'rounded-lg data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground' } }),
  ]),
}
