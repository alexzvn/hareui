import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'
import InputOtp from '../src/components/InputOtp.vue'

function controlled(initial = '', props: Record<string, unknown> = {}) {
  const model = ref(initial)
  const wrapper = mount(() => h(InputOtp, {
    'modelValue': model.value,
    'onUpdate:modelValue': (v: unknown) => (model.value = String(v ?? '')),
    ...props,
  }))
  return { model, wrapper, field: wrapper.findComponent(InputOtp), input: wrapper.get('input') }
}

describe('inputOtp', () => {
  it('renders HeroUI data-slots: the box, one group per size and a separator between groups', () => {
    const wrapper = mount(InputOtp, { props: { length: 6, groups: [3, 3] } })
    expect(wrapper.find('[data-slot=input-otp]').exists()).toBe(true)
    expect(wrapper.findAll('[data-slot=input-otp-group]')).toHaveLength(2)
    expect(wrapper.findAll('[data-slot=input-otp-slot]')).toHaveLength(6)
    expect(wrapper.find('[data-slot=input-otp-separator]').exists()).toBe(true)
  })

  it('defaults to a single group with no separator', () => {
    const wrapper = mount(InputOtp, { props: { length: 4 } })
    expect(wrapper.findAll('[data-slot=input-otp-group]')).toHaveLength(1)
    expect(wrapper.find('[data-slot=input-otp-separator]').exists()).toBe(false)
  })

  it('typing fills slots left to right and advances the active slot', async () => {
    const { model, wrapper, input } = controlled('', { length: 4 })
    await input.trigger('focus')
    expect(wrapper.findAll('[data-slot=input-otp-slot]')[0].attributes('data-active')).toBe('true')

    await input.setValue('1')
    expect(model.value).toBe('1')
    const slots = wrapper.findAll('[data-slot=input-otp-slot]')
    expect(slots[0].attributes('data-filled')).toBe('true')
    expect(slots[0].get('[data-slot=input-otp-slot-value]').text()).toBe('1')
    expect(slots[1].attributes('data-active')).toBe('true')

    await input.setValue('12')
    expect(model.value).toBe('12')
    expect(wrapper.findAll('[data-slot=input-otp-slot]')[2].attributes('data-active')).toBe('true')
  })

  it('backspace removes the last character and the active slot moves back', async () => {
    const { model, wrapper, input } = controlled('12', { length: 4 })
    await input.trigger('focus')
    await input.setValue('1')
    expect(model.value).toBe('1')
    const slots = wrapper.findAll('[data-slot=input-otp-slot]')
    expect(slots[1].attributes('data-filled')).toBeUndefined()
    expect(slots[1].attributes('data-active')).toBe('true')
  })

  it('pasting fills every slot from the clipboard text at once', async () => {
    const { model, wrapper, input } = controlled('', { length: 6 })
    await input.trigger('paste', { clipboardData: { getData: () => '123456' } })
    expect(model.value).toBe('123456')
    expect(wrapper.findAll('[data-slot=input-otp-slot][data-filled=true]')).toHaveLength(6)
  })

  it('emits complete exactly once per transition into a fully-filled value', async () => {
    const { field, input } = controlled('12345', { length: 6 })
    await input.setValue('123456')
    expect(field.emitted('complete')).toEqual([['123456']])

    await input.setValue('12345')
    await input.setValue('123456')
    expect(field.emitted('complete')).toHaveLength(2)
  })

  it('rejects characters that fail the digits pattern, keeping the previous value', async () => {
    const { model, input } = controlled('12', { length: 6, pattern: 'digits' })
    await input.setValue('12a')
    expect(model.value).toBe('12')
    expect(input.element.value).toBe('12')
  })

  it('accepts digits-only input under the digits pattern', async () => {
    const { model, input } = controlled('', { length: 4, pattern: 'digits' })
    await input.setValue('12')
    expect(model.value).toBe('12')
  })

  it('disabled marks the box and input, and blocks paste', async () => {
    const wrapper = mount(InputOtp, { props: { modelValue: '12', disabled: true, length: 4 } })
    expect(wrapper.get('[data-slot=input-otp]').attributes('data-disabled')).toBe('true')
    const input = wrapper.get('input')
    expect(input.attributes('disabled')).toBeDefined()
    await input.trigger('paste', { clipboardData: { getData: () => '9999' } })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('validate drives invalid state, aria-invalid and the error slot', async () => {
    const wrapper = mount(InputOtp, {
      props: {
        modelValue: '123',
        length: 6,
        validate: (v: string) => v.length < 6 ? 'Incomplete code' : null,
      },
    })
    await wrapper.get('input').trigger('change')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('Incomplete code')
  })

  it('renders the label and description and associates them with the input', () => {
    const wrapper = mount(InputOtp, { props: { label: 'Verify account', description: 'Check your email', length: 4 } })
    expect(wrapper.get('[data-slot=label]').text()).toBe('Verify account')
    const input = wrapper.get('input')
    const id = input.attributes('id')
    expect(wrapper.get('[data-slot=label]').attributes('for')).toBe(id)
    expect(input.attributes('aria-describedby')).toContain(`${id}-description`)
    expect(wrapper.get('[data-slot=description]').text()).toBe('Check your email')
  })
})
