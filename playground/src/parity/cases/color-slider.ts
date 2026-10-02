import type { VNode } from 'vue'
import { ColorSlider } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

const full = (channel: string, label: string, defaultValue: string, extra: Record<string, unknown> = {}) => () =>
  h(ColorSlider, { class: 'w-[320px]', channel, label, defaultValue, ...extra } as any)

cases['color-slider-default'] = full('hue', 'Hue', 'hsl(0, 100%, 50%)')
cases['color-slider-focus'] = full('hue', 'Hue', 'hsl(200, 100%, 50%)')
cases['color-slider-saturation'] = full('saturation', 'Saturation', 'hsl(220, 70%, 50%)')
cases['color-slider-lightness'] = full('lightness', 'Lightness', 'hsl(220, 70%, 50%)')
cases['color-slider-alpha'] = full('alpha', 'Alpha', 'hsla(0, 100%, 50%, 0.5)')
cases['color-slider-red'] = full('red', 'Red', 'rgb(255, 100, 50)')
cases['color-slider-brightness'] = full('brightness', 'Brightness', 'hsb(220, 70%, 60%)', { colorSpace: 'hsb' })
cases['color-slider-disabled'] = full('hue', 'Hue', 'hsl(200, 100%, 50%)', { disabled: true })

cases['color-slider-no-label'] = () => h(ColorSlider, { class: 'w-[320px]', 'aria-label': 'Hue', channel: 'hue', defaultValue: 'hsl(120, 100%, 50%)' } as any)

cases['color-slider-vertical'] = () => h('div', { class: 'flex h-48 gap-4' }, [
  h(ColorSlider, { 'aria-label': 'Hue', 'channel': 'hue', 'defaultValue': 'hsl(0, 100%, 50%)', 'orientation': 'vertical' } as any),
  h(ColorSlider, { 'aria-label': 'Saturation', 'channel': 'saturation', 'defaultValue': 'hsl(0, 100%, 50%)', 'orientation': 'vertical' } as any),
  h(ColorSlider, { 'aria-label': 'Lightness', 'channel': 'lightness', 'defaultValue': 'hsl(0, 100%, 50%)', 'orientation': 'vertical' } as any),
])

cases['color-slider-custom-styles'] = () => h(ColorSlider, {
  class: 'w-[320px]',
  channel: 'hue',
  label: 'Hue',
  defaultValue: 'hsl(220, 70%, 50%)',
  ui: {
    label: 'font-medium text-foreground',
    output: 'text-muted tabular-nums',
    track: 'h-4! rounded-none! ring-1 ring-border [&::after]:rounded-r-sm! [&::before]:rounded-l-sm!',
    thumb: 'size-4 rounded-sm! border-2 border-background shadow-md ring-1 ring-black/10 dark:ring-white/20',
  },
} as any)
