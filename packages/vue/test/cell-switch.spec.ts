import { flushPromises, mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'
import CellSwitch from '../src/components/cell-switch/CellSwitch.vue'
import Fieldset from '../src/components/fieldset/Fieldset.vue'
import Form from '../src/components/form/Form.vue'

const row = '[data-slot=switch-content]'

describe('CellSwitch', () => {
  it('renders the label inside the row, before the control', () => {
    const wrapper = mount(CellSwitch, { props: { label: 'Animations' } })
    const trigger = wrapper.get(row)
    expect(trigger.attributes('role')).toBe('switch')
    expect(trigger.get('[data-slot=cell-switch-label]').text()).toBe('Animations')
    expect(trigger.find('[data-slot=switch-control]').exists()).toBe(true)
    expect(trigger.text()).toBe('Animations')
  })

  it('a click anywhere on the row toggles v-model', async () => {
    const model = ref(false)
    const wrapper = mount(() => h(CellSwitch, { 'label': 'Animations', 'modelValue': model.value, 'onUpdate:modelValue': (v: boolean) => (model.value = v) }), { attachTo: document.body })
    await wrapper.get('[data-slot=cell-switch-label]').trigger('click')
    expect(model.value).toBe(true)
    expect(wrapper.get('[data-slot=cell-switch]').attributes('data-selected')).toBe('true')
    expect(wrapper.get(row).attributes('aria-checked')).toBe('true')
    await wrapper.get(row).trigger('click')
    expect(model.value).toBe(false)
    wrapper.unmount()
  })

  it('uncontrolled: starts from defaultValue and toggles itself', async () => {
    const wrapper = mount(CellSwitch, { props: { label: 'Sounds', defaultValue: true } })
    expect(wrapper.attributes('data-selected')).toBe('true')
    await wrapper.get(row).trigger('click')
    expect(wrapper.attributes('data-selected')).toBeUndefined()
    expect(wrapper.emitted('update:modelValue')).toEqual([[false]])
  })

  it('disabled blocks toggling and marks the root', async () => {
    const wrapper = mount(CellSwitch, { props: { label: 'Animations', disabled: true } })
    await wrapper.get(row).trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.attributes('data-disabled')).toBe('true')
    expect(wrapper.get(row).attributes('disabled')).toBeDefined()
  })

  it('Enter does not toggle the row, like a native switch', async () => {
    const wrapper = mount(CellSwitch, { props: { label: 'Animations' }, attachTo: document.body })
    await wrapper.get(row).trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    expect(wrapper.get(row).attributes('aria-checked')).toBe('false')
    wrapper.unmount()
  })

  it('the #label slot replaces the label text and gets the checked state', async () => {
    const wrapper = mount(CellSwitch, { slots: { label: ({ checked }: { checked: boolean }) => (checked ? 'On' : 'Off') } })
    expect(wrapper.get('[data-slot=cell-switch-label]').text()).toBe('Off')
    await wrapper.get(row).trigger('click')
    expect(wrapper.get('[data-slot=cell-switch-label]').text()).toBe('On')
  })

  it('is disabled by an ancestor Fieldset', async () => {
    const wrapper = mount(Fieldset, { props: { disabled: true }, slots: { default: () => h(CellSwitch, { label: 'Animations' }) } })
    await wrapper.get(row).trigger('click')
    expect(wrapper.get(row).attributes('disabled')).toBeDefined()
    expect(wrapper.get(row).attributes('aria-checked')).toBe('false')
    expect(wrapper.get('[data-slot=cell-switch]').attributes('data-disabled')).toBe('true')
  })

  it('required inside a Form fails validation and shows the error until the row is toggled on', async () => {
    const error = () => document.querySelector('[data-slot=field-error]')?.textContent?.trim()
    const wrapper = mount(() => h(Form, null, () => h(CellSwitch, { label: 'Accept terms', name: 'terms', required: true, errorMessage: 'Accept the terms to continue' })), { attachTo: document.body })
    // The hidden form input renders once the switch finds its form
    await flushPromises()
    const form = wrapper.get('form').element as HTMLFormElement
    expect(form.checkValidity()).toBe(false)
    await flushPromises()
    expect(error()).toBe('Accept the terms to continue')
    expect(wrapper.get(row).attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=cell-switch]').attributes('data-invalid')).toBe('true')

    await wrapper.get(row).trigger('click')
    await flushPromises()
    expect(error()).toBeUndefined()
    expect(wrapper.get(row).attributes('aria-invalid')).toBeUndefined()
    expect(form.checkValidity()).toBe(true)
    wrapper.unmount()
  })
})
