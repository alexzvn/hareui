import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'
import Fieldset from '../src/components/fieldset/Fieldset.vue'
import NativeSelect from '../src/components/native-select/NativeSelect.vue'

const select = '[data-slot=native-select-select]'
const items = ['todo', { value: 'done', label: 'Done' }, { value: 'cancelled', label: 'Cancelled', disabled: true }]

describe('NativeSelect', () => {
  it('renders items, groups and slot options', () => {
    const wrapper = mount(NativeSelect, {
      props: { placeholder: 'Select', items: [...items, { label: 'More', items: ['a', 'b'] }] },
      slots: { default: () => h('option', { value: 'slot' }, 'Slot') },
    })
    const options = wrapper.findAll('option')
    expect(options.map(o => o.attributes('value'))).toEqual(['', 'todo', 'done', 'cancelled', 'a', 'b', 'slot'])
    expect(options[3]!.attributes('disabled')).toBeDefined()
    expect(wrapper.find('optgroup').attributes('label')).toBe('More')
  })

  it('v-model: reflects and emits the string value', async () => {
    const model = ref('done')
    const wrapper = mount(() => h(NativeSelect, { 'items': items, 'modelValue': model.value, 'onUpdate:modelValue': (v: string) => (model.value = v) }))
    const el = wrapper.find(select).element as HTMLSelectElement
    expect(el.value).toBe('done')
    await wrapper.find(select).setValue('todo')
    expect(model.value).toBe('todo')
  })

  it('uncontrolled: starts from defaultValue and marks the placeholder', async () => {
    const wrapper = mount(NativeSelect, { props: { placeholder: 'Select', items, defaultValue: '' } })
    expect(wrapper.find(select).attributes('data-placeholder')).toBe('true')
    await wrapper.find(select).setValue('todo')
    expect(wrapper.find(select).attributes('data-placeholder')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toEqual([['todo']])
  })

  it('invalid shows the error message and marks the parts', () => {
    const wrapper = mount(NativeSelect, { props: { id: 's', invalid: true, errorMessage: 'Required', items } })
    expect(wrapper.attributes('data-invalid')).toBe('true')
    expect(wrapper.find(select).attributes('aria-invalid')).toBe('true')
    expect(wrapper.find('[data-slot=field-error]').text()).toBe('Required')
    expect(wrapper.find(select).attributes('aria-describedby')).toBe('s-error')
  })

  it('submits its value with the form and blocks an empty required submit', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(NativeSelect, { props: { name: 'status', required: true, placeholder: 'Select', items }, attachTo: form })
    const el = wrapper.find(select).element as HTMLSelectElement
    expect(el.required).toBe(true)
    expect(form.checkValidity()).toBe(false)
    await flushPromises()
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(true)
    await wrapper.find(select).setValue('done')
    await flushPromises()
    expect(form.checkValidity()).toBe(true)
    expect(new FormData(form).get('status')).toBe('done')
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(false)
    wrapper.unmount()
    form.remove()
  })

  it('validate reports custom errors after a change', async () => {
    const wrapper = mount(NativeSelect, { props: { items, defaultValue: 'done', validate: (v: string) => v === 'todo' ? 'Not allowed' : true } })
    await wrapper.find(select).setValue('todo')
    expect(wrapper.find('[data-slot=field-error]').text()).toBe('Not allowed')
  })

  it('form reset restores the initial option, or defaultValue', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    const first = mount(NativeSelect, { props: { name: 'a', items }, attachTo: form })
    const second = mount(NativeSelect, { props: { name: 'b', items, defaultValue: 'done' }, attachTo: form })
    await first.find(select).setValue('done')
    await second.find(select).setValue('todo')
    form.reset()
    // The component restores the bound value in a task after the reset
    await new Promise(resolve => setTimeout(resolve))
    expect((first.find(select).element as HTMLSelectElement).value).toBe('todo')
    expect(first.find(select).attributes('data-placeholder')).toBeUndefined()
    expect(first.emitted('update:modelValue')!.at(-1)).toEqual(['todo'])
    expect((second.find(select).element as HTMLSelectElement).value).toBe('done')
    expect(second.emitted('update:modelValue')!.at(-1)).toEqual(['done'])
    first.unmount()
    second.unmount()
    form.remove()
  })

  it('form reset keeps defaultValue when the user never changed it', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(NativeSelect, { props: { name: 'a', placeholder: 'Select', items, defaultValue: 'done' }, attachTo: form })
    form.reset()
    // The component restores the bound value in a task after the reset
    await new Promise(resolve => setTimeout(resolve))
    expect((wrapper.find(select).element as HTMLSelectElement).value).toBe('done')
    expect(new FormData(form).get('a')).toBe('done')
    wrapper.unmount()
    form.remove()
  })

  it('is disabled by an ancestor Fieldset', () => {
    const wrapper = mount(Fieldset, { props: { disabled: true }, slots: { default: () => h(NativeSelect, { name: 'status', items, defaultValue: 'done' }) } })
    expect(wrapper.find(select).attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-slot=native-select]').attributes('data-disabled')).toBe('true')
  })
})
