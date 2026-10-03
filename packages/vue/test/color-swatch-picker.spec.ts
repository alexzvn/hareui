import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import { colorToString, parseColor } from 'reka-ui'
import ColorSwatchPicker from '../src/components/color-swatch-picker/ColorSwatchPicker.vue'
import { ColorPickerContextKey } from '../src/components/color-picker/context'

const items = ['#F43F5E', '#8B5CF6', { value: '#3B82F6', label: 'Sky' }]
const opts = (c: VueWrapper) => c.findAll('[data-slot=color-swatch-picker-item]')

describe('colorSwatchPicker', () => {
  it('renders one listbox option per item with a ColorSwatch each', () => {
    const w = mount(ColorSwatchPicker, { props: { items } })
    expect(w.find('[data-slot=color-swatch-picker]').attributes('role')).toBe('listbox')
    expect(opts(w)).toHaveLength(3)
    expect(w.findAll('[data-slot=color-swatch-picker-swatch]')).toHaveLength(3)
    expect(opts(w)[2].attributes('aria-label')).toBe('Sky')
  })

  it('defaultValue selects a matching item case-insensitively and indicator is always rendered', () => {
    const w = mount(ColorSwatchPicker, { props: { items, defaultValue: '#8b5cf6' } })
    expect(opts(w).map(o => o.attributes('data-state'))).toEqual(['unchecked', 'checked', 'unchecked'])
    expect(w.findAll('[data-slot=color-swatch-picker-indicator]')).toHaveLength(3)
  })

  it('clicking an item emits update:modelValue and selects it when uncontrolled', async () => {
    const w = mount(ColorSwatchPicker, { props: { items } })
    await opts(w)[1].trigger('click')
    expect(w.emitted('update:modelValue')).toEqual([['#8B5CF6']])
    expect(opts(w)[1].attributes('data-state')).toBe('checked')
  })

  it('emits a Color object when the current model is a Color, and stays controlled', async () => {
    const w = mount(ColorSwatchPicker, { props: { items, modelValue: parseColor('#F43F5E') } })
    expect(opts(w)[0].attributes('data-state')).toBe('checked')
    await opts(w)[1].trigger('click')
    const emitted = w.emitted('update:modelValue')![0][0] as any
    expect(typeof emitted).toBe('object')
    expect(opts(w)[0].attributes('data-state')).toBe('checked')
  })

  it('disabled items cannot be selected', async () => {
    const w = mount(ColorSwatchPicker, { props: { items: [{ value: '#F43F5E', disabled: true }, '#8B5CF6'] } })
    await opts(w)[0].trigger('click')
    expect(w.emitted('update:modelValue')).toBeUndefined()
  })

  it('reads and writes the enclosing ColorPicker context', async () => {
    const calls: any[] = []
    const Wrapper = { setup: () => () => h(ColorSwatchPicker, { items }) }
    const w = mount(Wrapper, {
      global: { provide: { [ColorPickerContextKey as unknown as string]: { color: { value: parseColor('#8B5CF6') }, setColor: (c: any) => calls.push(c) } } },
    })
    expect(opts(w)[1].attributes('data-state')).toBe('checked')
    await opts(w)[0].trigger('click')
    expect(calls.map(c => colorToString(c, 'hex'))).toEqual(['#f43f5e'])
  })

  it('indicator slot replaces the check icon', () => {
    const w = mount(ColorSwatchPicker, { props: { items, defaultValue: '#F43F5E' }, slots: { indicator: () => h('i', { 'data-testid': 'x' }) } })
    expect(w.findAll('[data-testid=x]')).toHaveLength(3)
    expect(w.find('[data-slot=color-swatch-picker-checkmark]').exists()).toBe(false)
  })
})
