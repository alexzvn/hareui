import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { ComponentOptions } from 'vue'
import { defineComponent, h, nextTick, ref } from 'vue'

import Input from '@/components/input/Input.vue'
import TextField from '@/components/text-field/TextField.vue'

import { expectAccessible } from './a11y'

describe('TextField', () => {
  it('aria-describedby lists only the rendered description and error ids', async () => {
    const wrapper = mount(TextField, { props: { id: 'email', label: 'Email' } })
    const input = () => wrapper.get('input')
    expect(input().attributes('aria-describedby')).toBeUndefined()

    await wrapper.setProps({ description: 'Help' })
    expect(input().attributes('aria-describedby')).toBe('email-description')
    expect(wrapper.get('#email-description').text()).toBe('Help')

    // errorMessage without invalid renders nothing
    await wrapper.setProps({ errorMessage: 'Bad' })
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(false)
    expect(input().attributes('aria-describedby')).toBe('email-description')

    await wrapper.setProps({ invalid: true })

    // The theme hides the description while invalid, so it's dropped from the DOM and aria-describedby too
    expect(input().attributes('aria-describedby')).toBe('email-error')
    expect(wrapper.find('#email-description').exists()).toBe(false)
  })

  it('invalid sets aria-invalid on the input and shows errorMessage', () => {
    const wrapper = mount(TextField, {
      props: { invalid: true, errorMessage: 'Please enter a valid email' },
    })

    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('Please enter a valid email')
  })

  it('label targets the input and v-model syncs both ways', async () => {
    const wrapper = mount(TextField, {
      props: {
        label: 'Name',
        modelValue: 'a',
        'onUpdate:modelValue': (v: string | number | undefined) =>
          wrapper.setProps({ modelValue: v }),
      },
    })

    const input = wrapper.get('input')
    expect(wrapper.get('label').attributes('for')).toBe(input.attributes('id'))
    expect((input.element as HTMLInputElement).value).toBe('a')
    await input.setValue('abc')
    expect(wrapper.props('modelValue')).toBe('abc')
  })

  it('an Input in the default slot reads field state, explicit props win', () => {
    const wrapper = mount(TextField, {
      props: { id: 'f', disabled: true, invalid: true, description: 'Help' },
      slots: {
        default: () => [
          h(Input, { 'data-test': 'ctx' }),
          h(Input, { 'data-test': 'own', id: 'own', disabled: false }),
        ],
      },
    })

    const ctx = wrapper.get('[data-test=ctx]')
    expect(ctx.attributes('id')).toBe('f')
    expect(ctx.attributes('disabled')).toBeDefined()
    expect(ctx.attributes('aria-invalid')).toBe('true')

    // Invalid: the description is dropped, and no error message exists, so nothing describes the input
    expect(ctx.attributes('aria-describedby')).toBeUndefined()
    const own = wrapper.get('[data-test=own]')
    expect(own.attributes('id')).toBe('own')
    expect(own.attributes('disabled')).toBeUndefined()
  })

  it('defaultValue seeds an uncontrolled field; v-model wins when bound', async () => {
    const wrapper = mount(TextField, { props: { defaultValue: 'jane' } })
    const input = wrapper.get('input')
    expect(input.element.value).toBe('jane')
    await input.setValue('john')
    expect(input.element.value).toBe('john')

    const bound = mount(TextField, {
      props: { defaultValue: 'jane', modelValue: 'bound', 'onUpdate:modelValue': () => {} },
    })

    expect(bound.get('input').element.value).toBe('bound')
  })

  it('readonly reaches the default and slotted Input', () => {
    const wrapper = mount(TextField, { props: { readonly: true } })
    expect(wrapper.get('input').attributes('readonly')).toBeDefined()
    expect(wrapper.attributes('data-readonly')).toBe('true')

    const slotted = mount(TextField, {
      props: { readonly: true },
      slots: { default: () => h(Input) },
    })

    expect(slotted.get('input').attributes('readonly')).toBeDefined()
  })

  it('tracks focus within the field', async () => {
    const wrapper = mount(TextField, { attachTo: document.body })
    await wrapper.get('input').trigger('focusin')
    expect(wrapper.attributes('data-focus-within')).toBe('true')
    await wrapper.get('input').trigger('focusout')
    expect(wrapper.attributes('data-focus-within')).toBeUndefined()
    wrapper.unmount()
  })

  it('aria-label names the input, not the wrapper; other attrs stay on the wrapper', () => {
    const wrapper = mount(TextField, { attrs: { 'aria-label': 'Email', 'data-testid': 'field' } })
    expect(wrapper.get('input').attributes('aria-label')).toBe('Email')
    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.attributes('data-testid')).toBe('field')

    const slotted = mount(TextField, {
      attrs: { 'aria-labelledby': 'heading' },
      slots: { default: () => h(Input) },
    })

    expect(slotted.get('input').attributes('aria-labelledby')).toBe('heading')
  })

  it.each([
    ['idle', {}],
    ['with description', { description: 'We never share it.' }],
    [
      'invalid with error message',
      { description: 'We never share it.', invalid: true, errorMessage: 'Enter a valid email' },
    ],
    ['disabled', { disabled: true }],
    ['read-only', { readonly: true, defaultValue: 'jane@acme.com' }],
    ['required', { required: true }],
  ])(
    'labelled by its label (%s), it has no axe violations',
    async (_, props: Record<string, unknown>) => {
      const wrapper = mount(TextField, {
        props: { label: 'Email', type: 'email', ...props },
        attachTo: document.body,
      })

      const input = wrapper.get('input').element as HTMLInputElement
      expect([...input.labels!].map((l) => l.textContent?.trim())).toEqual(['Email'])
      await expectAccessible(wrapper)
      wrapper.unmount()
    },
  )

  it('without a visible label, aria-label alone names the input with no axe violations', async () => {
    const wrapper = mount(TextField, { attrs: { 'aria-label': 'Search' }, attachTo: document.body })
    expect(wrapper.find('label').exists()).toBe(false)
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('merges a consumer aria-describedby with its own description and error ids, which resolve to their text', async () => {
    const wrapper = mount(
      () =>
        h('div', [
          h('p', { id: 'policy' }, 'See our policy'),
          h(TextField, {
            id: 'e',
            label: 'Email',
            description: 'Work address',
            invalid: true,
            errorMessage: 'Required',
            'aria-describedby': 'policy',
          }),
        ]),
      { attachTo: document.body },
    )

    const ids = wrapper.get('input').attributes('aria-describedby')!.split(' ')

    // The description is dropped while invalid
    expect(ids).toEqual(['policy', 'e-error'])

    expect(ids.map((id) => document.getElementById(id)?.textContent?.trim())).toEqual([
      'See our policy',
      'Required',
    ])

    expect(wrapper.find('[data-slot=textfield]').attributes('aria-describedby')).toBeUndefined()
    wrapper.unmount()
  })

  it('a failed validate marks the input invalid and describes it with the message; fixing it clears both', async () => {
    const wrapper = mount(TextField, {
      props: {
        id: 'n',
        label: 'Name',
        validate: (v: string | number) => (String(v).length < 3 ? 'At least 3 characters' : null),
      },
    })

    const input = wrapper.get('input')
    await input.setValue('ab')
    await input.trigger('change')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(input.attributes('aria-describedby')).toBe('n-error')
    expect(wrapper.get('#n-error').text()).toBe('At least 3 characters')
    await input.setValue('abc')
    await input.trigger('change')
    expect(input.attributes('aria-invalid')).toBeUndefined()
    expect(input.attributes('aria-describedby')).toBeUndefined()
    wrapper.unmount()
  })

  it('autocomplete reaches the input, so its purpose is programmatically determinable', () => {
    const wrapper = mount(TextField, {
      props: { label: 'Email' },
      attrs: { autocomplete: 'email' },
    })

    expect(wrapper.get('input').attributes('autocomplete')).toBe('email')
    expect(wrapper.attributes('autocomplete')).toBeUndefined()
    wrapper.unmount()
  })
})

describe('TextField model parity', () => {
  // behaviour-final-check: RAC's onChange does not fire for the default value
  it('does not emit update:modelValue on mount with defaultValue, but still shows and submits it', async () => {
    const wrapper = mount(TextField, { props: { defaultValue: 'jane', name: 'user' } })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    const input = wrapper.get('input')
    expect((input.element as HTMLInputElement).value).toBe('jane')
    await input.setValue('janet')
    expect(wrapper.emitted('update:modelValue')).toEqual([['janet']])
  })
})

describe('TextField label / description / error slots', () => {
  it('changing only `description` does not re-render the label', async () => {
    let labelUpdates = 0
    const countLabelUpdates: ComponentOptions = {
      updated() {
        if (this.$el instanceof Element && this.$el.matches('[data-slot=label]')) labelUpdates++
      },
    }

    const wrapper = mount(TextField, {
      props: { label: 'Email', description: 'A' },
      global: { mixins: [countLabelUpdates] },
    })

    await wrapper.setProps({ description: 'B' })
    expect(wrapper.get('[data-slot=description]').text()).toBe('B')
    await wrapper.setProps({ description: undefined })
    expect(wrapper.find('[data-slot=description]').exists()).toBe(false)
    expect(wrapper.get('[data-slot=label]').text()).toBe('Email')
    expect(labelUpdates).toBe(0)
  })

  it('#label, #description and #error render inside the same elements the prop text would', async () => {
    const wrapper = mount(TextField, {
      props: { id: 'f' },
      slots: {
        label: () => h('b', { 'data-test': 'label' }, 'Custom label'),
        description: () => h('b', { 'data-test': 'description' }, 'Custom help'),
        error: () => h('b', { 'data-test': 'error' }, 'Custom error'),
      },
    })

    const label = wrapper.get('[data-slot=label]')
    expect(label.element.tagName).toBe('LABEL')
    expect(label.attributes('for')).toBe('f')
    expect(label.find('[data-test=label]').exists()).toBe(true)
    const description = wrapper.get('[data-slot=description]')
    expect(description.attributes('id')).toBe('f-description')
    expect(description.find('[data-test=description]').exists()).toBe(true)
    expect(wrapper.get('input').attributes('aria-describedby')).toBe('f-description')

    // The error renders while invalid, which drops the description
    await wrapper.setProps({ invalid: true })
    const error = wrapper.get('[data-slot=field-error]')
    expect(error.attributes('id')).toBe('f-error')
    expect(error.find('[data-test=error]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=description]').exists()).toBe(false)
    expect(wrapper.get('input').attributes('aria-describedby')).toBe('f-error')
  })

  it('a #label slot that renders nothing falls back to the `label` prop', () => {
    const wrapper = mount(
      defineComponent({
        components: { TextField },
        template:
          '<TextField id="f" label="Email"><template #label><span v-if="false" /></template></TextField>',
      }),
    )

    const label = wrapper.get('[data-slot=label]')
    expect(label.text()).toBe('Email')
    expect(label.find('span').exists()).toBe(false)
    expect(label.attributes('for')).toBe('f')
  })

  it('a parent toggling `<template v-if #label>` switches between slot content and the `label` prop', async () => {
    const isCustomLabelShown = ref(true)
    const wrapper = mount(
      defineComponent({
        components: { TextField },
        setup: () => ({ isCustomLabelShown }),
        template:
          '<TextField id="f" label="Email"><template v-if="isCustomLabelShown" #label><b data-test="custom">Custom</b></template></TextField>',
      }),
    )

    const label = () => wrapper.get('[data-slot=label]')
    expect(label().find('[data-test=custom]').exists()).toBe(true)
    expect(label().text()).toBe('Custom')

    isCustomLabelShown.value = false
    await nextTick()
    expect(label().find('[data-test=custom]').exists()).toBe(false)
    expect(label().text()).toBe('Email')
    expect(label().attributes('for')).toBe('f')

    isCustomLabelShown.value = true
    await nextTick()
    expect(label().find('[data-test=custom]').exists()).toBe(true)
    expect(label().text()).toBe('Custom')
  })
})
