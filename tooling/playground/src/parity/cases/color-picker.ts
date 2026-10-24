import type { VNode } from 'vue'
import { Button, ColorArea, ColorField, ColorPicker, ColorSlider, ColorSwatch, ColorSwatchPicker, Label, Select } from '@hareui/vue'
import { h } from 'vue'
import { gear } from '../icons'

export const cases: Record<string, () => VNode> = {}

const presets = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f43f5e']
const spaces = ['hsb', 'hsl', 'rgb'].map(value => ({ value, label: value, class: 'uppercase' }))

const trigger = (label = 'Pick a color') => () => [h(ColorSwatch, { size: 'lg' }), h(Label, null, () => label)]
const area = () => h(ColorArea, { 'aria-label': 'Color area', 'class': 'max-w-full', 'colorSpace': 'hsb', 'xChannel': 'saturation', 'yChannel': 'brightness' })
const hue = (extra: Record<string, unknown> = {}) => h(ColorSlider, { channel: 'hue', class: 'gap-1 px-1', colorSpace: 'hsb', label: 'Hue', ui: { output: 'text-muted' }, ...extra } as any)
const swatches = (cls: string) => h(ColorSwatchPicker, { items: presets, class: cls, size: 'xs' })

const basic = (props: Record<string, unknown> = {}, popover: () => VNode[] = () => [area(), hue()]) => () =>
  h(ColorPicker, { defaultValue: 'hsb(240, 60%, 100%)', ...props }, { trigger: trigger(), default: popover })

cases['color-picker-default'] = basic()
cases['color-picker-hover'] = basic()
cases['color-picker-focus'] = basic()
cases['color-picker-disabled'] = basic({ disabled: true })
cases['color-picker-open'] = basic({ defaultOpen: true })

cases['color-picker-open-swatches'] = () =>
  h(ColorPicker, { defaultValue: 'hsb(0, 60%, 100%)', defaultOpen: true }, {
    trigger: trigger('Brand Color'),
    default: () => [area(), hue({ 'aria-label': 'Hue slider' }), swatches('justify-center px-1')],
  })

cases['color-picker-open-fields'] = () =>
  h(ColorPicker, { defaultValue: 'hsl(240, 100%, 50%)', defaultOpen: true, ui: { popover: 'max-w-62 gap-2' } }, {
    trigger: trigger(),
    default: () => [
      h(ColorArea, { class: 'max-w-full', colorSpace: 'hsb', xChannel: 'saturation', yChannel: 'brightness' }),
      hue(),
      h(Select, { 'aria-label': 'Color space', 'variant': 'secondary', 'defaultValue': 'hsl', 'items': spaces, 'ui': { value: 'uppercase' } }),
      h('div', { class: 'grid w-full grid-cols-3 items-center gap-2' }, ['hue', 'saturation', 'lightness'].map(channel =>
        h(ColorField, { 'key': channel, 'aria-label': channel, channel, 'colorSpace': 'hsl', 'variant': 'secondary' } as any))),
    ],
  })

cases['color-picker-open-sliders'] = () =>
  h(ColorPicker, { defaultValue: 'hsl(219, 58%, 93%)', defaultOpen: true, ui: { popover: 'max-w-62 gap-2 px-2 py-3' } }, {
    trigger: trigger(),
    default: () => [
      h(Select, { 'aria-label': 'Color space', 'variant': 'secondary', 'defaultValue': 'hsl', 'items': spaces, 'ui': { value: 'uppercase' } }),
      h('div', { class: 'flex flex-col gap-2' }, ['hue', 'saturation', 'lightness', 'alpha'].map(channel =>
        h(ColorSlider, { 'key': channel, 'aria-label': channel, channel, 'class': 'gap-1 px-1', 'colorSpace': 'hsl', 'label': channel[0].toUpperCase() + channel.slice(1), 'ui': { label: 'capitalize', output: 'text-muted' } } as any))),
    ],
  })

cases['color-picker-open-controlled'] = () =>
  h(ColorPicker, { defaultValue: 'hsb(120, 50%, 80%)', defaultOpen: true, ui: { popover: 'gap-2' } }, {
    trigger: trigger(),
    default: () => [
      swatches('justify-center pt-2'),
      area(),
      h('div', { class: 'flex items-center gap-2 px-1' }, [
        h(ColorSlider, { 'aria-label': 'Hue slider', 'channel': 'hue', 'class': 'flex-1', 'colorSpace': 'hsb' }),
        h(Button, { 'iconOnly': true, 'aria-label': 'Shuffle color', 'size': 'sm', 'variant': 'tertiary' }, () => gear()),
      ]),
      h(ColorField, { 'aria-label': 'Color field', 'variant': 'secondary' }, { prefix: () => h(ColorSwatch, { size: 'xs' }) }),
    ],
  })

cases['color-picker-open-custom-styles'] = () =>
  h(ColorPicker, { defaultValue: 'hsb(240, 60%, 100%)', defaultOpen: true, ui: { trigger: 'rounded-xl bg-default-soft px-3 py-2', popover: 'bg-surface' } }, {
    trigger: () => [h(ColorSwatch, { size: 'lg' }), h(Label, { class: 'font-medium text-foreground' }, () => 'Theme color')],
    default: () => [area(), hue()],
  })
