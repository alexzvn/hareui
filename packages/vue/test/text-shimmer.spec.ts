import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import TextShimmer from '@/components/text-shimmer/TextShimmer.vue'

describe('text-shimmer', () => {
  it('renders the text once visibly and once hidden as the highlight', () => {
    const wrapper = mount(TextShimmer, { props: { text: 'Thinking' } })

    expect(wrapper.get('[data-slot=text-shimmer-text]').text()).toBe('Thinking')

    const highlight = wrapper.get('[data-slot=text-shimmer-highlight]')
    expect(highlight.text()).toBe('Thinking')
    expect(highlight.attributes('aria-hidden')).toBe('true')
  })

  it('renders the default slot in place of text', () => {
    const wrapper = mount(TextShimmer, {
      props: { text: 'Ignored' },
      slots: { default: '<strong>Searching</strong>' },
    })

    expect(wrapper.get('[data-slot=text-shimmer-text]').html()).toContain(
      '<strong>Searching</strong>',
    )

    expect(wrapper.get('[data-slot=text-shimmer-highlight] strong').text()).toBe('Searching')
    expect(wrapper.text()).not.toContain('Ignored')
  })

  it('renders a span by default and the element of as', () => {
    expect(mount(TextShimmer, { props: { text: 'a' } }).element.tagName).toBe('SPAN')
    expect(mount(TextShimmer, { props: { text: 'a', as: 'h3' } }).element.tagName).toBe('H3')
  })

  it('sets the duration and spread as custom properties', () => {
    const wrapper = mount(TextShimmer, { props: { text: 'a', duration: 1.5, spread: 6 } })
    const style = (wrapper.element as HTMLElement).style

    expect(style.getPropertyValue('--text-shimmer-duration')).toBe('1.5s')
    expect(style.getPropertyValue('--text-shimmer-spread')).toBe('6ch')
  })
})
