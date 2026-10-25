import { mount as rawMount } from '@vue/test-utils'
import type { Color } from 'reka-ui'
import { colorToString, parseColor } from 'reka-ui'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import ColorArea from '@/components/color-area/ColorArea.vue'
import ColorField from '@/components/color-field/ColorField.vue'
import ColorPicker from '@/components/color-picker/ColorPicker.vue'
import ColorSlider from '@/components/color-slider/ColorSlider.vue'
import ColorSwatchPicker from '@/components/color-swatch-picker/ColorSwatchPicker.vue'
import ColorSwatch from '@/components/color-swatch/ColorSwatch.vue'

import { expectAccessible } from './a11y'

const wrappers: { unmount: () => void }[] = []
const mount: typeof rawMount = (...args) => {
  const wrapper = rawMount(...args)
  wrappers.push(wrapper)

  return wrapper
}

const trigger = () => document.body.querySelector<HTMLElement>('[data-slot=color-picker-trigger]')!
const popover = () => document.body.querySelector('[data-slot=color-picker-popover]')

const swatchColor = () =>
  document.body.querySelector('[data-slot=color-swatch]')!.getAttribute('aria-label')

const slots = {
  trigger: () => h(ColorSwatch, { size: 'lg' }),
  default: () => [
    h(ColorArea, { colorSpace: 'hsb', x: { channel: 'saturation' }, y: { channel: 'brightness' } }),
    h(ColorField, { 'aria-label': 'Hex' }),
  ],
}

// Realistic HeroUI composition: a swatch plus visible text in the trigger, every popover control labelled
const fullSlots = {
  trigger: () => [h(ColorSwatch, { size: 'sm' }), h('span', 'Brand colour')],
  default: () => [
    h(ColorSwatchPicker, { items: ['#F43F5E', '#0485F7'], 'aria-label': 'Presets' }),
    h(ColorArea, {
      colorSpace: 'hsb',
      x: { channel: 'saturation' },
      y: { channel: 'brightness' },
      'aria-label': 'Colour',
    }),
    h(ColorSlider, { channel: 'hue', colorSpace: 'hsb', label: 'Hue' }),
    h(ColorField, { 'aria-label': 'Hex' }),
  ],
}

const settle = () => new Promise((resolve) => setTimeout(resolve, 30))
const open = async () => {
  trigger().click()
  await nextTick()
  await settle()
}

afterEach(() => {
  wrappers.splice(0).forEach((w) => w.unmount())
  document.body.innerHTML = ''
})

