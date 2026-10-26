import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { h, ref } from 'vue'

import SearchField from '@/components/search-field/SearchField.vue'

import { expectAccessible } from './a11y'

const controlled = (initial: string, attachTo?: HTMLElement) => {
  const model = ref(initial)
  const wrapper = mount(
    () =>
      h(SearchField, {
        modelValue: model.value,
        'onUpdate:modelValue': (v: unknown) => (model.value = String(v ?? '')),
      }),
    { attachTo },
  )

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
      props: { modelValue: 'ab', validate: (v: string) => (v.length < 3 ? 'Too short' : null) },
    })

    await wrapper.get('input').trigger('change')
    expect(wrapper.get('input').attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('[data-slot=field-error]').text()).toBe('Too short')
  })

  it('disabled and readonly reach the input and disable the clear button', () => {
    const disabled = mount(SearchField, { props: { disabled: true } })
    expect(disabled.get('input').attributes('disabled')).toBeDefined()

    expect(
      disabled.get('[data-slot=search-field-clear-button]').attributes('disabled'),
    ).toBeDefined()

    const readonly = mount(SearchField, { props: { readonly: true } })
    expect(readonly.get('input').attributes('readonly')).toBeDefined()

    expect(
      readonly.get('[data-slot=search-field-clear-button]').attributes('disabled'),
    ).toBeDefined()
  })

  it('defaultValue seeds an uncontrolled field; v-model wins when bound', async () => {
    const wrapper = mount(SearchField, { props: { defaultValue: 'jane' } })
    expect(wrapper.get('input').element.value).toBe('jane')

    const bound = mount(SearchField, {
      props: { defaultValue: 'jane', modelValue: 'bound', 'onUpdate:modelValue': () => {} },
    })

    expect(bound.get('input').element.value).toBe('bound')
  })

  it('custom icon and clearIcon slots replace the defaults', () => {
    const wrapper = mount(SearchField, {
      slots: {
        icon: '<span data-test="custom-icon" />',
        clearIcon: '<span data-test="custom-clear" />',
      },
    })

    expect(wrapper.find('[data-test=custom-icon]').exists()).toBe(true)
    expect(wrapper.find('[data-test=custom-clear]').exists()).toBe(true)
    expect(wrapper.get('[data-slot=search-field-search-icon]').find('svg').exists()).toBe(false)
  })

  it('readonly: escape does not clear the value or emit clear', async () => {
    // behaviour-final-check H13
    const model = ref('cats')
    const wrapper = mount(() =>
      h(SearchField, {
        modelValue: model.value,
        readonly: true,
        'onUpdate:modelValue': (v: unknown) => (model.value = String(v ?? '')),
      }),
    )

    await wrapper.get('input').trigger('keydown', { key: 'Escape' })
    expect(model.value).toBe('cats')
    expect(wrapper.get('input').element.value).toBe('cats')
    expect(wrapper.findComponent(SearchField).emitted('clear')).toBeUndefined()
  })

  it('readonly: enter does not emit submit', async () => {
    // behaviour-final-check H13
    const wrapper = mount(SearchField, { props: { modelValue: 'cats', readonly: true } })
    await wrapper.get('input').trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('submit')).toBeUndefined()
  })

  it.each([
    ['idle', {}],
    ['with a value', { defaultValue: 'cats' }],
    ['with description', { description: 'Search by name or email' }],
    ['invalid with error message', { invalid: true, errorMessage: 'Enter at least 3 characters' }],
    ['disabled', { disabled: true, defaultValue: 'cats' }],
    ['read-only', { readonly: true, defaultValue: 'cats' }],
  ])(
    'labelled by its label (%s), it has no axe violations',
    async (_, props: Record<string, unknown>) => {
      const wrapper = mount(SearchField, {
        props: { label: 'Search users', ...props },
        attachTo: document.body,
      })

      const input = wrapper.get('input').element as HTMLInputElement
      expect([...input.labels!].map((l) => l.textContent?.trim())).toEqual(['Search users'])
      await expectAccessible(wrapper)
      wrapper.unmount()
    },
  )

  it('without a visible label, aria-label names the input (not the root) with no axe violations', async () => {
    const wrapper = mount(SearchField, {
      attrs: { 'aria-label': 'Search docs', 'data-testid': 'search' },
      attachTo: document.body,
    })

    expect(wrapper.get('input').attributes('aria-label')).toBe('Search docs')
    expect(wrapper.attributes('aria-label')).toBeUndefined()
    expect(wrapper.attributes('data-testid')).toBe('search')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('aria-labelledby and aria-describedby reach the input, merged with its own description and error ids', () => {
    const wrapper = mount(SearchField, {
      props: { id: 's', description: 'Help', invalid: true, errorMessage: 'Bad' },
      attrs: { 'aria-labelledby': 'heading', 'aria-describedby': 'tips' },
    })

    const input = wrapper.get('input')
    expect(input.attributes('aria-labelledby')).toBe('heading')

    // The theme hides the description while invalid, so it's dropped from aria-describedby too
    expect(input.attributes('aria-describedby')).toBe('tips s-error')
    expect(input.attributes('aria-invalid')).toBe('true')
    expect(wrapper.get('#s-error').text()).toBe('Bad')
    expect(wrapper.attributes('aria-describedby')).toBeUndefined()
    wrapper.unmount()
  })

  it('groups the input with its icon and clear button; the clear button is named and out of the tab order', () => {
    const wrapper = mount(SearchField, { props: { label: 'Search', defaultValue: 'cats' } })
    expect(wrapper.get('[data-slot=search-field-group]').attributes('role')).toBe('group')
    const clear = wrapper.get('[data-slot=search-field-clear-button]')
    expect(clear.attributes('aria-label')).toBe('Clear search')
    expect(clear.attributes('tabindex')).toBe('-1')

    expect(wrapper.get('[data-slot=search-field-search-icon] svg').attributes('aria-hidden')).toBe(
      'true',
    )

    wrapper.unmount()
  })

  it('escape that clears the field stops there, so an enclosing dialog stays open; on an empty field it passes through', async () => {
    const onOuterKeydown = vi.fn<(event: KeyboardEvent) => void>()
    const { wrapper } = controlled('cats', document.body)
    document.body.addEventListener('keydown', onOuterKeydown)
    const input = wrapper.get('input')
    await input.trigger('keydown', { key: 'Escape' })
    expect(input.element.value).toBe('')
    expect(onOuterKeydown).not.toHaveBeenCalled()
    await input.trigger('keydown', { key: 'Escape' })
    expect(onOuterKeydown).toHaveBeenCalledTimes(1)
    document.body.removeEventListener('keydown', onOuterKeydown)
    wrapper.unmount()
  })
})
