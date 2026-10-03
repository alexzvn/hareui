import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import NumberField from '../src/components/NumberField.vue'

const inc = '[data-slot=number-field-increment-button]'
const dec = '[data-slot=number-field-decrement-button]'
const input = '[data-slot=number-field-input]'

describe('NumberField', () => {
  it('steps with the arrow keys, emits update:modelValue and follows external v-model changes', async () => {
    const wrapper = mount(NumberField, { props: { defaultValue: 10, step: 5 }, attachTo: document.body })
    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([15])
    await nextTick()
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('15')
    await wrapper.setProps({ modelValue: 40 })
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('40')
    wrapper.unmount()
  })

  it('disables decrement at min and clamps typed values on blur', async () => {
    const wrapper = mount(NumberField, { props: { defaultValue: 0, min: 0, max: 10 }, attachTo: document.body })
    expect(wrapper.get(dec).attributes('disabled')).toBeDefined()
    expect(wrapper.get(inc).attributes('disabled')).toBeUndefined()
    const el = wrapper.get(input)
    ;(el.element as HTMLInputElement).value = '42'
    await el.trigger('input')
    await el.trigger('blur')
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([10])
    wrapper.unmount()
  })

  it('readonly blocks changes from buttons and keys', async () => {
    const wrapper = mount(NumberField, { props: { defaultValue: 3, readonly: true }, attachTo: document.body })
    expect(wrapper.get(inc).attributes('disabled')).toBeDefined()
    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  it('links label, description and error to the input', () => {
    const wrapper = mount(NumberField, { props: { id: 'w', label: 'Width', description: 'Pixels', errorMessage: 'Too small', invalid: true } })
    const el = wrapper.get(input)
    expect(wrapper.get('label').attributes('for')).toBe('w')
    expect(el.attributes('id')).toBe('w')
    expect(el.attributes('aria-describedby')).toBe('w-description w-error')
    expect(el.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=number-field-group]').attributes('data-invalid')).toBe('true')
  })

  it('hides buttons when increment / decrement are false', () => {
    const wrapper = mount(NumberField, { props: { increment: false, decrement: false } })
    expect(wrapper.find(inc).exists()).toBe(false)
    expect(wrapper.find(dec).exists()).toBe(false)
  })

  it('submits the raw number (not the formatted text) under `name`', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(NumberField, { props: { name: 'pct', defaultValue: 0.5, step: 0.1, formatOptions: { style: 'percent' } }, attachTo: form })
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('50%')
    expect(new FormData(form).getAll('pct')).toEqual(['0.5'])
    await wrapper.get(input).trigger('keydown', { key: 'ArrowUp' })
    expect(new FormData(form).getAll('pct')).toEqual(['0.6'])
    wrapper.unmount()
    form.remove()
  })

  it('clamps an out-of-range value for display and submission without emitting (RAC snap)', () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(NumberField, { props: { name: 'q', modelValue: -5, min: 0 }, attachTo: form })
    expect((wrapper.get(input).element as HTMLInputElement).value).toBe('0')
    expect(new FormData(form).get('q')).toBe('0')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    const pct = mount(NumberField, { props: { modelValue: 1.5, min: 0, max: 1, step: 0.1, formatOptions: { style: 'percent' } } })
    expect((pct.get(input).element as HTMLInputElement).value).toBe('100%')
    wrapper.unmount()
    form.remove()
  })
})
