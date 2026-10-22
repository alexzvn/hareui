import { mount as rawMount } from '@vue/test-utils'
import { colorToString } from 'reka-ui'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import CellColorPicker from '../src/components/cell-color-picker/CellColorPicker.vue'
import Fieldset from '../src/components/fieldset/Fieldset.vue'

const wrappers: { unmount: () => void }[] = []
const mount = ((...a: any[]) => {
  const w = (rawMount as any)(...a)
  wrappers.push(w)
  return w
}) as typeof rawMount

const trigger = () => document.body.querySelector<HTMLElement>('[data-slot=color-picker-trigger]')!
const popover = () => document.body.querySelector('[data-slot=color-picker-popover]')
const valueText = () => document.body.querySelector('[data-slot=cell-color-picker-value-display]')!.textContent!.trim()

afterEach(() => {
  wrappers.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
})

describe('CellColorPicker', () => {
  it('renders the row: label, uppercase hex value and swatch', () => {
    const w = mount(CellColorPicker, { props: { label: 'Accent', defaultValue: '#3b82f6' }, attachTo: document.body })
    const row = trigger()
    expect(row.querySelector('[data-slot=cell-color-picker-label]')!.textContent!.trim()).toBe('Accent')
    expect(valueText()).toBe('#3B82F6')
    expect(row.querySelector('[data-slot=color-swatch]')).not.toBeNull()
    expect(w.attributes('data-slot')).toBe('cell-color-picker')
    expect(popover()).toBeNull()
  })

  it('opens on click with the default area and hue slider, aligned to the end', async () => {
    mount(CellColorPicker, { props: { label: 'Accent', defaultValue: '#3B82F6' }, attachTo: document.body })
    trigger().click()
    await nextTick()
    await nextTick()
    expect(popover()).not.toBeNull()
    expect(popover()!.getAttribute('data-align')).toBe('end')
    expect(document.body.querySelector('[data-slot=color-area]')).not.toBeNull()
    expect(document.body.querySelector('[data-slot=color-slider]')).not.toBeNull()
    expect(document.body.querySelector('[data-slot=color-swatch-picker]')).toBeNull()
  })

  it('picking a preset emits the color and updates the hex value', async () => {
    const w = mount(CellColorPicker, { props: { label: 'Brand', defaultValue: '#3B82F6', defaultOpen: true, presets: ['#EF4444', '#22C55E'] }, attachTo: document.body })
    await nextTick()
    const items = document.body.querySelectorAll<HTMLElement>('[data-slot=color-swatch-picker-item]')
    expect(items).toHaveLength(2)
    items[1]!.click()
    await nextTick()
    const emitted = w.emitted('update:modelValue')!
    expect(colorToString(emitted.at(-1)![0] as any, 'hex').toUpperCase()).toBe('#22C55E')
    expect(valueText()).toBe('#22C55E')
  })

  it('v-model drives the value display', async () => {
    const w = mount(CellColorPicker, { props: { label: 'Accent', modelValue: '#3B82F6' }, attachTo: document.body })
    await w.setProps({ modelValue: '#EF4444' })
    expect(valueText()).toBe('#EF4444')
  })

  it('disabled blocks opening', async () => {
    mount(CellColorPicker, { props: { label: 'Accent', disabled: true }, attachTo: document.body })
    expect(trigger().hasAttribute('disabled')).toBe(true)
    trigger().click()
    await nextTick()
    expect(popover()).toBeNull()
  })

  it('is disabled by an ancestor Fieldset', async () => {
    mount(Fieldset, { props: { disabled: true }, slots: { default: () => h(CellColorPicker, { label: 'Accent' }) }, attachTo: document.body })
    expect(document.body.querySelector('[data-slot=cell-color-picker]')!.getAttribute('data-disabled')).toBe('true')
    expect(trigger().hasAttribute('disabled')).toBe(true)
    trigger().click()
    await nextTick()
    expect(popover()).toBeNull()
  })
})
