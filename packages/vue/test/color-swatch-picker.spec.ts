import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
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

  describe('keyboard and focus parity with React Aria', () => {
    const press = async (key: string) => {
      const active = document.activeElement as HTMLElement
      active.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
      await nextTick()
      await nextTick()
    }
    const activeIndex = (w: VueWrapper) => opts(w).findIndex(o => o.element === document.activeElement)
    const colors = ['#F43F5E', '#8B5CF6', '#3B82F6', '#22C55E', '#EAB308']

    it('stack layout: ArrowRight and ArrowLeft move focus like ArrowDown and ArrowUp', async () => {
      // behaviour-final-check SP6
      const w = mount(ColorSwatchPicker, { props: { items: colors, layout: 'stack' }, attachTo: document.body })
      ;(opts(w)[1].element as HTMLElement).focus()
      expect(activeIndex(w)).toBe(1)
      await press('ArrowRight')
      expect(activeIndex(w)).toBe(2)
      await press('ArrowLeft')
      expect(activeIndex(w)).toBe(1)
      w.unmount()
    })

    it('stack layout: PageDown jumps to the last item and PageUp to the first', async () => {
      // behaviour-final-check SP6
      const w = mount(ColorSwatchPicker, { props: { items: colors, layout: 'stack' }, attachTo: document.body })
      ;(opts(w)[2].element as HTMLElement).focus()
      await press('PageDown')
      expect(activeIndex(w)).toBe(4)
      await press('PageUp')
      expect(activeIndex(w)).toBe(0)
      w.unmount()
    })

    it('grid layout: PageUp jumps to the first item', async () => {
      // behaviour-final-check SP6
      const w = mount(ColorSwatchPicker, { props: { items: colors }, attachTo: document.body })
      ;(opts(w)[3].element as HTMLElement).focus()
      await press('PageUp')
      expect(activeIndex(w)).toBe(0)
      w.unmount()
    })

    it('does not move focus onto a swatch when the colour changes from outside the picker', async () => {
      // behaviour-final-check SP2 / A2
      const field = document.createElement('input')
      document.body.append(field)
      const w = mount(ColorSwatchPicker, { props: { items: colors, modelValue: '#000000' }, attachTo: document.body })
      field.focus()
      expect(document.activeElement).toBe(field)
      await w.setProps({ modelValue: '#8B5CF6' })
      await nextTick()
      await nextTick()
      expect(opts(w)[1].attributes('data-state')).toBe('checked')
      expect(document.activeElement).toBe(field)
      w.unmount()
      field.remove()
    })
  })
})
