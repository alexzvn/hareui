import { mount, type VueWrapper } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import { colorToString, parseColor } from 'reka-ui'
import type { ColorSwatchPickerProps } from '../src/components/color-swatch-picker/ColorSwatchPicker.vue'
import ColorSwatchPicker from '../src/components/color-swatch-picker/ColorSwatchPicker.vue'
import { ColorPickerContextKey } from '../src/components/color-picker/context'
import { expectAccessible } from './a11y'

const items = ['#F43F5E', '#8B5CF6', { value: '#3B82F6', label: 'Sky' }]
const opts = (c: VueWrapper) => c.findAll('[data-slot=color-swatch-picker-item]')
const label = { 'aria-label': 'Brand colours' }
// Reka highlights the selected (or first) option a couple of ticks after mount
const settle = () => new Promise(resolve => setTimeout(resolve, 0))

describe('ColorSwatchPicker', () => {
  it('passes axe idle, selected, with a disabled item, fully disabled and stacked', async () => {
    const cases: ColorSwatchPickerProps[] = [
      { items },
      { items, defaultValue: '#8B5CF6' },
      { items: [{ value: '#F43F5E', disabled: true }, '#8B5CF6', '#3B82F6'], defaultValue: '#3B82F6' },
      { items, disabled: true, defaultValue: '#8B5CF6' },
      { items, layout: 'stack', defaultValue: '#F43F5E' },
    ]
    for (const props of cases) {
      const w = mount(ColorSwatchPicker, { props, attrs: label, attachTo: document.body })
      await settle()
      await expectAccessible(w)
      w.unmount()
    }
  })

  it('passes axe while an option has keyboard focus', async () => {
    const w = mount(ColorSwatchPicker, { props: { items, defaultValue: '#8B5CF6' }, attrs: label, attachTo: document.body })
    await settle()
    ;(opts(w)[1].element as HTMLElement).focus()
    await nextTick()
    await expectAccessible(w)
    w.unmount()
  })

  it('names the listbox from aria-label and each option from its colour', () => {
    const w = mount(ColorSwatchPicker, { props: { items }, attrs: label })
    expect(w.get('[role=listbox]').attributes('aria-label')).toBe('Brand colours')
    const names = opts(w).map(o => o.attributes('aria-label'))
    expect(names[2]).toBe('Sky')
    expect(names.every(n => !!n)).toBe(true)
    w.unmount()
  })

  it('aria-selected follows the selection and disabled items expose aria-disabled', async () => {
    const w = mount(ColorSwatchPicker, { props: { items: ['#F43F5E', { value: '#8B5CF6', disabled: true }, '#3B82F6'], defaultValue: '#F43F5E' }, attrs: label })
    expect(opts(w).map(o => o.attributes('aria-selected'))).toEqual(['true', 'false', 'false'])
    expect(opts(w)[1].attributes('aria-disabled')).toBe('true')
    await opts(w)[2].trigger('click')
    expect(opts(w).map(o => o.attributes('aria-selected'))).toEqual(['false', 'false', 'true'])
    w.unmount()
  })

  it('is a single tab stop on the selected swatch (roving tabindex)', async () => {
    const w = mount(ColorSwatchPicker, { props: { items, defaultValue: '#8B5CF6' }, attrs: label, attachTo: document.body })
    await settle()
    const tabbable = w.findAll('[tabindex="0"]')
    expect(tabbable).toHaveLength(1)
    expect(tabbable[0].element).toBe(opts(w)[1].element)
    w.unmount()
  })

  it('arrow keys move focus, Home/End jump to the ends and skip disabled swatches', async () => {
    const w = mount(ColorSwatchPicker, {
      props: { items: [{ value: '#F43F5E', disabled: true }, '#8B5CF6', '#3B82F6', '#22C55E', { value: '#EAB308', disabled: true }] },
      attrs: label,
      attachTo: document.body,
    })
    await settle()
    const press = async (key: string) => {
      ;(document.activeElement as HTMLElement).dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
      await nextTick()
      await nextTick()
      return opts(w).findIndex(o => o.element === document.activeElement)
    }
    ;(opts(w)[1].element as HTMLElement).focus()
    expect(await press('ArrowRight')).toBe(2)
    expect(await press('ArrowRight')).toBe(3)
    expect(await press('ArrowLeft')).toBe(2)
    expect(await press('End')).toBe(3)
    expect(await press('Home')).toBe(1)
    w.unmount()
  })

  it('Enter and Space select the focused swatch', async () => {
    const w = mount(ColorSwatchPicker, { props: { items }, attrs: label, attachTo: document.body })
    await settle()
    const node = opts(w)[1].element as HTMLElement
    node.focus()
    node.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }))
    await nextTick()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['#8B5CF6'])
    const next = opts(w)[2].element as HTMLElement
    next.focus()
    next.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }))
    await nextTick()
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['#3B82F6'])
    expect(opts(w)[2].attributes('aria-selected')).toBe('true')
    w.unmount()
  })

  it('fully disabled removes every swatch from the tab order', async () => {
    const w = mount(ColorSwatchPicker, { props: { items, disabled: true }, attrs: label, attachTo: document.body })
    await settle()
    expect(w.findAll('[tabindex="0"]')).toHaveLength(0)
    expect(w.get('[role=listbox]').attributes('aria-disabled')).toBe('true')
    expect(opts(w).map(o => o.attributes('aria-disabled'))).toEqual(['true', 'true', 'true'])
    w.unmount()
  })

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
