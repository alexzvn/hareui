import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ErrorMessage from '../src/components/ErrorMessage.vue'

describe('ErrorMessage', () => {
  it('renders the errorMessage slot span with HeroUI data-slot and id', () => {
    const wrapper = mount(ErrorMessage, { props: { id: 'err' }, slots: { default: () => 'Pick one' } })
    expect(wrapper.element.tagName).toBe('SPAN')
    expect(wrapper.attributes()).toMatchObject({ 'id': 'err', 'slot': 'errorMessage', 'data-slot': 'error-message' })
    expect(wrapper.text()).toBe('Pick one')
  })

  it('stays rendered while empty and lets a user class override the color', () => {
    const wrapper = mount(ErrorMessage, { props: { class: 'text-warning' } })
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.classes()).toContain('text-warning')
    expect(wrapper.classes()).not.toContain('text-danger')
  })
})
