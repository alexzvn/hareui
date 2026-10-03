import { mount } from '@vue/test-utils'
import { colorToString, parseColor } from 'reka-ui'
import { describe, expect, it } from 'vitest'
import ColorArea from '../src/components/color-area/ColorArea.vue'
import { ColorPickerContextKey } from '../src/components/color-picker/context'

const area = '[data-slot=color-area]'
const thumb = '[data-slot=color-area-thumb]'

describe('colorArea', () => {
  it('renders the area with a slider thumb exposing both channels', () => {
    const wrapper = mount(ColorArea, { props: { defaultValue: 'hsb(219, 58%, 93%)', xChannel: 'saturation', yChannel: 'brightness' } })
    expect(wrapper.find(area).exists()).toBe(true)
    const t = wrapper.find(thumb)
    expect(t.attributes('role')).toBe('slider')
    expect(t.attributes('aria-valuetext')).toContain('Saturation 58')
    expect(t.attributes('aria-valuetext')).toContain('Brightness 93')
  })

  it('arrow keys move the thumb and emit update:modelValue and change', async () => {
    const wrapper = mount(ColorArea, { props: { modelValue: parseColor('hsb(200, 50%, 50%)'), xChannel: 'saturation', yChannel: 'brightness' } })
    await wrapper.find(thumb).trigger('keydown', { key: 'ArrowRight' })
    const updates = wrapper.emitted('update:modelValue')!
    expect(colorToString(updates.at(-1)![0] as any, 'hsb')).toBe('hsb(200, 51%, 50%)')
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('derives default channels from the colour space like React Aria', () => {
    const hsl = mount(ColorArea, { props: { defaultValue: 'hsl(200, 100%, 50%)' } })
    expect(hsl.find(thumb).attributes('aria-valuetext')).toContain('Hue 200, Saturation 100')
    const rgb = mount(ColorArea, { props: { defaultValue: 'rgb(255, 100, 50)' } })
    expect(rgb.find(thumb).attributes('aria-valuetext')).toContain('Red 255, Green 100')
  })

  it('xChannel and yChannel select which channels the thumb reports', () => {
    const wrapper = mount(ColorArea, {
      props: { colorSpace: 'rgb', xChannel: 'red', yChannel: 'green', defaultValue: 'rgb(255, 100, 50)' },
    })
    const text = wrapper.find(thumb).attributes('aria-valuetext')
    expect(text).toContain('Red 255')
    expect(text).toContain('Green 100')
  })

  it('disabled marks area and thumb and removes the thumb from the tab order', () => {
    const wrapper = mount(ColorArea, { props: { disabled: true, defaultValue: '#0485F7' } })
    expect(wrapper.find(area).attributes('data-disabled')).toBeDefined()
    expect(wrapper.find(thumb).attributes('tabindex')).toBeUndefined()
  })

  it('showDots adds the dot overlay classes', () => {
    const on = mount(ColorArea, { props: { showDots: true, defaultValue: '#0485F7' } })
    const off = mount(ColorArea, { props: { defaultValue: '#0485F7' } })
    expect(on.find(area).classes().join(' ')).toContain('after:')
    expect(off.find(area).classes().join(' ')).not.toContain('after:')
  })

  it('a user class on the root is merged and wins over the default size', () => {
    const wrapper = mount(ColorArea, { props: { class: 'size-44 rounded-3xl', defaultValue: '#0485F7' } })
    const cls = wrapper.find(area).classes()
    expect(cls).toContain('size-44')
    expect(cls).toContain('rounded-3xl')
    expect(cls).not.toContain('rounded-2xl')
  })

  it('inside a ColorPicker, reads the context colour and writes commits back', async () => {
    const commits: unknown[] = []
    const wrapper = mount(ColorArea, {
      props: { xChannel: 'saturation', yChannel: 'brightness' },
      global: {
        provide: {
          [ColorPickerContextKey as unknown as string]: {
            color: { value: parseColor('hsb(200, 50%, 50%)') },
            setColor: (c: unknown) => commits.push(c),
          },
        },
      },
    })
    expect(wrapper.find(thumb).attributes('aria-valuetext')).toContain('Saturation 50')
    await wrapper.find(thumb).trigger('keydown', { key: 'ArrowUp' })
    expect(commits.length).toBe(1)
  })

  it('data-focus-visible follows keyboard modality, not a pointer-initiated focus', async () => {
    const wrapper = mount(ColorArea, { attachTo: document.body, props: { defaultValue: '#0485F7' } })
    const t = wrapper.find(thumb)
    await wrapper.find(area).trigger('pointerdown', { pointerId: 1 })
    ;(t.element as HTMLElement).focus()
    await wrapper.vm.$nextTick()
    expect(t.attributes('data-focus-visible')).toBeUndefined()
    await t.trigger('keydown', { key: 'ArrowRight' })
    expect(t.attributes('data-focus-visible')).toBe('true')
    wrapper.unmount()
  })

  it('reports HSB saturation for a hex model value when colorSpace is hsb', () => {
    // behaviour-final-check H10 / A1: #F43F5E is hsb(349.7, 74%, 96%) but hsl(349.7, 89%, 60%)
    const wrapper = mount(ColorArea, {
      props: { defaultValue: '#F43F5E', colorSpace: 'hsb', xChannel: 'saturation', yChannel: 'brightness' },
    })
    const text = wrapper.find(thumb).attributes('aria-valuetext')
    expect(text).toContain('Saturation 74')
    expect(text).toContain('Brightness 96')
  })

  it('keeps the thumb at the HSB saturation when a hex v-model arrives from outside', async () => {
    // behaviour-final-check H10 / A1
    const wrapper = mount(ColorArea, {
      props: { modelValue: '#000000', colorSpace: 'hsb', xChannel: 'saturation', yChannel: 'brightness' },
    })
    await wrapper.setProps({ modelValue: '#22C55E' })
    // #22C55E is hsb(142.1, 83%, 77%) but hsl(142.1, 71%, 45%)
    expect(wrapper.find(thumb).attributes('aria-valuetext')).toContain('Saturation 83')
  })
})
