import { mount } from '@vue/test-utils'
import { parseColor } from 'reka-ui'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import ColorSlider from '../src/components/color-slider/ColorSlider.vue'
import { ColorPickerContextKey } from '../src/components/color-picker/context'

const thumb = '[data-slot=color-slider-thumb]'
const track = '[data-slot=color-slider-track]'

describe('colorSlider', () => {
  it('renders label, output, track and thumb with the channel value', () => {
    const wrapper = mount(ColorSlider, { props: { channel: 'hue', label: 'Hue', defaultValue: 'hsl(120, 100%, 50%)' } })
    expect(wrapper.get('[data-slot=label]').text()).toBe('Hue')
    expect(wrapper.get('[data-slot=color-slider-output]').text()).toBe('120°')
    expect(wrapper.find(track).exists()).toBe(true)
    expect(wrapper.get(thumb).attributes('aria-label')).toBe('Hue')
  })

  it('formats alpha as a percentage and omits the output without a label', () => {
    const a = mount(ColorSlider, { props: { channel: 'alpha', label: 'Alpha', defaultValue: 'hsla(0, 100%, 50%, 0.5)' } })
    expect(a.get('[data-slot=color-slider-output]').text()).toBe('50%')
    const b = mount(ColorSlider, { props: { channel: 'hue', 'aria-label': 'Hue' } as any })
    expect(b.find('[data-slot=color-slider-output]').exists()).toBe(false)
    expect(b.find('[data-slot=label]').exists()).toBe(false)
  })

  it('commits a Color object when a key moves the thumb', async () => {
    const wrapper = mount(ColorSlider, { props: { channel: 'hue', defaultValue: parseColor('hsl(100, 100%, 50%)') }, attachTo: document.body })
    await wrapper.get(thumb).trigger('keydown', { key: 'ArrowRight' })
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted!.at(-1)![0]).toMatchObject({ h: 101 })
    wrapper.unmount()
  })

  it('follows an external modelValue', async () => {
    const wrapper = mount(ColorSlider, { props: { channel: 'hue', label: 'Hue', modelValue: parseColor('hsl(10, 100%, 50%)') } })
    expect(wrapper.get('[data-slot=color-slider-output]').text()).toBe('10°')
    await wrapper.setProps({ modelValue: parseColor('hsl(200, 100%, 50%)') })
    expect(wrapper.get('[data-slot=color-slider-output]').text()).toBe('200°')
  })

  it('corrects an incompatible colorSpace with a dev warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount(ColorSlider, { props: { channel: 'red', colorSpace: 'hsl', label: 'Red', defaultValue: 'rgb(255, 100, 50)' } })
    expect(warn).toHaveBeenCalled()
    expect(wrapper.get('[data-slot=color-slider-output]').text()).toBe('255')
    warn.mockRestore()
  })

  it('marks the root disabled and orientation on the track', () => {
    const wrapper = mount(ColorSlider, { props: { channel: 'hue', disabled: true, orientation: 'vertical', 'aria-label': 'Hue' } as any })
    expect(wrapper.get('[data-slot=color-slider]').attributes('data-disabled')).toBeDefined()
    expect(wrapper.get(track).attributes('data-orientation')).toBe('vertical')
  })

  it('sets edge colors and a checkerboard gradient on the track', () => {
    const wrapper = mount(ColorSlider, { props: { channel: 'alpha', defaultValue: '#ff0000', 'aria-label': 'Alpha' } as any })
    const style = wrapper.get(track).attributes('style')!
    expect(style).toContain('--track-start-color')
    expect(style).toContain('--track-end-color')
    expect(style).toContain('repeating-conic-gradient')
  })

  it('uses the enclosing ColorPicker colour and forwards commits when uncontrolled', async () => {
    let received: unknown
    const wrapper = mount({ setup: () => () => h(ColorSlider, { channel: 'hue', label: 'Hue' }) }, {
      attachTo: document.body,
      global: {
        provide: {
          [ColorPickerContextKey as unknown as string]: {
            color: { value: parseColor('hsl(50, 100%, 50%)') },
            setColor: (c: unknown) => { received = c },
          },
        },
      },
    })
    expect(wrapper.get('[data-slot=color-slider-output]').text()).toBe('50°')
    await wrapper.get(thumb).trigger('keydown', { key: 'ArrowRight' })
    expect(received).toMatchObject({ h: 51 })
    wrapper.unmount()
  })

  it('exposes the alpha channel value on a 0..1 scale like React Aria', async () => {
    // behaviour-final-check S1
    const wrapper = mount(ColorSlider, { props: { channel: 'alpha', label: 'Alpha', defaultValue: 'hsla(0, 100%, 50%, 0.5)' } })
    await nextTick()
    expect(wrapper.get(thumb).attributes('aria-valuenow')).toBe('0.5')
  })

  it('submits the channel value under `name` inside a form', () => {
    // behaviour-final-check S2
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(ColorSlider, { props: { channel: 'hue', name: 'hue', label: 'Hue', defaultValue: 'hsl(200, 100%, 50%)' }, attachTo: form })
    expect(new FormData(form).get('hue')).toBe('200')
    wrapper.unmount()
    form.remove()
  })
})
