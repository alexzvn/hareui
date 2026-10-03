import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Slider from '../src/components/slider/Slider.vue'

const thumbs = (w: ReturnType<typeof mount>) => w.findAll('[data-slot=slider-thumb]')
const output = (w: ReturnType<typeof mount>) => w.get('[data-slot=slider-output]').text()
const track = (w: ReturnType<typeof mount>) => w.get('[data-slot=slider-track]')

describe('Slider', () => {
  it('keyboard steps update v-model by `step`, clamped to max, and emit changeEnd', async () => {
    const model = ref(90)
    const w = mount(() => h(Slider, { 'step': 5, 'modelValue': model.value, 'onUpdate:modelValue': (v: number | number[] | undefined) => (model.value = v as number) }), { attachTo: document.body })
    const thumb = thumbs(w)[0]!
    await thumb.trigger('keydown', { key: 'ArrowRight' })
    expect(model.value).toBe(95)
    await thumb.trigger('keydown', { key: 'End' })
    await thumb.trigger('keydown', { key: 'ArrowRight' })
    expect(model.value).toBe(100)
    expect(w.findComponent(Slider).emitted('changeEnd')!.at(-1)).toEqual([100])
    expect(thumb.attributes('aria-valuenow')).toBe('100')
    w.unmount()
  })

  it('uncontrolled: defaultValue seeds the slider and it still moves', async () => {
    const w = mount(Slider, { props: { defaultValue: 30 } })
    expect(output(w)).toBe('30')
    await thumbs(w)[0]!.trigger('keydown', { key: 'ArrowLeft' })
    expect(output(w)).toBe('29')
  })

  it('an array value renders one thumb per value and emits arrays', async () => {
    const model = ref<number[]>([20, 60])
    const w = mount(() => h(Slider, { 'modelValue': model.value, 'onUpdate:modelValue': (v: number | number[] | undefined) => (model.value = v as number[]) }))
    expect(thumbs(w)).toHaveLength(2)
    expect(output(w)).toBe('20 – 60')
    // `End` moves the last thumb (arrow keys follow the focused thumb, which Reka resolves via DOM order)
    await thumbs(w)[1]!.trigger('keydown', { key: 'End' })
    expect(model.value).toEqual([20, 100])
  })

  it('formats the output with formatOptions and locale', () => {
    const w = mount(Slider, { props: { defaultValue: [100, 500], max: 1000, locale: 'en-US', formatOptions: { style: 'currency', currency: 'USD', maximumFractionDigits: 0 } } })
    expect(output(w)).toBe('$100 – $500')
  })

  it('track fill edges follow HeroUI: single thumb fills from the start, a range only at touching edges', async () => {
    const value = ref<number | number[]>(0)
    const w = mount(() => h(Slider, { modelValue: value.value }))
    expect(track(w).attributes('data-fill-start')).toBeUndefined()
    value.value = 40
    await nextTick()
    expect(track(w).attributes('data-fill-start')).toBe('true')
    expect(track(w).attributes('data-fill-end')).toBeUndefined()
    value.value = 100
    await nextTick()
    expect(track(w).attributes('data-fill-end')).toBe('true')
    value.value = [10, 100]
    await nextTick()
    expect(track(w).attributes('data-fill-start')).toBeUndefined()
    expect(track(w).attributes('data-fill-end')).toBe('true')
  })

  it('disabled ignores keyboard input', async () => {
    const w = mount(Slider, { props: { defaultValue: 30, disabled: true } })
    await thumbs(w)[0]!.trigger('keydown', { key: 'ArrowRight' })
    expect(output(w)).toBe('30')
    expect(w.get('[data-slot=slider]').attributes('data-disabled')).toBeDefined()
  })

  it('the label names the slider', () => {
    const w = mount(Slider, { props: { label: 'Volume', id: 's' } })
    expect(w.get('[data-slot=slider]').attributes('aria-labelledby')).toBe('s-label')
    expect(w.get('#s-label').text()).toBe('Volume')
  })

  it('data-focus-visible: set by keyboard focus and keys, not by a pointer press', async () => {
    const w = mount(Slider, { props: { defaultValue: 30 } })
    const thumb = thumbs(w)[0]!
    await thumb.trigger('focus')
    expect(thumb.attributes('data-focus-visible')).toBe('true')
    await thumb.trigger('blur')
    expect(thumb.attributes('data-focus-visible')).toBeUndefined()
    await thumb.trigger('pointerdown')
    await thumb.trigger('focus')
    expect(thumb.attributes('data-focus-visible')).toBeUndefined()
    await thumb.trigger('keydown', { key: 'ArrowRight' })
    expect(thumb.attributes('data-focus-visible')).toBe('true')
  })
})
