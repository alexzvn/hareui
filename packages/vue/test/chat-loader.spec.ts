import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ChatLoader from '@/components/chat-loader/ChatLoader.vue'

describe('chat-loader', () => {
  it('is a status region announcing the default label', () => {
    const wrapper = mount(ChatLoader)

    expect(wrapper.attributes('role')).toBe('status')
    expect(wrapper.text()).toBe('Loading response')
  })

  it('announces a custom label', () => {
    const wrapper = mount(ChatLoader, { props: { label: 'Writing a reply' } })

    expect(wrapper.text()).toBe('Writing a reply')
  })

  it('renders three hidden dots by default', () => {
    const wrapper = mount(ChatLoader)
    const dots = wrapper.findAll('[data-slot=chat-loader-dot]')

    expect(wrapper.attributes('data-variant')).toBe('dots')
    expect(dots).toHaveLength(3)
    expect(dots.every((dot) => dot.attributes('aria-hidden') === 'true')).toBe(true)
  })

  it('renders the indicator of each variant', () => {
    expect(
      mount(ChatLoader, { props: { variant: 'pulse' } })
        .find('[data-slot=chat-loader-pulse]')
        .exists(),
    ).toBe(true)

    const skeleton = mount(ChatLoader, { props: { variant: 'skeleton' } })
    expect(skeleton.find('[data-slot=chat-loader-avatar]').exists()).toBe(true)
    expect(skeleton.findAll('[data-slot=chat-loader-bar]')).toHaveLength(3)
    expect(skeleton.find('[data-slot=chat-loader-dot]').exists()).toBe(false)

    const spinner = mount(ChatLoader, { props: { variant: 'spinner' } })
    expect(spinner.attributes('data-variant')).toBe('spinner')
    expect(spinner.find('[data-slot=chat-loader-dot]').exists()).toBe(false)
    expect(spinner.find('[aria-hidden=true]').exists()).toBe(true)
  })
})
