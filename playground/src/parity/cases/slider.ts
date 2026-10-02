import type { VNode } from 'vue'
import { Slider } from 'herouse'
import { h } from 'vue'

const slider = (props: Record<string, unknown> = {}) => h(Slider, { class: 'w-80', label: 'Volume', defaultValue: 30, ...props })

export const cases: Record<string, () => VNode> = {
  'slider-default': () => slider(),
  'slider-zero': () => slider({ defaultValue: 0 }),
  'slider-full': () => slider({ defaultValue: 100 }),
  'slider-range': () => slider({ label: 'Price Range', defaultValue: [100, 500], max: 1000, step: 50, formatOptions: { currency: 'USD', style: 'currency' } }),
  'slider-range-edges': () => slider({ label: 'Range', defaultValue: [0, 100] }),
  'slider-currency': () => slider({ label: 'Price', defaultValue: 60, formatOptions: { currency: 'USD', style: 'currency' } }),
  'slider-disabled': () => slider({ disabled: true }),
  'slider-vertical': () => h('div', { class: 'flex h-64 items-center justify-center' }, [slider({ class: 'h-full', orientation: 'vertical' })]),
  'slider-no-label': () => slider({ 'label': undefined, 'aria-label': 'Volume' }),
}
