import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Input from '@/components/input/Input.vue'
import Label from '@/components/label/Label.vue'

import { expectAccessible } from './a11y'

describe('Input', () => {
  it('defaultValue seeds an uncontrolled input, including numbers', async () => {
    const wrapper = mount(Input, { props: { type: 'number', defaultValue: 42 } })
    const input = wrapper.get('input')
    expect(input.element.value).toBe('42')
    await input.setValue('7')
    expect(input.element.value).toBe('7')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual([7])
  })

  it('a bound v-model wins over defaultValue', () => {
    const wrapper = mount(Input, {
      props: { defaultValue: 'seed', modelValue: 'bound', 'onUpdate:modelValue': () => {} },
    })

    expect(wrapper.get('input').element.value).toBe('bound')
  })

  it.each([
    ['idle', {}],
    ['disabled', { disabled: true }],
    ['read-only', { readonly: true, defaultValue: 'jane@acme.com' }],
    ['required', { required: true }],
    ['invalid', { invalid: true }],
  ])('labelled with aria-label (%s) has no axe violations', async (_, props) => {
    const wrapper = mount(Input, {
      props,
      attrs: { 'aria-label': 'Email' },
      attachTo: document.body,
    })

    expect(wrapper.get('input').attributes('aria-label')).toBe('Email')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('a standalone Label targets it through its id', async () => {
    const wrapper = mount(
      () => h('div', [h(Label, { for: 'q' }, () => 'Query'), h(Input, { id: 'q' })]),
      { attachTo: document.body },
    )

    expect(
      [...(wrapper.get('input').element as HTMLInputElement).labels!].map((l) =>
        l.textContent?.trim(),
      ),
    ).toEqual(['Query'])

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('state attributes reflect its props: aria-invalid, native disabled / readonly / required', async () => {
    const wrapper = mount(Input, { attrs: { 'aria-label': 'Email' } })
    const input = () => wrapper.get('input')
    expect(input().attributes('aria-invalid')).toBeUndefined()
    await wrapper.setProps({ invalid: true, disabled: true, readonly: true, required: true })

    expect(input().attributes()).toMatchObject({
      'aria-invalid': 'true',
      disabled: '',
      readonly: '',
      required: '',
    })

    await wrapper.setProps({ invalid: false })
    expect(input().attributes('aria-invalid')).toBeUndefined()
    wrapper.unmount()
  })

  it('keeps a consumer aria-describedby when used standalone', () => {
    const wrapper = mount(Input, {
      attrs: { 'aria-label': 'Code', 'aria-describedby': 'code-hint' },
    })

    expect(wrapper.get('input').attributes('aria-describedby')).toBe('code-hint')
    wrapper.unmount()
  })

  it('a bare Input failing validate is marked invalid', async () => {
    const wrapper = mount(Input, {
      props: {
        validate: (v: string | number) => (String(v).length < 3 ? 'Too short' : true),
        validationBehavior: 'aria',
      },
      attrs: { 'aria-label': 'Name' },
    })

    await wrapper.get('input').setValue('ab')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    await wrapper.get('input').setValue('abc')
    expect(wrapper.get('input').attributes('aria-invalid')).toBeUndefined()
    wrapper.unmount()
  })
})
