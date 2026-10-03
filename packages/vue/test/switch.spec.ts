import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Label from '../src/components/Label.vue'
import Switch from '../src/components/Switch.vue'

const control = '[data-slot=switch-content]'

describe('Switch', () => {
  it('click toggles v-model and the root selected state', async () => {
    const model = ref(false)
    const wrapper = mount(() => h(Switch, { 'label': 'Wi-Fi', 'modelValue': model.value, 'onUpdate:modelValue': (v: boolean) => (model.value = v === true) }))
    await wrapper.find(control).trigger('click')
    expect(model.value).toBe(true)
    expect(wrapper.find('[data-slot=switch]').attributes('data-selected')).toBe('true')
    expect(wrapper.find(control).attributes('aria-checked')).toBe('true')
  })

  it('uncontrolled: starts from defaultValue and toggles itself', async () => {
    const wrapper = mount(Switch, { props: { defaultValue: true } })
    expect(wrapper.attributes('data-selected')).toBe('true')
    await wrapper.find(control).trigger('click')
    expect(wrapper.attributes('data-selected')).toBeUndefined()
  })

  it('an external Label pointing at the id toggles the switch', async () => {
    const model = ref(false)
    const wrapper = mount(defineComponent(() => () => [
      h(Switch, { 'id': 'wifi', 'modelValue': model.value, 'onUpdate:modelValue': (v: boolean) => (model.value = v === true) }),
      h(Label, { for: 'wifi' }, () => 'Wi-Fi'),
    ]), { attachTo: document.body })
    await wrapper.find('label[for=wifi]').trigger('click')
    expect(model.value).toBe(true)
    wrapper.unmount()
  })

  it('#icon renders inside the thumb with the checked state', async () => {
    const wrapper = mount(Switch, { slots: { icon: ({ checked }: { checked: boolean }) => (checked ? 'on' : 'off') } })
    expect(wrapper.find('[data-slot=switch-thumb] [data-slot=switch-icon]').text()).toBe('off')
    await wrapper.find(control).trigger('click')
    expect(wrapper.find('[data-slot=switch-icon]').text()).toBe('on')
  })

  it('disabled blocks toggling', async () => {
    const wrapper = mount(Switch, { props: { disabled: true } })
    await wrapper.find(control).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
  })

  it('readonly ignores toggles in uncontrolled mode and announces the state', async () => {
    const wrapper = mount(Switch, { props: { label: 'Wifi', defaultValue: true, readonly: true } })
    const content = wrapper.find('[data-slot=switch-content]')
    await content.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('data-selected')).toBe('true')
    expect(content.attributes('aria-checked')).toBe('true')
    expect(content.attributes('aria-readonly')).toBe('true')
  })

  it('invalid marks the control with aria-invalid', () => {
    const wrapper = mount(Switch, { props: { label: 'Terms', invalid: true } })
    expect(wrapper.attributes('data-invalid')).toBe('true')
    expect(wrapper.find('[data-slot=switch-content]').attributes('aria-invalid')).toBe('true')
  })
})

describe('Switch row click', () => {
  it('clicking the root outside the control toggles it', async () => {
    const wrapper = mount(Switch, { props: { label: 'Wifi' }, attachTo: document.body })
    await wrapper.find('[data-slot=switch]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    wrapper.unmount()
  })
})
