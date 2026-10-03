import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'
import RadioGroup from '../src/components/radio-group/RadioGroup.vue'

const items = [
  { value: 'basic', label: 'Basic' },
  { value: 'premium', label: 'Premium' },
  { value: 'business', label: 'Business', disabled: true },
]

describe('RadioGroup', () => {
  it('selecting an item updates v-model and the item state', async () => {
    const model = ref<string>()
    const wrapper = mount(() => h(RadioGroup, { items, 'modelValue': model.value, 'onUpdate:modelValue': (v: string | undefined) => (model.value = v) }), { attachTo: document.body })
    const radios = wrapper.findAll('[data-slot=radio]')
    await radios[1]!.find('[data-slot=radio-content]').trigger('click')
    expect(model.value).toBe('premium')
    expect(radios[1]!.attributes('data-selected')).toBe('true')
    expect(radios[0]!.attributes('data-selected')).toBeUndefined()
    wrapper.unmount()
  })

  it('a disabled item cannot be selected', async () => {
    const wrapper = mount(RadioGroup, { props: { items, defaultValue: 'basic' }, attachTo: document.body })
    await wrapper.findAll('[data-slot=radio-content]')[2]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.findAll('[data-slot=radio]')[0]!.attributes('data-selected')).toBe('true')
    wrapper.unmount()
  })

  it('labels the group and shows the error only when invalid', async () => {
    const wrapper = mount(RadioGroup, { props: { id: 'plan', items, label: 'Plan', errorMessage: 'Pick one' } })
    const root = wrapper.find('[role=radiogroup]')
    expect(root.attributes('aria-labelledby')).toBe('plan-label')
    expect(wrapper.find('#plan-label').text()).toBe('Plan')
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(false)
    await wrapper.setProps({ invalid: true })
    expect(wrapper.find('#plan-error').text()).toBe('Pick one')
    expect(root.attributes('aria-describedby')).toBe('plan-error')
  })

  it('readonly keeps the selection, also when nothing is selected yet', async () => {
    const wrapper = mount(RadioGroup, { props: { items, readonly: true }, attachTo: document.body })
    const radios = wrapper.findAll('[data-slot=radio]')
    await radios[0]!.find('[data-slot=radio-content]').trigger('click')
    expect(radios[0]!.attributes('data-selected')).toBeUndefined()
    expect(wrapper.find('[data-slot=radio-content][data-state=checked]').exists()).toBe(false)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    await wrapper.setProps({ defaultValue: 'premium' })
    await radios[0]!.find('[data-slot=radio-content]').trigger('click')
    expect(radios[1]!.attributes('data-selected')).toBe('true')
    expect(radios[1]!.find('[data-slot=radio-content]').attributes('data-selected')).toBe('true')
    expect(radios[0]!.attributes('data-selected')).toBeUndefined()
    expect(wrapper.find('[data-slot=radio-group]').attributes('aria-readonly')).toBe('true')
    wrapper.unmount()
  })
})

describe('RadioGroup row click', () => {
  it('clicking the empty space of an item row selects it', async () => {
    const wrapper = mount(RadioGroup, { props: { items: [{ value: 'a', label: 'A' }, { value: 'b', label: 'B' }] }, attachTo: document.body })
    await wrapper.findAll('[data-slot=radio]')[1]!.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([['b']])
    wrapper.unmount()
  })
})

describe('RadioGroup keyboard and state parity', () => {
  // behaviour-final-check R2: RAC ignores Home / End / PageUp / PageDown in a radio group
  it('Home / End / PageUp / PageDown neither move focus nor change the selection', async () => {
    const wrapper = mount(RadioGroup, { props: { items, defaultValue: 'premium' }, attachTo: document.body })
    const radios = wrapper.findAll('[data-slot=radio-content]')
    ;(radios[1]!.element as HTMLElement).focus()
    for (const key of ['Home', 'End', 'PageUp', 'PageDown']) {
      await radios[1]!.trigger('keydown', { key })
      await new Promise(resolve => setTimeout(resolve))
      expect(document.activeElement).toBe(radios[1]!.element)
    }
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
  })

  // behaviour-final-check R5
  it('exposes a disabled group as aria-disabled', () => {
    const wrapper = mount(RadioGroup, { props: { items, disabled: true } })
    expect(wrapper.get('[data-slot=radio-group]').attributes('aria-disabled')).toBe('true')
    expect(mount(RadioGroup, { props: { items } }).get('[data-slot=radio-group]').attributes('aria-disabled')).toBeUndefined()
  })

  // behaviour-final-check R4
  it('Enter on a radio submits the enclosing form without selecting it', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    let submitted = 0
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      submitted++
    })
    const wrapper = mount(RadioGroup, { props: { items }, attachTo: form })
    await wrapper.findAll('[data-slot=radio-content]')[0]!.trigger('keydown', { key: 'Enter' })
    expect(submitted).toBe(1)
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    wrapper.unmount()
    form.remove()
  })
})
