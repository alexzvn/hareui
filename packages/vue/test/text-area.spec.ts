import { enableAutoUnmount, mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'

import TextArea from '@/components/text-area/TextArea.vue'
import TextField from '@/components/text-field/TextField.vue'
import type { ModelModifiers } from '@/utils/modelModifiers'

import { expectAccessible } from './a11y'

// A failing assertion must not leave a mounted field (and its colliding `useId()` ids) behind for the next test.
enableAutoUnmount(afterEach)

describe('TextArea', () => {
  it('renders a textarea with HeroUI data-slot and forwards native attributes', () => {
    const wrapper = mount(TextArea, { attrs: { rows: 6, 'aria-label': 'Notes' } })
    const el = wrapper.get('textarea')
    expect(el.attributes('data-slot')).toBe('textarea')
    expect(el.attributes('rows')).toBe('6')
    expect(el.attributes('aria-label')).toBe('Notes')
  })

  it('supports v-model and defaultValue', async () => {
    const wrapper = mount(TextArea, { props: { defaultValue: 'seed' } })
    const el = wrapper.get('textarea')
    expect(el.element.value).toBe('seed')
    await el.setValue('typed')
    expect(wrapper.emitted('update:modelValue')!.at(-1)).toEqual(['typed'])
  })

  it('inside a TextField takes the field id, description and value', async () => {
    const wrapper = mount(TextField, {
      props: { label: 'Message', description: 'Max 500', defaultValue: 'hi' },
      slots: { default: () => h(TextArea) },
    })

    const el = wrapper.get('textarea')
    expect(wrapper.get('label').attributes('for')).toBe(el.attributes('id'))

    expect(el.attributes('aria-describedby')).toBe(
      wrapper.get('[data-slot="description"]').attributes('id'),
    )

    expect(el.element.value).toBe('hi')
  })

  it('marks itself invalid when a bare TextArea fails validate', async () => {
    const wrapper = mount(TextArea, {
      props: {
        validate: (v: string | number) => (String(v).length > 3 ? 'Too long' : true),
        validationBehavior: 'aria',
      },
    })

    await wrapper.get('textarea').setValue('too long')
    await wrapper.get('textarea').trigger('blur')
    expect(wrapper.get('textarea').attributes('aria-invalid')).toBe('true')
  })

  it.each([
    ['idle', {}],
    ['disabled', { disabled: true }],
    ['read-only', { readonly: true, defaultValue: 'Read me' }],
    ['invalid', { invalid: true }],
  ])('standalone with aria-label (%s) has no axe violations', async (_, props) => {
    const wrapper = mount(TextArea, {
      props,
      attrs: { 'aria-label': 'Notes' },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it.each([
    ['with description', {}],
    ['invalid with error message', { invalid: true, errorMessage: 'Keep it under 500 characters' }],
    ['disabled', { disabled: true }],
    ['read-only', { readonly: true }],
    ['required', { required: true }],
  ])(
    'inside a labelled TextField (%s) is named, described and has no axe violations',
    async (_, props: Record<string, unknown>) => {
      const wrapper = mount(TextField, {
        props: { label: 'Message', description: 'Max 500 characters', ...props },
        slots: { default: () => h(TextArea) },
        attachTo: document.body,
      })

      const el = wrapper.get('textarea').element as HTMLTextAreaElement
      expect([...el.labels!].map((l) => l.textContent?.trim())).toEqual(['Message'])

      const described = el
        .getAttribute('aria-describedby')!
        .split(' ')
        .map((id) => document.getElementById(id)?.textContent?.trim())

      // While invalid the error replaces the description.
      expect(described).toEqual(props.errorMessage ? [props.errorMessage] : ['Max 500 characters'])
      expect(el.getAttribute('aria-invalid')).toBe(props.invalid ? 'true' : null)
      expect(el.disabled).toBe(!!props.disabled)
      expect(el.readOnly).toBe(!!props.readonly)
      expect(el.required).toBe(!!props.required)
      await expectAccessible(wrapper)
      wrapper.unmount()
    },
  )
})

describe('TextArea v-model modifiers', () => {
  // Starts from a typed value, as clearing a field does
  const typeInto = async (modelModifiers: ModelModifiers | undefined, text: string) => {
    const wrapper = mount(TextArea, {
      props: { modelValue: 'Draft', modelModifiers },
      attrs: { 'aria-label': 'Notes' },
    })

    await wrapper.get('textarea').setValue(text)

    return wrapper.emitted('update:modelValue')?.at(-1)
  }

  it('without modifiers emits the text as typed', async () => {
    expect(await typeInto(undefined, ' line one\n')).toEqual([' line one\n'])
  })

  it('without modifiers emits an emptied textarea as an empty string', async () => {
    expect(await typeInto(undefined, '')).toEqual([''])
  })

  it('trim emits the text without surrounding whitespace', async () => {
    expect(await typeInto({ trim: true }, '\n  Notes  \n')).toEqual(['Notes'])
  })

  it('number emits numeric text as a number', async () => {
    expect(await typeInto({ number: true }, '12')).toEqual([12])
  })

  it('nullable emits null for an emptied textarea', async () => {
    expect(await typeInto({ nullable: true }, '')).toEqual([null])
  })

  it('optional emits undefined for an emptied textarea', async () => {
    expect(await typeInto({ optional: true }, '')).toEqual([undefined])
  })

  it('lazy emits on change, not on input', async () => {
    const wrapper = mount(TextArea, {
      props: { modelModifiers: { lazy: true } },
      attrs: { 'aria-label': 'Notes' },
    })

    const el = wrapper.get('textarea')
    el.element.value = 'Draft'
    await el.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await el.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toEqual([['Draft']])
  })
})
