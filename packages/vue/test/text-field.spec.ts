import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Input from '../src/components/Input.vue'
import TextField from '../src/components/TextField.vue'

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
    expect(input().attributes('aria-describedby')).toBe('email-description email-error')
  })

  it('invalid sets aria-invalid on the input and shows errorMessage', () => {
    const wrapper = mount(TextField, { props: { invalid: true, errorMessage: 'Please enter a valid email' } })
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('Please enter a valid email')
  })

  it('label targets the input and v-model syncs both ways', async () => {
    const wrapper = mount(TextField, {
      props: { 'label': 'Name', 'modelValue': 'a', 'onUpdate:modelValue': (v: string | number | undefined) => wrapper.setProps({ modelValue: v }) },
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
      slots: { default: () => [h(Input, { 'data-test': 'ctx' }), h(Input, { 'data-test': 'own', 'id': 'own', 'disabled': false })] },
    })
    const ctx = wrapper.get('[data-test=ctx]')
    expect(ctx.attributes('id')).toBe('f')
    expect(ctx.attributes('disabled')).toBeDefined()
    expect(ctx.attributes('aria-invalid')).toBe('true')
    expect(ctx.attributes('aria-describedby')).toBe('f-description')
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
    const bound = mount(TextField, { props: { 'defaultValue': 'jane', 'modelValue': 'bound', 'onUpdate:modelValue': () => {} } })
    expect(bound.get('input').element.value).toBe('bound')
  })

  it('readonly reaches the default and slotted Input', () => {
    const wrapper = mount(TextField, { props: { readonly: true } })
    expect(wrapper.get('input').attributes('readonly')).toBeDefined()
    expect(wrapper.attributes('data-readonly')).toBe('true')
    const slotted = mount(TextField, { props: { readonly: true }, slots: { default: () => h(Input) } })
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
    const slotted = mount(TextField, { attrs: { 'aria-labelledby': 'heading' }, slots: { default: () => h(Input) } })
    expect(slotted.get('input').attributes('aria-labelledby')).toBe('heading')
  })
})
