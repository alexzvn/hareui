import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Slider from '../src/components/slider/Slider.vue'

const thumbs = (w: ReturnType<typeof mount>) => w.findAll('[data-slot=slider-thumb]')
const output = (w: ReturnType<typeof mount>) => w.get('[data-slot=slider-output]').text()
const track = (w: ReturnType<typeof mount>) => w.get('[data-slot=slider-track]')
// accessible name computation: aria-labelledby wins over aria-label
function accessibleName(el: Element) {
  const labelledBy = (el.getAttribute('aria-labelledby') ?? '').split(/\s+/).map(id => document.getElementById(id)?.textContent ?? '').join(' ').trim()
  return labelledBy || el.getAttribute('aria-label') || ''
}

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

  it('a disabled slider reports aria-disabled on every thumb', () => {
    const w = mount(Slider, { props: { defaultValue: [20, 60], disabled: true } })
    expect(thumbs(w).map(t => t.attributes('aria-disabled'))).toEqual(['true', 'true'])
    expect(mount(Slider, { props: { defaultValue: 30 } }).get('[data-slot=slider-thumb]').attributes('aria-disabled')).toBeUndefined()
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

  it('names each thumb: a slider role with a non-empty accessible name from the label', () => {
    // behaviour-final-check Slider-1
    const w = mount(Slider, { props: { label: 'Volume', id: 's', defaultValue: 30 }, attachTo: document.body })
    const thumb = thumbs(w)[0]!
    expect(thumb.attributes('role')).toBe('slider')
    expect(accessibleName(thumb.element)).toContain('Volume')
    w.unmount()
  })

  it('names every thumb of a range slider after the slider label', () => {
    // behaviour-final-check Slider-1
    const w = mount(Slider, { props: { label: 'Price', id: 'r', defaultValue: [20, 60] }, attachTo: document.body })
    expect(thumbs(w).map(t => accessibleName(t.element))).toEqual([expect.stringContaining('Price'), expect.stringContaining('Price')])
    w.unmount()
  })

  it('range thumbs cannot cross: the start thumb stops at the end thumb\'s value', async () => {
    // behaviour-final-check Slider-2
    const model = ref<number[]>([59, 60])
    const w = mount(() => h(Slider, { 'modelValue': model.value, 'onUpdate:modelValue': (v: number | number[] | undefined) => (model.value = v as number[]) }), { attachTo: document.body })
    await nextTick()
    const start = thumbs(w)[0]!
    ;(start.element as HTMLElement).focus()
    await start.trigger('keydown', { key: 'ArrowRight' })
    await start.trigger('keydown', { key: 'ArrowRight' })
    expect(model.value).toEqual([60, 60])
    w.unmount()
  })

  it('range thumbs cannot cross: the end thumb stops at the start thumb\'s value', async () => {
    // behaviour-final-check Slider-2
    const model = ref<number[]>([20, 21])
    const w = mount(() => h(Slider, { 'modelValue': model.value, 'onUpdate:modelValue': (v: number | number[] | undefined) => (model.value = v as number[]) }), { attachTo: document.body })
    await nextTick()
    const end = thumbs(w)[1]!
    ;(end.element as HTMLElement).focus()
    await end.trigger('keydown', { key: 'ArrowLeft' })
    await end.trigger('keydown', { key: 'ArrowLeft' })
    expect(model.value).toEqual([20, 20])
    w.unmount()
  })

  it('PageUp / PageDown move by max(step, range / 10), not 10 × step', async () => {
    // behaviour-final-check Slider-3
    const w = mount(Slider, { props: { defaultValue: 60, step: 10 }, attachTo: document.body })
    const thumb = thumbs(w)[0]!
    await thumb.trigger('keydown', { key: 'PageUp' })
    expect(output(w)).toBe('70')
    await thumb.trigger('keydown', { key: 'PageDown' })
    await thumb.trigger('keydown', { key: 'PageDown' })
    expect(output(w)).toBe('50')
    w.unmount()
  })

  it('PageUp moves a tenth of a large range when that exceeds one step', async () => {
    // behaviour-final-check Slider-3
    const w = mount(Slider, { props: { defaultValue: 500, min: 0, max: 1000, step: 1 }, attachTo: document.body })
    await thumbs(w)[0]!.trigger('keydown', { key: 'PageUp' })
    expect(output(w)).toBe('600')
    w.unmount()
  })

  it('changeEnd reports the value just committed, not the previous one', async () => {
    const w = mount(Slider, { props: { defaultValue: 50 }, attachTo: document.body })
    await nextTick()
    for (const key of ['ArrowRight', 'ArrowRight', 'ArrowLeft'])
      await thumbs(w)[0]!.trigger('keydown', { key })
    expect(w.emitted('changeEnd')).toEqual([[51], [52], [51]])
    w.unmount()
  })

  it('clamps a value outside [min, max] to the range', async () => {
    const w = mount(Slider, { props: { modelValue: 150, min: 0, max: 100 } })
    const low = mount(Slider, { props: { defaultValue: [-20, 50] } })
    // Reka fills in the thumb ARIA values on the tick after mount
    await nextTick()
    expect(output(w)).toBe('100')
    expect(thumbs(w)[0]!.attributes('aria-valuenow')).toBe('100')
    expect(thumbs(low)[0]!.attributes('aria-valuenow')).toBe('0')
  })

  it('submits one form entry per thumb under the plain `name`', () => {
    const entries = (props: Record<string, unknown>) => {
      const w = mount(() => h('form', [h(Slider, props)]))
      return [...new FormData(w.get('form').element as HTMLFormElement).entries()]
    }
    expect(entries({ name: 'volume', defaultValue: 65 })).toEqual([['volume', '65']])
    expect(entries({ name: 'price', defaultValue: [20, 60] })).toEqual([['price', '20'], ['price', '60']])
    // A disabled slider leaves its value out of the form, like a disabled input
    expect(entries({ name: 'volume', defaultValue: 65, disabled: true })).toEqual([])
    expect(entries({ defaultValue: 65 })).toEqual([])
  })

  it('the output does not announce every value change', () => {
    expect(mount(Slider).get('[data-slot=slider-output]').attributes('aria-live')).toBe('off')
  })
})