describe('ColorPicker', () => {
  it('passes axe closed, open and disabled', async () => {
    mount(ColorPicker, {
      props: { defaultValue: '#0485F7' },
      slots: fullSlots,
      attachTo: document.body,
    })

    await expectAccessible()
    await open()
    expect(popover()).not.toBeNull()
    await expectAccessible()
    wrappers.splice(0).forEach((w) => w.unmount())
    mount(ColorPicker, { props: { disabled: true }, slots: fullSlots, attachTo: document.body })
    await expectAccessible()
  })

  it('the trigger is a button that announces and controls the popover dialog', async () => {
    mount(ColorPicker, {
      props: { defaultValue: '#0485F7' },
      slots: fullSlots,
      attachTo: document.body,
    })

    const t = trigger()
    expect(t.tagName).toBe('BUTTON')
    expect(t.getAttribute('type')).toBe('button')
    expect(t.getAttribute('aria-haspopup')).toBe('dialog')
    expect(t.getAttribute('aria-expanded')).toBe('false')
    await open()
    expect(t.getAttribute('aria-expanded')).toBe('true')
    const dialog = popover()!
    expect(dialog.getAttribute('role')).toBe('dialog')
    expect(t.getAttribute('aria-controls')).toBe(dialog.id)
  })

  it('the popover dialog is named by the trigger', async () => {
    mount(ColorPicker, {
      props: { defaultValue: '#0485F7' },
      slots: fullSlots,
      attachTo: document.body,
    })

    await open()
    const labelledBy = popover()!.getAttribute('aria-labelledby')
    expect(labelledBy).toBe(trigger().id)
    expect(document.getElementById(labelledBy!)?.textContent).toContain('Brand colour')
  })

  it('opening moves focus to the popover, so Tab starts at its first control', async () => {
    mount(ColorPicker, {
      props: { defaultValue: '#0485F7' },
      slots: fullSlots,
      attachTo: document.body,
    })

    trigger().focus()
    await open()
    expect(document.activeElement).toBe(popover())
  })

  it('Escape closes the popover and returns focus to the trigger', async () => {
    const w = mount(ColorPicker, {
      props: { defaultValue: '#0485F7' },
      slots: fullSlots,
      attachTo: document.body,
    })

    trigger().focus()
    await open()
    const field = document.body.querySelector<HTMLElement>('[data-slot=color-input-group-input]')!
    field.focus()

    field.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
    )

    await nextTick()
    await settle()
    expect(w.emitted('update:open')?.at(-1)).toEqual([false])
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(document.activeElement).toBe(trigger())
  })

  it('a disabled trigger is a disabled button and does not open', async () => {
    const w = mount(ColorPicker, {
      props: { disabled: true },
      slots: fullSlots,
      attachTo: document.body,
    })

    expect(trigger().hasAttribute('disabled')).toBe(true)
    trigger().click()
    await nextTick()
    expect(w.emitted('update:open')).toBeUndefined()
    expect(popover()).toBeNull()
  })

  it('renders a closed trigger whose ColorSwatch follows the picker colour, defaulting to black', async () => {
    const w = mount(ColorPicker, { slots, attachTo: document.body })
    expect(popover()).toBeNull()
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    expect(swatchColor()).toMatch(/black/i)
    await w.setProps({ modelValue: '#FF0000' })
    expect(swatchColor()).toMatch(/red/i)
  })

  it('opens on click, portals the popover to body and feeds children from the context', async () => {
    const w = mount(ColorPicker, {
      props: { defaultValue: '#0485F7' },
      slots,
      attachTo: document.body,
    })

    trigger().click()
    await nextTick()
    await nextTick()
    expect(popover()).not.toBeNull()
    expect(w.emitted('update:open')).toEqual([[true]])

    expect(
      (
        document.body.querySelector('[data-slot=color-input-group-input]') as HTMLInputElement
      ).value.toLowerCase(),
    ).toBe('#0485f7')
  })

  it('children write to the context: typing in a ColorField updates v-model and the trigger swatch', async () => {
    const w = mount(ColorPicker, {
      props: { defaultValue: '#0485F7', defaultOpen: true },
      slots,
      attachTo: document.body,
    })

    await nextTick()

    const input = document.body.querySelector(
      '[data-slot=color-input-group-input]',
    ) as HTMLInputElement

    input.value = '#FF0000'
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
    input.dispatchEvent(new Event('blur', { bubbles: true }))
    await nextTick()
    const emitted = w.emitted('update:modelValue')!
    expect(colorToString(emitted.at(-1)![0] as Color, 'hex')).toBe('#ff0000')
    expect(swatchColor()).toMatch(/red/i)
  })

  it('is controlled by v-model and v-model:open', async () => {
    const w = mount(ColorPicker, {
      props: { modelValue: parseColor('#00FF00'), open: false },
      slots,
      attachTo: document.body,
    })

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
    mount(ColorPicker, {
      props: { defaultOpen: true },
      slots: {
        trigger: slots.trigger,
        default: (p: { color: Color; close: () => void }) => {
          close = p.close
          return h('i')
        },
      },
      attachTo: document.body,
    })

    await nextTick()
    expect(popover()).not.toBeNull()
    close()
    await nextTick()
    expect(trigger().getAttribute('aria-expanded')).toBe('false')
    mount(ColorPicker, { props: { disabled: true }, slots, attachTo: document.body })

    expect(
      document.body
        .querySelectorAll('[data-slot=color-picker-trigger]')[1]
        .hasAttribute('disabled'),
    ).toBe(true)
  })

  it('returns focus to the trigger after an outside click closes the popover', async () => {
    // behaviour-final-check P1
    const outside = document.createElement('button')
    document.body.append(outside)

    const w = mount(ColorPicker, {
      props: { defaultValue: '#0485F7' },
      slots,
      attachTo: document.body,
    })

    trigger().click()
    await nextTick()
    await nextTick()
    expect(popover()).not.toBeNull()

    outside.focus()

    outside.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        button: 0,
        pointerType: 'mouse',
        ctrlKey: false,
      }),
    )

    outside.dispatchEvent(
      new PointerEvent('pointerup', { bubbles: true, button: 0, pointerType: 'mouse' }),
    )

    outside.click()
    for (let i = 0; i < 4; i++) await nextTick()

    expect(w.emitted('update:open')?.at(-1)).toEqual([false])
    expect(document.activeElement).toBe(trigger())
    outside.remove()
  })
})
