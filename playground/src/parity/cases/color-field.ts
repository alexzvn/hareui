import type { VNode } from 'vue'
import { ColorField, ColorSwatch } from '@hareui/vue'
import { h } from 'vue'

export const cases: Record<string, () => VNode> = {}

cases['color-field-default'] = () => h(ColorField, { class: 'w-[280px]', name: 'color', label: 'Color', defaultValue: '#0485F7' }, {
  prefix: () => h(ColorSwatch, { color: '#0485F7', size: 'xs' }),
})

cases['color-field-focus'] = () => h(ColorField, { class: 'w-[280px]', name: 'color', label: 'Color', defaultValue: '#0485F7' })

cases['color-field-secondary'] = () => h(ColorField, { class: 'w-[280px]', name: 'secondary-color', label: 'Secondary variant', variant: 'secondary', defaultValue: '#F43F5E' })

cases['color-field-secondary-focus'] = () => h(ColorField, { class: 'w-[280px]', name: 'secondary-color', label: 'Secondary variant', variant: 'secondary', defaultValue: '#F43F5E' })

cases['color-field-required'] = () => h(ColorField, { class: 'w-[280px]', name: 'color', label: 'Brand Color', required: true, placeholder: '#000000' })

cases['color-field-disabled'] = () => h(ColorField, { class: 'w-[280px]', name: 'color', label: 'Disabled', disabled: true, defaultValue: '#6B7280' })

cases['color-field-invalid'] = () => h(ColorField, { class: 'w-[280px]', name: 'color', label: 'Color', invalid: true, defaultValue: '#0485F7', errorMessage: 'Please enter a valid color' })

cases['color-field-full-width'] = () => h('div', { class: 'w-[400px]' }, [
  h(ColorField, { fullWidth: true, name: 'color', label: 'Brand Color', defaultValue: '#10B981' }),
])

cases['color-field-with-description'] = () => h(ColorField, { class: 'w-[280px]', name: 'color', label: 'Primary Color', defaultValue: '#3B82F6', description: 'Enter your brand\'s primary color' })

cases['color-field-channel-editing'] = () => h(ColorField, { class: 'w-[280px]', name: 'hue', label: 'Hue', channel: 'hue', colorSpace: 'hsl', defaultValue: 'hsl(210, 100%, 50%)' })

cases['color-field-user-overrides'] = () => h(ColorField, { class: 'w-[280px]', name: 'color', label: 'Color', defaultValue: '#0485F7', ui: { group: 'rounded-none bg-accent-soft' } })
