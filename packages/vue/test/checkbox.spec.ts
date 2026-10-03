import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import Checkbox from '../src/components/checkbox/Checkbox.vue'
import Label from '../src/components/label/Label.vue'

const control = '[data-slot=checkbox-content]'

describe('Checkbox', () => {
  it('click toggles v-model and the root selected state', async () => {
    const model = ref<boolean | 'indeterminate'>(false)
    const wrapper = mount(() => h(Checkbox, { 'label': 'Terms', 'modelValue': model.value, 'onUpdate:modelValue': (v: boolean | 'indeterminate') => (model.value = v) }))
    await wrapper.find(control).trigger('click')
    expect(model.value).toBe(true)
    expect(wrapper.find('[data-slot=checkbox]').attributes('data-selected')).toBe('true')
    await wrapper.find(control).trigger('click')
    expect(model.value).toBe(false)
    expect(wrapper.find('[data-slot=checkbox]').attributes('data-selected')).toBeUndefined()
  })

  it('uncontrolled: starts from defaultValue and toggles itself', async () => {
    const wrapper = mount(Checkbox, { props: { defaultValue: true } })
    expect(wrapper.attributes('data-selected')).toBe('true')
    await wrapper.find(control).trigger('click')
    expect(wrapper.attributes('data-selected')).toBeUndefined()
  })

  it('\'indeterminate\' renders the dash indicator and resolves to checked on click', async () => {
    const wrapper = mount(Checkbox, { props: { 'modelValue': 'indeterminate' as const, 'onUpdate:modelValue': (v: boolean | 'indeterminate') => wrapper.setProps({ modelValue: v }) } })
    expect(wrapper.find('[data-slot=checkbox-default-indicator--indeterminate]').exists()).toBe(true)
    expect(wrapper.find(control).attributes('aria-checked')).toBe('mixed')
    await wrapper.find(control).trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
    expect(wrapper.find('[data-slot=checkbox-default-indicator--checkmark]').exists()).toBe(true)
  })

  it('an external Label pointing at the id toggles the checkbox', async () => {
    const model = ref(false)
    const wrapper = mount(defineComponent(() => () => [
      h(Checkbox, { 'id': 'marketing', 'modelValue': model.value, 'onUpdate:modelValue': (v: boolean | 'indeterminate') => (model.value = v === true) }),
      h(Label, { for: 'marketing' }, () => 'Send me marketing emails'),
    ]), { attachTo: document.body })
    await wrapper.find('label[for=marketing]').trigger('click')
    expect(model.value).toBe(true)
    wrapper.unmount()
  })

  it('disabled blocks toggling', async () => {
    const wrapper = mount(Checkbox, { props: { disabled: true } })
    await wrapper.find(control).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('data-disabled')).toBe('true')
  })

  it('shows errorMessage only when invalid and wires aria-describedby', async () => {
    const wrapper = mount(Checkbox, { props: { id: 'c', description: 'Help', errorMessage: 'Required' } })
    expect(wrapper.find('[data-slot=field-error]').exists()).toBe(false)
    expect(wrapper.find(control).attributes('aria-describedby')).toBe('c-description')
    await wrapper.setProps({ invalid: true })
    expect(wrapper.find('[data-slot=field-error]').text()).toBe('Required')
    expect(wrapper.find(control).attributes('aria-describedby')).toBe('c-description c-error')
    expect(wrapper.find(control).attributes('aria-invalid')).toBe('true')
  })

  it('readonly ignores toggles in uncontrolled mode', async () => {
    const wrapper = mount(Checkbox, { props: { label: 'Terms', readonly: true } })
    const content = wrapper.find('[data-slot=checkbox-content]')
    await content.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('data-selected')).toBeUndefined()
    expect(content.attributes('aria-checked')).toBe('false')
    expect(content.attributes('aria-readonly')).toBe('true')
  })
})

describe('Checkbox row click', () => {
  it('clicking the root outside the control toggles it, but nested links are left alone', async () => {
    const wrapper = mount(Checkbox, { props: { label: 'Accept' }, slots: { description: () => h('a', { href: '#x' }, 'terms') }, attachTo: document.body })
    await wrapper.find('[data-slot=checkbox]').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toEqual([[true]])
    await wrapper.find('a').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
    wrapper.unmount()
  })
})
