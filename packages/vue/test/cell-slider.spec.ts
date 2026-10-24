import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'

import type { CellSliderProps } from '@/components/cell-slider/CellSlider.vue'
import CellSlider from '@/components/cell-slider/CellSlider.vue'
import Fieldset from '@/components/fieldset/Fieldset.vue'

import { expectAccessible } from './a11y'

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
    const w = mount(
      () =>
        h(CellSlider, {
          label: 'Volume',
          modelValue: model.value,
          'onUpdate:modelValue': (v: number | undefined) => (model.value = v!),
        }),
      { attachTo: document.body },
    )

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
    const w = mount(CellSlider, {
      props: {
        min: 0,
        max: 1,
        step: 0.01,
        defaultValue: 0.5,
        locale: 'en-US',
        formatOptions: { minimumFractionDigits: 2 },
      },
    })

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
      slots: {
        output: ({ value, formatted }: { value: number; formatted: string }) =>
          `${value}|${formatted}%`,
      },
    })

    expect(output(w)).toBe('40|40%')
  })

  it('is disabled by an ancestor Fieldset', async () => {
    const w = mount(Fieldset, {
      props: { disabled: true },
      slots: { default: () => h(CellSlider, { label: 'Volume', defaultValue: 30 }) },
    })

    const slider = w.findComponent(CellSlider)
    await w.get('[data-slot=slider-thumb]').trigger('keydown', { key: 'ArrowRight' })
    expect(w.get('[data-slot=slider-output]').text()).toBe('30')
    expect(slider.emitted('update:modelValue')).toBeUndefined()
    expect(w.get('[data-slot=slider-thumb]').attributes('tabindex')).toBeUndefined()
    expect(w.get('[data-slot=cell-slider]').attributes('data-disabled')).toBeDefined()
  })

  it.each<[string, CellSliderProps & { 'aria-label'?: string }]>([
    ['idle with a visible label', { label: 'Volume', defaultValue: 40 }],
    ['named by aria-label only', { 'aria-label': 'Volume', defaultValue: 40 }],
    [
      'secondary with a formatted value',
      {
        label: 'Opacity',
        defaultValue: 0.4,
        min: 0,
        max: 1,
        step: 0.1,
        variant: 'secondary',
        formatOptions: { style: 'percent' },
      },
    ],
    ['disabled', { label: 'Volume', defaultValue: 40, disabled: true }],
  ])('has no axe violations: %s', async (_, props) => {
    const w = mount(CellSlider, { props, attachTo: document.body })
    await nextTick()
    await expectAccessible(w)
    w.unmount()
  })

  it('has no axe violations while the thumb has keyboard focus', async () => {
    const w = mount(CellSlider, {
      props: { label: 'Volume', defaultValue: 40 },
      attachTo: document.body,
    })

    await nextTick()
    ;(thumb(w).element as HTMLElement).focus()
    await thumb(w).trigger('keydown', { key: 'ArrowRight' })
    expect(document.activeElement).toBe(thumb(w).element)
    await expectAccessible(w)
    w.unmount()
  })

  it('the thumb is the tab stop and PageUp / PageDown move by a tenth of the range', async () => {
    const w = mount(CellSlider, {
      props: { label: 'Volume', defaultValue: 40 },
      attachTo: document.body,
    })

    await nextTick()
    expect(thumb(w).attributes('tabindex')).toBe('0')
    await thumb(w).trigger('keydown', { key: 'PageUp' })
    expect(output(w)).toBe('50')
    await thumb(w).trigger('keydown', { key: 'PageDown' })
    await thumb(w).trigger('keydown', { key: 'PageDown' })
    expect(output(w)).toBe('30')
    w.unmount()
  })

  it('the thumb is a horizontal slider exposing its range and formatted value text', async () => {
    const w = mount(CellSlider, {
      props: {
        label: 'Opacity',
        defaultValue: 0.4,
        min: 0,
        max: 1,
        step: 0.1,
        locale: 'en-US',
        formatOptions: { style: 'percent' },
      },
      attachTo: document.body,
    })

    await nextTick()

    expect(thumb(w).attributes()).toMatchObject({
      role: 'slider',
      'aria-orientation': 'horizontal',
      'aria-valuemin': '0',
      'aria-valuemax': '1',
      'aria-valuenow': '0.4',
      'aria-valuetext': '40%',
    })

    w.unmount()
  })

  it('aria-label names the thumb when there is no visible label', async () => {
    const w = mount(CellSlider, {
      props: { 'aria-label': 'Volume', defaultValue: 40 },
      attachTo: document.body,
    })

    await nextTick()
    expect(thumb(w).attributes('aria-label')).toBe('Volume')
    expect(thumb(w).attributes('aria-labelledby')).toBeUndefined()
    w.unmount()
  })

  it('a disabled row reports aria-disabled and leaves the tab order', async () => {
    const w = mount(CellSlider, {
      props: { label: 'Volume', defaultValue: 40, disabled: true },
      attachTo: document.body,
    })

    await nextTick()
    expect(thumb(w).attributes('aria-disabled')).toBe('true')
    expect(thumb(w).attributes('tabindex')).toBeUndefined()
    w.unmount()
  })
})
