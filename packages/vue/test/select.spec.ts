import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import Select from '../src/components/Select.vue'

const items = [
  { value: 'cat', label: 'Cat' },
  { value: 'dog', label: 'Dog' },
  { value: 'emu', label: 'Emu', disabled: true },
  { value: 'eel', label: 'Eel' },
]
const trigger = '[data-slot=select-trigger]'
const value = '[data-slot=select-value]'
const flush = () => new Promise(r => setTimeout(r, 0))

afterEach(() => {
  document.body.innerHTML = ''
})

describe('Select', () => {
  it('shows the placeholder, then the selected label after picking an option, and closes', async () => {
    const wrapper = mount(Select, { props: { items, label: 'Pet', placeholder: 'Pick one' }, attachTo: document.body })
    expect(wrapper.get(value).text()).toBe('Pick one')
    expect(wrapper.get(value).attributes('data-placeholder')).toBe('true')

    await wrapper.get(trigger).trigger('click')
    await flush()
    const options = document.querySelectorAll<HTMLElement>('[role=option]')
    expect([...options].map(o => o.textContent?.trim())).toEqual(['Cat', 'Dog', 'Emu', 'Eel'])
    options[1]!.click()
    await flush()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['dog'])
    expect(wrapper.get(value).text()).toBe('Dog')
    expect(wrapper.get(value).attributes('data-placeholder')).toBeUndefined()
    expect(document.querySelector('[role=listbox]')).toBeNull()
    expect(wrapper.attributes('data-open')).toBeUndefined()
    wrapper.unmount()
  })

  it('focuses the selected option on open, else the first option', async () => {
    const selected = mount(Select, { props: { items, defaultValue: 'eel' }, attachTo: document.body })
    await selected.get(trigger).trigger('click')
    await flush()
    await flush()
    expect(document.activeElement?.textContent?.trim()).toBe('Eel')
    selected.unmount()

    const empty = mount(Select, { props: { items }, attachTo: document.body })
    await empty.get(trigger).trigger('click')
    await flush()
    await flush()
    expect(document.activeElement?.textContent?.trim()).toBe('Cat')
    empty.unmount()
  })

  it('multiple mode keeps the popover open and lists labels in collection order', async () => {
    const wrapper = mount(Select, { props: { items, selectionMode: 'multiple', modelValue: ['eel'] }, attachTo: document.body })
    await wrapper.get(trigger).trigger('click')
    await flush()
    document.querySelectorAll<HTMLElement>('[role=option]')[0]!.click()
    await flush()
    const last = wrapper.emitted('update:modelValue')?.at(-1)?.[0] as string[]
    expect([...last].sort()).toEqual(['cat', 'eel'])
    await wrapper.setProps({ modelValue: last })
    expect(wrapper.get(value).text()).toBe('Cat and Eel')
    expect(document.querySelector('[role=listbox]')).not.toBeNull()
    wrapper.unmount()
  })

  it('clear button and Backspace reset the selection and emit clear', async () => {
    const wrapper = mount(Select, { props: { items, clearable: true, defaultValue: 'cat' }, attachTo: document.body })
    const clear = wrapper.get('[data-slot=select-clear-button]')
    expect(clear.attributes('data-empty')).toBeUndefined()
    await clear.trigger('click')
    expect(wrapper.get(value).attributes('data-placeholder')).toBe('true')
    expect(clear.attributes('data-empty')).toBe('true')
    expect(document.querySelector('[role=listbox]')).toBeNull()

    await wrapper.setProps({ modelValue: 'dog' })
    await wrapper.get(trigger).trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('clear')).toHaveLength(2)
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([null])
    wrapper.unmount()
  })

  it('typeahead on the closed trigger skips disabled options', async () => {
    const wrapper = mount(Select, { props: { items }, attachTo: document.body })
    await wrapper.get(trigger).trigger('keydown', { key: 'e' })
    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual(['eel'])
    wrapper.unmount()
  })

  it('submits the selection through the hidden select and blocks required forms natively', async () => {
    const form = document.createElement('form')
    document.body.append(form)
    const wrapper = mount(Select, { props: { items, name: 'pet', required: true, label: 'Pet' }, attachTo: form })
    expect(form.checkValidity()).toBe(false)
    await wrapper.setProps({ modelValue: 'dog' })
    await nextTick()
    expect(new FormData(form).get('pet')).toBe('dog')
    expect(form.checkValidity()).toBe(true)
    wrapper.unmount()
  })

  it('wires label, description and error ids onto the trigger', async () => {
    const wrapper = mount(Select, {
      props: { items, id: 's', label: 'Pet', description: 'Help', invalid: true, errorMessage: 'Bad' },
      attachTo: document.body,
    })
    const btn = wrapper.get(trigger)
    expect(btn.attributes('aria-labelledby')).toBe('s-label s-value')
    expect(btn.attributes('aria-describedby')).toBe('s-description s-error')
    expect(btn.attributes('aria-invalid')).toBe('true')
    expect(wrapper.attributes('data-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('Bad')
    wrapper.unmount()
  })

  it('disabled trigger does not open', async () => {
    const wrapper = mount(Select, { props: { items, disabled: true }, attachTo: document.body })
    await wrapper.get(trigger).trigger('click')
    await wrapper.get(trigger).trigger('keydown', { key: 'ArrowDown' })
    await flush()
    expect(document.querySelector('[role=listbox]')).toBeNull()
    expect(wrapper.emitted('update:open')).toBeUndefined()
    wrapper.unmount()
  })
})
