import { mount } from '@vue/test-utils'
import { parseColor } from 'reka-ui'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ColorField from '../src/components/ColorField.vue'
import { ColorPickerContextKey } from '../src/components/colorPickerContext'

const input = '[data-slot=color-input-group-input]'
const group = '[data-slot=color-input-group]'

describe('colorField', () => {
  it('commits a typed hex value on blur and emits update:modelValue', async () => {
    const wrapper = mount(ColorField, { props: { defaultValue: '#000000' } })
    const el = wrapper.get(input)
    ;(el.element as HTMLInputElement).value = '#ff0000'
    await el.trigger('input')
    await el.trigger('blur')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted!.at(-1)![0]).toMatchObject({ r: 255, g: 0, b: 0 })
  })

  it('follows external modelValue changes', async () => {
    const wrapper = mount(ColorField, { props: { modelValue: parseColor('#0485F7') } })
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('#0485F7')
    await wrapper.setProps({ modelValue: parseColor('#10B981') })
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('#10B981')
  })

  it('keeps typed text as typed, then shows the committed hex in uppercase like React Aria', async () => {
    const wrapper = mount(ColorField, { props: { defaultValue: '#000000' }, attachTo: document.body })
    const el = wrapper.get(input)
    const node = el.element as HTMLInputElement
    node.value = '#abcdef'
    await el.trigger('input')
    expect(node.value).toBe('#abcdef')
    await el.trigger('blur')
    expect(node.value).toBe('#ABCDEF')
    wrapper.unmount()
  })

  it('steps the hue channel with the arrow keys', async () => {
    const wrapper = mount(ColorField, { props: { channel: 'hue', colorSpace: 'hsl', defaultValue: parseColor('#7F007F') } })
    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted!.at(-1)![0]).not.toMatchObject({ r: 127, g: 0, b: 127 })
  })

  it('links label, description and error to the input', () => {
    const wrapper = mount(ColorField, { props: { id: 'c', label: 'Color', description: 'Pick one', errorMessage: 'Bad color', invalid: true } })
    const el = wrapper.get(input)
    expect(wrapper.get('label').attributes('for')).toBe('c')
    expect(el.attributes('id')).toBe('c')
    expect(el.attributes('aria-describedby')).toBe('c-description c-error')
    expect(el.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get(group).attributes('data-invalid')).toBe('true')
  })

  it('disables the group and input when disabled', () => {
    const wrapper = mount(ColorField, { props: { disabled: true } })
    expect(wrapper.get(group).attributes('data-disabled')).toBeDefined()
    expect(wrapper.get(input).attributes('disabled')).toBeDefined()
  })

  it('submits the hex string under `name`', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(ColorField, { props: { name: 'brand', defaultValue: '#0485F7' }, attachTo: form })
    expect(new FormData(form).get('brand')).toBe('#0485f7')
    const el = wrapper.get(input)
    ;(el.element as HTMLInputElement).value = '#ff0000'
    await el.trigger('input')
    await el.trigger('blur')
    expect(new FormData(form).get('brand')).toBe('#ff0000')
    wrapper.unmount()
    form.remove()
  })

  it('renders prefix and suffix slots', () => {
    const wrapper = mount(ColorField, {
      slots: {
        prefix: () => h('span', { 'data-testid': 'prefix' }),
        suffix: () => h('span', { 'data-testid': 'suffix' }),
      },
    })
    expect(wrapper.find('[data-slot=color-input-group-prefix] [data-testid=prefix]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=color-input-group-suffix] [data-testid=suffix]').exists()).toBe(true)
  })

  it('falls back to the enclosing ColorPicker context color and forwards commits to it when uncontrolled', async () => {
    const color = parseColor('#D946EF')
    let received: unknown
    const Wrapper = {
      setup() {
        return () => h(ColorField, {})
      },
    }
    const wrapper = mount(Wrapper, {
      global: {
        provide: {
          [ColorPickerContextKey as unknown as string]: {
            color: { value: color },
            setColor: (c: unknown) => { received = c },
          },
        },
      },
    })
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('#D946EF')
    const el = wrapper.get(input)
    ;(el.element as HTMLInputElement).value = '#00ff00'
    await el.trigger('input')
    await el.trigger('blur')
    expect(received).toMatchObject({ r: 0, g: 255, b: 0 })
  })
})
