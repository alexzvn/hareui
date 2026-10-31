import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Input from '@/components/input/Input.vue'
import Label from '@/components/label/Label.vue'
import type { ModelModifiers } from '@/utils/modelModifiers'

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

describe('Input v-model modifiers', () => {
  // Starts from a typed value, as clearing a field does
  const typeInto = async (modelModifiers: ModelModifiers | undefined, text: string) => {
    const wrapper = mount(Input, {
      props: { modelValue: 'Ada', modelModifiers },
      attrs: { 'aria-label': 'Name' },
    })

    await wrapper.get('input').setValue(text)
    const emitted = wrapper.emitted('update:modelValue')?.at(-1)
    wrapper.unmount()

    return emitted
  }

  it('without modifiers emits the text as typed', async () => {
    expect(await typeInto(undefined, ' 42 ')).toEqual([' 42 '])
  })

  it('without modifiers emits an emptied input as an empty string', async () => {
    expect(await typeInto(undefined, '')).toEqual([''])
  })

  it('trim emits the text without surrounding whitespace', async () => {
    expect(await typeInto({ trim: true }, '  Grace  ')).toEqual(['Grace'])
  })

  it('number emits numeric text as a number', async () => {
    expect(await typeInto({ number: true }, '3.5')).toEqual([3.5])
  })

  it('number keeps text that is not a number', async () => {
    expect(await typeInto({ number: true }, 'abc')).toEqual(['abc'])
  })

  it('nullable emits null for an emptied input', async () => {
    expect(await typeInto({ nullable: true }, '')).toEqual([null])
  })

  it('optional emits undefined for an emptied input', async () => {
    expect(await typeInto({ optional: true }, '')).toEqual([undefined])
  })

  it('trim with nullable emits null for whitespace-only text', async () => {
    expect(await typeInto({ trim: true, nullable: true }, '   ')).toEqual([null])
  })

  it('lazy emits on change, not on input', async () => {
    const wrapper = mount(Input, {
      props: { modelModifiers: { lazy: true } },
      attrs: { 'aria-label': 'Name' },
    })

    const input = wrapper.get('input')
    input.element.value = 'Ada'
    await input.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toEqual([['Ada']])
    wrapper.unmount()
  })
})
