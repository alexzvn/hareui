import type { VNode } from 'vue'
import { ColorSwatchPicker } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

const colors = ['#F43F5E', '#D946EF', '#8B5CF6', '#3B82F6', '#06B6D4', '#10B981', '#84CC16']
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const

cases['color-swatch-picker-basic'] = () => h(ColorSwatchPicker, { items: colors })

cases['color-swatch-picker-default-value'] = () => h(ColorSwatchPicker, { items: colors, defaultValue: '#8B5CF6' })

cases['color-swatch-picker-sizes'] = () => h('div', { class: 'flex flex-col gap-6' }, sizes.map(size =>
  h('div', { key: size, class: 'flex items-center gap-4' }, [
    h('span', { class: 'w-8 text-sm text-muted' }, size),
    h(ColorSwatchPicker, { items: colors, size, defaultValue: '#8B5CF6' }),
  ]),
))

cases['color-swatch-picker-variants'] = () => h('div', { class: 'flex flex-col gap-6' }, [
  h(ColorSwatchPicker, { items: colors, variant: 'circle', defaultValue: '#3B82F6' }),
  h(ColorSwatchPicker, { items: colors, variant: 'square', defaultValue: '#3B82F6' }),
])

cases['color-swatch-picker-square-sizes'] = () => h('div', { class: 'flex flex-col gap-6' }, sizes.map(size =>
  h(ColorSwatchPicker, { key: size, items: colors, size, variant: 'square', defaultValue: '#8B5CF6' }),
))

cases['color-swatch-picker-disabled'] = () => h(ColorSwatchPicker, { items: colors, disabled: true, defaultValue: '#8B5CF6' })

cases['color-swatch-picker-stack'] = () => h(ColorSwatchPicker, { items: colors, layout: 'stack', defaultValue: '#8B5CF6' })

cases['color-swatch-picker-custom-indicator'] = () => h(ColorSwatchPicker, { items: colors, defaultValue: '#8B5CF6' }, {
  indicator: () => h('svg', { 'viewBox': '0 0 16 16', 'fill': 'currentColor', 'aria-hidden': 'true' }, [h('circle', { cx: 8, cy: 8, r: 6 })]),
})

cases['color-swatch-picker-hover'] = () => h(ColorSwatchPicker, { items: colors, defaultValue: '#8B5CF6' })

cases['color-swatch-picker-focus'] = () => h(ColorSwatchPicker, { items: colors, defaultValue: '#8B5CF6' })
