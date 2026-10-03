import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Input from '../src/components/Input.vue'

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
    const wrapper = mount(Input, { props: { 'defaultValue': 'seed', 'modelValue': 'bound', 'onUpdate:modelValue': () => {} } })
    expect(wrapper.get('input').element.value).toBe('bound')
  })
})
