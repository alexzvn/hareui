import { mount } from '@vue/test-utils'
import { parseColor } from 'reka-ui'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import ColorField from '../src/components/color-field/ColorField.vue'
import { ColorPickerContextKey } from '../src/components/color-picker/context'

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

  describe('empty value (React Aria null)', () => {
    it('shows an empty input without value/defaultValue while the form value stays #000000', () => {
      const wrapper = mount({ render: () => h('form', [h(ColorField, { name: 'color', placeholder: '#000000' })]) }, { attachTo: document.body })
      const node = wrapper.get(input).element as HTMLInputElement
      expect(node.value).toBe('')
      expect(node.placeholder).toBe('#000000')
      expect(new FormData(wrapper.get('form').element).get('color')).toBe('#000000')
      wrapper.unmount()
    })

    it('shows an empty input for a null modelValue and fills it when the model is set', async () => {
      const wrapper = mount(ColorField, { props: { modelValue: null } })
      const node = wrapper.get(input).element as HTMLInputElement
      expect(node.value).toBe('')
      await wrapper.setProps({ modelValue: parseColor('#EF4444') })
      expect(node.value).toBe('#EF4444')
      await wrapper.setProps({ modelValue: null })
      expect(node.value).toBe('')
    })

    it('emits null when a filled field is cleared and committed', async () => {
      const wrapper = mount(ColorField, { props: { defaultValue: '#0485F7' } })
      const el = wrapper.get(input)
      ;(el.element as HTMLInputElement).value = ''
      await el.trigger('input')
      await el.trigger('blur')
      expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([null])
      expect((el.element as HTMLInputElement).value).toBe('')
    })

    it('commits a typed colour into an empty field, including #000000', async () => {
      const wrapper = mount(ColorField)
      const el = wrapper.get(input)
      const node = el.element as HTMLInputElement
      node.value = '#000000'
      await el.trigger('input')
      await el.trigger('blur')
      expect(wrapper.emitted('update:modelValue')!.at(-1)![0]).toMatchObject({ r: 0, g: 0, b: 0 })
      expect(node.value).toBe('#000000')
    })

    it('stays empty after committing text that is not a colour', async () => {
      const wrapper = mount(ColorField)
      const el = wrapper.get(input)
      const node = el.element as HTMLInputElement
      node.value = 'zzz'
      await el.trigger('input')
      await el.trigger('blur')
      expect(node.value).toBe('')
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })
  })

  describe('behaviour parity with React Aria', () => {
    const type = async (el: ReturnType<typeof mountField>['el'], text: string) => {
      ;(el.element as HTMLInputElement).value = text
      await el.trigger('input')
    }
    function mountField(props: Record<string, unknown> = {}, inForm = false) {
      const form = document.createElement('form')
      document.body.append(form)
      const wrapper = mount(ColorField, { props, attachTo: inForm ? form : document.body })
      return { wrapper, form, el: wrapper.get(input), node: wrapper.get(input).element as HTMLInputElement }
    }

    it('submits the committed hex in lowercase (decision: React Aria submits uppercase)', () => {
      // behaviour-final-check F2: kept lowercase by user decision, see .agents/docs/decisions.md
      const { wrapper, form } = mountField({ name: 'brand', defaultValue: '#0485F7' }, true)
      expect(new FormData(form).get('brand')).toBe('#0485f7')
      wrapper.unmount()
      form.remove()
    })

    it('lets Enter inside a form trigger implicit submission after committing', async () => {
      // behaviour-final-check F3: happy-dom has no native implicit submission, so either the keydown must be left
      // un-prevented (browser submits) or the form must be submitted explicitly.
      const { wrapper, form, el } = mountField({ name: 'brand', defaultValue: '#0485F7' }, true)
      let submitted = false
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        submitted = true
      })
      await type(el, '#ff0000')
      const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true })
      el.element.dispatchEvent(enter)
      await el.trigger('keyup', { key: 'Enter' })
      expect(submitted || !enter.defaultPrevented).toBe(true)
      wrapper.unmount()
      form.remove()
    })

    it('drops the alpha digits of an 8-digit hex on commit like React Aria', async () => {
      // behaviour-final-check F4
      const { wrapper, el, node } = mountField({ defaultValue: '#FF0000' })
      await type(el, '#FF0000AA')
      await el.trigger('blur')
      expect(node.value).toBe('#FF0000')
      wrapper.unmount()
    })

    it('PageUp in hex mode steps by one like the arrow keys', async () => {
      // behaviour-final-check F5
      const { wrapper, el, node } = mountField({ defaultValue: '#0485F7' })
      await el.trigger('keydown', { key: 'PageUp' })
      expect(node.value).toBe('#0485F8')
      await el.trigger('keydown', { key: 'PageDown' })
      expect(node.value).toBe('#0485F7')
      wrapper.unmount()
    })

    it('shows the hue channel with its degree unit', () => {
      // behaviour-final-check F6
      const { wrapper, node } = mountField({ channel: 'hue', colorSpace: 'hsl', defaultValue: 'hsl(213, 50%, 50%)' })
      expect(node.value).toBe('213°')
      wrapper.unmount()
    })

    it('End on a hue channel field jumps to 360° instead of wrapping to 0', async () => {
      // behaviour-final-check F6
      const { wrapper, el, node } = mountField({ channel: 'hue', colorSpace: 'hsl', defaultValue: 'hsl(213, 50%, 50%)' })
      await el.trigger('keydown', { key: 'End' })
      expect(node.value).toBe('360°')
      wrapper.unmount()
    })

    it('clamps a typed hue above 360 to 360 on commit', async () => {
      // behaviour-final-check F6
      const { wrapper, el, node } = mountField({ channel: 'hue', colorSpace: 'hsl', defaultValue: 'hsl(213, 50%, 50%)' })
      await type(el, '400')
      await el.trigger('blur')
      expect(node.value).toBe('360°')
      wrapper.unmount()
    })

    it('PageUp on a hue channel field steps by one', async () => {
      // behaviour-final-check F6
      const { wrapper, el, node } = mountField({ channel: 'hue', colorSpace: 'hsl', defaultValue: 'hsl(213, 50%, 50%)' })
      await el.trigger('keydown', { key: 'PageUp' })
      expect(node.value).toBe('214°')
      wrapper.unmount()
    })
  })
})
