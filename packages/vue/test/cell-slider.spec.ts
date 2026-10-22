import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import CellSlider from '../src/components/cell-slider/CellSlider.vue'
import Fieldset from '../src/components/fieldset/Fieldset.vue'

const thumb = (w: ReturnType<typeof mount>) => w.get('[data-slot=slider-thumb]')
const output = (w: ReturnType<typeof mount>) => w.get('[data-slot=slider-output]').text()

describe('CellSlider', () => {
  it('renders the label, the value and a horizontal track with one thumb', () => {
    const w = mount(CellSlider, { props: { label: 'Volume', id: 'v', defaultValue: 75 } })
    expect(w.get('#v-label').text()).toBe('Volume')
    expect(output(w)).toBe('75')
    expect(w.get('[data-slot=cell-slider]').attributes('data-orientation')).toBe('horizontal')
    expect(w.findAll('[data-slot=slider-thumb]')).toHaveLength(1)
    expect(thumb(w).attributes('aria-labelledby')).toBe('v-label')
  })

  it('keyboard steps update v-model with a number and emit changeEnd', async () => {
    const model = ref(50)
    const w = mount(() => h(CellSlider, { 'label': 'Volume', 'modelValue': model.value, 'onUpdate:modelValue': (v: number | undefined) => (model.value = v!) }), { attachTo: document.body })
    // Reka resolves each thumb's index on the tick after mount; a step before that focuses the thumb with index -1
    await nextTick()
    await thumb(w).trigger('keydown', { key: 'ArrowRight' })
    expect(model.value).toBe(51)
    await thumb(w).trigger('keydown', { key: 'ArrowLeft' })
    await thumb(w).trigger('keydown', { key: 'ArrowLeft' })
    expect(model.value).toBe(49)
    await thumb(w).trigger('keydown', { key: 'End' })
    expect(model.value).toBe(100)
    expect(w.findComponent(CellSlider).emitted('changeEnd')!.at(-1)).toEqual([100])
    await thumb(w).trigger('keydown', { key: 'Home' })
    expect(model.value).toBe(0)
    w.unmount()
  })

  it('uncontrolled: defaultValue seeds the value and it still moves', async () => {
    const w = mount(CellSlider, { props: { defaultValue: 30 } })
    await thumb(w).trigger('keydown', { key: 'ArrowRight' })
    expect(output(w)).toBe('31')
    expect(w.emitted('update:modelValue')).toEqual([[31]])
  })

  it('fractional steps and formatOptions shape the value at the end of the row', async () => {
    const w = mount(CellSlider, { props: { min: 0, max: 1, step: 0.01, defaultValue: 0.5, locale: 'en-US', formatOptions: { minimumFractionDigits: 2 } } })
    expect(output(w)).toBe('0.50')
    await thumb(w).trigger('keydown', { key: 'ArrowRight' })
    expect(output(w)).toBe('0.51')
  })

  it('the fill width follows the value', () => {
    const w = mount(CellSlider, { props: { defaultValue: 30 } })
    expect(w.get('[data-slot=slider-fill]').attributes('style')).toContain('width: 30%')
  })

  it('disabled ignores keyboard input', async () => {
    const w = mount(CellSlider, { props: { defaultValue: 30, disabled: true } })
    await thumb(w).trigger('keydown', { key: 'ArrowRight' })
    expect(output(w)).toBe('30')
    expect(w.emitted('update:modelValue')).toBeUndefined()
    expect(w.get('[data-slot=cell-slider]').attributes('data-disabled')).toBeDefined()
  })

  it('the #output slot receives the value and its formatted text', () => {
    const w = mount(CellSlider, {
      props: { defaultValue: 40 },
      slots: { output: ({ value, formatted }: { value: number, formatted: string }) => `${value}|${formatted}%` },
    })
    expect(output(w)).toBe('40|40%')
  })

  it('is disabled by an ancestor Fieldset', async () => {
    const w = mount(Fieldset, { props: { disabled: true }, slots: { default: () => h(CellSlider, { label: 'Volume', defaultValue: 30 }) } })
    const slider = w.findComponent(CellSlider)
    await w.get('[data-slot=slider-thumb]').trigger('keydown', { key: 'ArrowRight' })
    expect(w.get('[data-slot=slider-output]').text()).toBe('30')
    expect(slider.emitted('update:modelValue')).toBeUndefined()
    expect(w.get('[data-slot=slider-thumb]').attributes('tabindex')).toBeUndefined()
    expect(w.get('[data-slot=cell-slider]').attributes('data-disabled')).toBeDefined()
  })
})
