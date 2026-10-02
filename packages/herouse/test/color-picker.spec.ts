import { mount as rawMount } from '@vue/test-utils'
import { colorToString, parseColor } from 'reka-ui'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import ColorArea from '../src/components/ColorArea.vue'
import ColorField from '../src/components/ColorField.vue'
import ColorPicker from '../src/components/ColorPicker.vue'
import ColorSwatch from '../src/components/ColorSwatch.vue'

const wrappers: { unmount: () => void }[] = []
const mount = ((...a: any[]) => {
  const w = (rawMount as any)(...a)
  wrappers.push(w)
  return w
}) as typeof rawMount

const trigger = () => document.body.querySelector<HTMLElement>('[data-slot=color-picker-trigger]')!
const popover = () => document.body.querySelector('[data-slot=color-picker-popover]')
const swatchColor = () => document.body.querySelector('[data-slot=color-swatch]')!.getAttribute('aria-label')

const slots = {
  trigger: () => h(ColorSwatch, { size: 'lg' }),
  default: () => [h(ColorArea, { colorSpace: 'hsb', xChannel: 'saturation', yChannel: 'brightness' }), h(ColorField, { 'aria-label': 'Hex' })],
}

afterEach(() => {
  wrappers.splice(0).forEach(w => w.unmount())
  document.body.innerHTML = ''
})

describe('colorPicker', () => {
  it('renders a closed trigger whose ColorSwatch follows the picker colour, defaulting to black', async () => {
    const w = mount(ColorPicker, { slots, attachTo: document.body })
    expect(popover()).toBeNull()
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(swatchColor()).toMatch(/black/i)
    await w.setProps({ modelValue: '#FF0000' })
    expect(swatchColor()).toMatch(/red/i)
  })

  it('opens on click, portals the popover to body and feeds children from the context', async () => {
    const w = mount(ColorPicker, { props: { defaultValue: '#0485F7' }, slots, attachTo: document.body })
    trigger().click()
    await nextTick()
    await nextTick()
    expect(popover()).not.toBeNull()
    expect(w.emitted('update:open')).toEqual([[true]])
    expect((document.body.querySelector('[data-slot=color-input-group-input]') as HTMLInputElement).value.toLowerCase()).toBe('#0485f7')
  })

  it('children write to the context: typing in a ColorField updates v-model and the trigger swatch', async () => {
    const w = mount(ColorPicker, { props: { defaultValue: '#0485F7', defaultOpen: true }, slots, attachTo: document.body })
    await nextTick()
    const input = document.body.querySelector('[data-slot=color-input-group-input]') as HTMLInputElement
    input.value = '#FF0000'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
    input.dispatchEvent(new Event('blur', { bubbles: true }))
    await nextTick()
    const emitted = w.emitted('update:modelValue')!
    expect(colorToString(emitted.at(-1)![0] as any, 'hex')).toBe('#ff0000')
    expect(swatchColor()).toMatch(/red/i)
  })

  it('is controlled by v-model and v-model:open', async () => {
    const w = mount(ColorPicker, { props: { modelValue: parseColor('#00FF00'), open: false }, slots, attachTo: document.body })
    trigger().click()
    await nextTick()
    expect(popover()).toBeNull()
    expect(w.emitted('update:open')).toEqual([[true]])
    await w.setProps({ open: true })
    await nextTick()
    expect(popover()).not.toBeNull()
    expect(swatchColor()).toMatch(/green|lime/i)
  })

  it('exposes close() to the default slot and disables the trigger', async () => {
    let close!: () => void
    mount(ColorPicker, { props: { defaultOpen: true }, slots: { trigger: slots.trigger, default: (p: any) => { close = p.close; return h('i') } }, attachTo: document.body })
    await nextTick()
    expect(popover()).not.toBeNull()
    close()
    await nextTick()
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    mount(ColorPicker, { props: { disabled: true }, slots, attachTo: document.body })
    expect(document.body.querySelectorAll('[data-slot=color-picker-trigger]')[1].hasAttribute('disabled')).toBe(true)
  })
})
