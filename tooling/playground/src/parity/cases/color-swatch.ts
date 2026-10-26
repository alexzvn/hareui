import type { VNode } from 'vue'
import { ColorSwatch } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

const colors = ['#0485F7', '#EF4444', '#F59E0B', '#10B981', '#D946EF']

cases['color-swatch-basic'] = () => h('div', { class: 'flex items-center gap-3' }, colors.map(color =>
  h(ColorSwatch, { key: color, color, 'aria-label': color }),
))

cases['color-swatch-sizes'] = () => h('div', { class: 'flex items-center gap-3' }, [
  h(ColorSwatch, { color: '#0485F7', size: 'xs' }),
  h(ColorSwatch, { color: '#EF4444', size: 'sm' }),
  h(ColorSwatch, { color: '#F59E0B', size: 'md' }),
  h(ColorSwatch, { color: '#10B981', size: 'lg' }),
  h(ColorSwatch, { color: '#D946EF', size: 'xl' }),
])

cases['color-swatch-shapes'] = () => h('div', { class: 'flex items-center gap-3' }, [
  h(ColorSwatch, { color: '#0485F7', shape: 'circle' }),
  h(ColorSwatch, { color: '#0485F7', shape: 'square' }),
])

cases['color-swatch-transparency'] = () => h('div', { class: 'flex items-center gap-3' }, [
  h(ColorSwatch, { 'aria-label': '100% opacity', 'color': 'rgba(4, 133, 247, 1)' }),
  h(ColorSwatch, { 'aria-label': '75% opacity', 'color': 'rgba(4, 133, 247, 0.75)' }),
  h(ColorSwatch, { 'aria-label': '50% opacity', 'color': 'rgba(4, 133, 247, 0.5)' }),
  h(ColorSwatch, { 'aria-label': '25% opacity', 'color': 'rgba(4, 133, 247, 0.25)' }),
  h(ColorSwatch, { 'aria-label': '0% opacity', 'color': 'rgba(4, 133, 247, 0)' }),
])

cases['color-swatch-accessibility'] = () => h('div', { class: 'flex items-center gap-3' }, [
  h(ColorSwatch, { 'aria-label': 'Primary brand color', 'color': '#0485F7', 'color-name': 'Ocean Blue' }),
  h(ColorSwatch, { 'aria-label': 'Error state color', 'color': '#EF4444', 'color-name': 'Coral Red' }),
  h(ColorSwatch, { 'aria-label': 'Warning color', 'color': '#F59E0B', 'color-name': 'Sunset Orange' }),
])
