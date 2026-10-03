import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Separator from '../src/components/separator/Separator.vue'

describe('Separator', () => {
  it('defaults to horizontal orientation with role="separator"', () => {
    const wrapper = mount(Separator)
    expect(wrapper.attributes('data-orientation')).toBe('horizontal')
    expect(wrapper.attributes('role')).toBe('separator')
    expect(wrapper.attributes('data-slot')).toBe('separator')
  })

  it('vertical orientation sets data-orientation and aria-orientation', () => {
    const wrapper = mount(Separator, { props: { orientation: 'vertical' } })
    expect(wrapper.attributes('data-orientation')).toBe('vertical')
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
  })

  it('renders as a div by default', () => {
    const wrapper = mount(Separator)
    expect(wrapper.element.tagName).toBe('DIV')
  })
})
