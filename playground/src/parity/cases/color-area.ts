import type { VNode } from 'vue'
import { ColorArea } from 'herouse'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

cases['color-area-default'] = () => h('div', { class: 'w-[300px]' }, [h(ColorArea, { defaultValue: 'rgb(116, 52, 255)' })])

cases['color-area-with-dots'] = () => h('div', { class: 'w-[300px]' }, [h(ColorArea, { showDots: true, defaultValue: 'hsl(200, 100%, 50%)' })])

cases['color-area-disabled'] = () => h('div', { class: 'w-[300px]' }, [h(ColorArea, { disabled: true, defaultValue: 'hsl(200, 100%, 50%)' })])

cases['color-area-rgb-channels'] = () => h('div', { class: 'w-[300px]' }, [h(ColorArea, { colorSpace: 'rgb', xChannel: 'red', yChannel: 'green', defaultValue: 'rgb(255, 100, 50)' })])

cases['color-area-hsl-channels'] = () => h('div', { class: 'w-[300px]' }, [h(ColorArea, { colorSpace: 'hsl', xChannel: 'saturation', yChannel: 'lightness', defaultValue: 'hsl(30, 100%, 50%)' })])

cases['color-area-user-overrides'] = () => h('div', { class: 'w-[300px]' }, [h(ColorArea, { class: 'size-44 rounded-3xl', ui: { thumb: 'size-5 rounded-full border-4' }, defaultValue: 'rgb(116, 52, 255)' })])

cases['color-area-hsb-channels'] = () => h('div', { class: 'w-[300px]' }, [h(ColorArea, { colorSpace: 'hsb', xChannel: 'saturation', yChannel: 'brightness', defaultValue: 'hsb(219, 58%, 93%)' })])
