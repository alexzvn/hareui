import { mount } from '@vue/test-utils'
import { parseColor } from 'reka-ui'
import { describe, expect, it } from 'vitest'
import type { ComponentOptions } from 'vue'
import { defineComponent, h, nextTick, ref } from 'vue'

import type { ColorFieldProps } from '@/components/color-field/ColorField.vue'
import ColorField from '@/components/color-field/ColorField.vue'
import { ColorPickerContextKey } from '@/components/color-picker/context'
import ColorSwatch from '@/components/color-swatch/ColorSwatch.vue'

import { expectAccessible } from './a11y'

const input = '[data-slot=color-input-group-input]'
const group = '[data-slot=color-input-group]'

describe('ColorField', () => {
  it('passes axe labelled, with description, invalid with an error, disabled, read-only and required', async () => {
    const cases: ColorFieldProps[] = [
      { label: 'Brand colour', defaultValue: '#0485F7' },
      { label: 'Brand colour', description: 'Used for buttons and links', defaultValue: '#0485F7' },
      {
        label: 'Brand colour',
        description: 'Used for buttons and links',
        invalid: true,
        errorMessage: 'Pick a darker colour',
      },
      { label: 'Brand colour', disabled: true, defaultValue: '#0485F7' },
      { label: 'Brand colour', readonly: true, defaultValue: '#0485F7' },
      { label: 'Brand colour', required: true },
      { label: 'Hue', channel: 'hue', colorSpace: 'hsl', defaultValue: '#0485F7' },
    ]

    for (const props of cases) {
      const wrapper = mount(ColorField, { props, attachTo: document.body })
      await expectAccessible(wrapper)
      wrapper.unmount()
    }
  })

  it('passes axe with only an aria-label and a colour swatch prefix', async () => {
    const wrapper = mount(ColorField, {
      props: { defaultValue: '#0485F7' },
      attrs: { 'aria-label': 'Hex colour' },
      slots: { prefix: () => h(ColorSwatch, { size: 'xs' }) },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('label, description and error ids resolve to the rendered text', async () => {
    const wrapper = mount(ColorField, {
      props: { label: 'Brand colour', description: 'Used for links', errorMessage: 'Too light' },
      attachTo: document.body,
    })

    const el = wrapper.get(input).element as HTMLInputElement
    expect(el.labels?.[0]?.textContent?.trim()).toBe('Brand colour')

    const described = () =>
      el
        .getAttribute('aria-describedby')!
        .split(' ')
        .map((id) => document.getElementById(id)?.textContent?.trim())

    expect(described()).toEqual(['Used for links'])

    // While invalid the error replaces the description.
    await wrapper.setProps({ invalid: true })
    expect(described()).toEqual(['Too light'])
    wrapper.unmount()
  })

  it('a validate error marks the input invalid and describes it with the message', async () => {
    const wrapper = mount(ColorField, {
      props: {
        label: 'Brand colour',
        defaultValue: '#000000',
        validationBehavior: 'aria',
        validate: (c) => (c && c.space === 'rgb' && c.r > 200 ? 'Too red' : undefined),
      },
      attachTo: document.body,
    })

    const el = wrapper.get(input)
    expect(el.attributes('aria-invalid')).toBeUndefined()
    ;(el.element as HTMLInputElement).value = '#ff0000'
    await el.trigger('input')
    await el.trigger('blur')
    expect(el.attributes('aria-invalid')).toBe('true')
    const errorId = el.attributes('aria-describedby')!
    expect(document.getElementById(errorId)?.textContent?.trim()).toBe('Too red')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('exposes required and read-only on the input', () => {
    const required = mount(ColorField, { props: { label: 'Brand colour', required: true } })
    expect(required.get(input).attributes('aria-required')).toBe('true')

    const readonly = mount(ColorField, {
      props: { label: 'Brand colour', readonly: true, defaultValue: '#0485F7' },
    })

    expect(readonly.get(input).attributes('readonly')).toBeDefined()
    required.unmount()
    readonly.unmount()
  })

  it('aria-label and aria-labelledby name the input, not the wrapper', () => {
    const wrapper = mount(ColorField, {
      attrs: { 'aria-label': 'Hex colour', 'aria-labelledby': 'heading' },
    })

    expect(wrapper.get(input).attributes('aria-label')).toBe('Hex colour')
    expect(wrapper.get(input).attributes('aria-labelledby')).toBe('heading')
    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.attributes('aria-labelledby')).toBeUndefined()
    wrapper.unmount()
  })

  it('hex mode: ArrowUp/ArrowDown step, End jumps to white and Home to black, Enter commits', async () => {
    const wrapper = mount(ColorField, {
      props: { label: 'Brand colour', defaultValue: '#000010' },
      attachTo: document.body,
    })

    const el = wrapper.get(input)
    const node = el.element as HTMLInputElement
    await el.trigger('keydown', { key: 'ArrowUp' })
    expect(node.value).toBe('#000011')
    await el.trigger('keydown', { key: 'ArrowDown' })
    expect(node.value).toBe('#000010')
    await el.trigger('keydown', { key: 'End' })
    expect(node.value).toBe('#FFFFFF')
    await el.trigger('keydown', { key: 'Home' })
    expect(node.value).toBe('#000000')
    node.value = '#00ff00'
    await el.trigger('input')
    await el.trigger('keydown', { key: 'Enter' })
    expect(node.value).toBe('#00FF00')
    expect(wrapper.emitted('update:modelValue')!.at(-1)![0]).toMatchObject({ r: 0, g: 255, b: 0 })
    wrapper.unmount()
  })

  it('read-only ignores stepping keys', async () => {
    const wrapper = mount(ColorField, {
      props: { label: 'Brand colour', readonly: true, defaultValue: '#000010' },
    })

    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    await wrapper.get(input).trigger('keydown', { key: 'End' })
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('#000010')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

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
    const wrapper = mount(ColorField, {
      props: { defaultValue: '#000000' },
      attachTo: document.body,
    })

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
    const wrapper = mount(ColorField, {
      props: { channel: 'hue', colorSpace: 'hsl', defaultValue: parseColor('#7F007F') },
    })

    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted!.at(-1)![0]).not.toMatchObject({ r: 127, g: 0, b: 127 })
  })

  it('links label, description and error to the input', () => {
    const wrapper = mount(ColorField, {
      props: {
        id: 'c',
        label: 'Color',
        description: 'Pick one',
        errorMessage: 'Bad color',
        invalid: true,
      },
    })

    const el = wrapper.get(input)
    expect(wrapper.get('label').attributes('for')).toBe('c')
    expect(el.attributes('id')).toBe('c')

    // The theme hides the description while invalid, so it's dropped from aria-describedby too
    expect(el.attributes('aria-describedby')).toBe('c-error')
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

    const wrapper = mount(ColorField, {
      props: { name: 'brand', defaultValue: '#0485F7' },
      attachTo: form,
    })

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

    expect(wrapper.find('[data-slot=color-input-group-prefix] [data-testid=prefix]').exists()).toBe(
      true,
    )

    expect(wrapper.find('[data-slot=color-input-group-suffix] [data-testid=suffix]').exists()).toBe(
      true,
    )
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
            setColor: (c: unknown) => {
              received = c
            },
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
      const wrapper = mount(
        { render: () => h('form', [h(ColorField, { name: 'color', placeholder: '#000000' })]) },
        { attachTo: document.body },
      )

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

    const mountField = (props: Record<string, unknown> = {}, inForm = false) => {
      const form = document.createElement('form')
      document.body.append(form)
      const wrapper = mount(ColorField, { props, attachTo: inForm ? form : document.body })

      return {
        wrapper,
        form,
        el: wrapper.get(input),
        node: wrapper.get(input).element as HTMLInputElement,
      }
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
      const { wrapper, node } = mountField({
        channel: 'hue',
        colorSpace: 'hsl',
        defaultValue: 'hsl(213, 50%, 50%)',
      })

      expect(node.value).toBe('213°')
      wrapper.unmount()
    })

    it('End on a hue channel field jumps to 360° instead of wrapping to 0', async () => {
      // behaviour-final-check F6
      const { wrapper, el, node } = mountField({
        channel: 'hue',
        colorSpace: 'hsl',
        defaultValue: 'hsl(213, 50%, 50%)',
      })

      await el.trigger('keydown', { key: 'End' })
      expect(node.value).toBe('360°')
      wrapper.unmount()
    })

    it('clamps a typed hue above 360 to 360 on commit', async () => {
      // behaviour-final-check F6
      const { wrapper, el, node } = mountField({
        channel: 'hue',
        colorSpace: 'hsl',
        defaultValue: 'hsl(213, 50%, 50%)',
      })

      await type(el, '400')
      await el.trigger('blur')
      expect(node.value).toBe('360°')
      wrapper.unmount()
    })

    it('PageUp on a hue channel field steps by one', async () => {
      // behaviour-final-check F6
      const { wrapper, el, node } = mountField({
        channel: 'hue',
        colorSpace: 'hsl',
        defaultValue: 'hsl(213, 50%, 50%)',
      })

      await el.trigger('keydown', { key: 'PageUp' })
      expect(node.value).toBe('214°')
      wrapper.unmount()
    })
  })
})

describe('colorField slot outlets', () => {
  it('#prefix / #suffix toggled by a parent v-if switch between custom content and no wrapper', async () => {
    const show = ref(true)
    const wrapper = mount(
      defineComponent({
        components: { ColorField },
        setup: () => ({ show }),
        template: `<ColorField default-value="#000000">
        <template v-if="show" #prefix><i data-test="pre" /></template>
        <template v-if="show" #suffix><i data-test="suf" /></template>
      </ColorField>`,
      }),
    )

    const parts = () =>
      [
        '[data-test=pre]',
        '[data-test=suf]',
        '[data-slot=color-input-group-prefix]',
        '[data-slot=color-input-group-suffix]',
      ].map((s) => wrapper.find(s).exists())

    expect(parts()).toEqual([true, true, true, true])
    show.value = false
    await nextTick()
    expect(parts()).toEqual([false, false, false, false])
    show.value = true
    await nextTick()
    expect(parts()).toEqual([true, true, true, true])
    wrapper.unmount()
  })

  it('changing only `description` does not re-render the group root', async () => {
    let groupUpdates = 0
    const countGroupUpdates: ComponentOptions = {
      updated() {
        if (this.$el instanceof Element && this.$el.matches(group)) groupUpdates++
      },
    }

    const wrapper = mount(ColorField, {
      props: { label: 'Color', description: 'A', defaultValue: '#000000' },
      slots: {
        prefix: () => h('i', { 'data-test': 'pre' }),
        suffix: () => h('i', { 'data-test': 'suf' }),
      },
      global: { mixins: [countGroupUpdates] },
    })

    // warm-up: anything settling on the first update of any kind
    await wrapper.setProps({ description: 'B' })
    groupUpdates = 0
    await wrapper.setProps({ description: 'C' })
    expect(wrapper.get('[data-slot=description]').text()).toBe('C')
    expect(wrapper.find('[data-test=pre]').exists()).toBe(true)
    expect(groupUpdates).toBe(0)
    wrapper.unmount()
  })
})
