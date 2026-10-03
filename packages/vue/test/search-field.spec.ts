import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h, ref } from 'vue'
import SearchField from '../src/components/search-field/SearchField.vue'

function controlled(initial: string, attachTo?: HTMLElement) {
  const model = ref(initial)
  const wrapper = mount(() => h(SearchField, { 'modelValue': model.value, 'onUpdate:modelValue': (v: unknown) => (model.value = String(v ?? '')) }), { attachTo })
  return { model, wrapper, field: wrapper.findComponent(SearchField) }
}

describe('searchField', () => {
  it('renders the search icon, input and clear button with HeroUI data-slots', () => {
    const wrapper = mount(SearchField, { props: { label: 'Search' } })
    expect(wrapper.attributes('data-slot')).toBe('search-field')
    expect(wrapper.find('[data-slot=search-field-group]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=search-field-search-icon]').exists()).toBe(true)
    expect(wrapper.get('input[data-slot=search-field-input]').attributes('type')).toBe('search')
    expect(wrapper.find('[data-slot=search-field-clear-button]').exists()).toBe(true)
  })

  it('is marked empty when there is no value, and not once there is one', async () => {
    const wrapper = mount(SearchField)
    expect(wrapper.attributes('data-empty')).toBe('true')
    await wrapper.get('input').setValue('cats')
    expect(wrapper.attributes('data-empty')).toBeUndefined()
  })

  it('the clear button empties the value, refocuses the input and emits clear', async () => {
    const { model, wrapper, field } = controlled('cats', document.body)
    await wrapper.get('[data-slot=search-field-clear-button]').trigger('click')
    expect(model.value).toBe('')
    expect(document.activeElement).toBe(wrapper.get('input').element)
    expect(field.emitted('clear')).toHaveLength(1)
    wrapper.unmount()
  })

  it('escape clears a non-empty field and emits clear, but does nothing when already empty', async () => {
    const { model, wrapper, field } = controlled('dogs')
    const input = wrapper.get('input')
    await input.trigger('keydown', { key: 'Escape' })
    expect(model.value).toBe('')
    expect(field.emitted('clear')).toHaveLength(1)

    await input.trigger('keydown', { key: 'Escape' })
    expect(field.emitted('clear')).toHaveLength(1)
  })

  it('enter emits submit with the current value and does not clear it', async () => {
    const wrapper = mount(SearchField, { props: { modelValue: 'query' } })
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('submit')).toEqual([['query']])
    expect(wrapper.get('input').element.value).toBe('query')
  })

  it('validate drives invalid and the error slot', async () => {
    const wrapper = mount(SearchField, {
      props: { modelValue: 'ab', validate: (v: string) => v.length < 3 ? 'Too short' : null },
    })
    await wrapper.get('input').trigger('change')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('Too short')
  })

  it('disabled and readonly reach the input and disable the clear button', () => {
    const disabled = mount(SearchField, { props: { disabled: true } })
    expect(disabled.get('input').attributes('disabled')).toBeDefined()
    expect(disabled.get('[data-slot=search-field-clear-button]').attributes('disabled')).toBeDefined()

    const readonly = mount(SearchField, { props: { readonly: true } })
    expect(readonly.get('input').attributes('readonly')).toBeDefined()
    expect(readonly.get('[data-slot=search-field-clear-button]').attributes('disabled')).toBeDefined()
  })

  it('defaultValue seeds an uncontrolled field; v-model wins when bound', async () => {
    const wrapper = mount(SearchField, { props: { defaultValue: 'jane' } })
    expect(wrapper.get('input').element.value).toBe('jane')
    const bound = mount(SearchField, { props: { 'defaultValue': 'jane', 'modelValue': 'bound', 'onUpdate:modelValue': () => {} } })
    expect(bound.get('input').element.value).toBe('bound')
  })

  it('custom icon and clearIcon slots replace the defaults', () => {
    const wrapper = mount(SearchField, {
      slots: { icon: '<span data-test="custom-icon" />', clearIcon: '<span data-test="custom-clear" />' },
    })
    expect(wrapper.find('[data-test=custom-icon]').exists()).toBe(true)
    expect(wrapper.find('[data-test=custom-clear]').exists()).toBe(true)
    expect(wrapper.get('[data-slot=search-field-search-icon]').find('svg').exists()).toBe(false)
  })
})
