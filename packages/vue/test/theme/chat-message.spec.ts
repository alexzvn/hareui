import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ChatMessage from '@/components/chat-message/ChatMessage.vue'

describe('ChatMessage theme', () => {
  it('colours a primary default bubble as the inverted solid', () => {
    const wrapper = mount(ChatMessage, {
      props: { variant: 'primary', parts: [{ type: 'text', text: 'Hi' }] },
    })

    const content = wrapper.get('[data-slot=chat-message-content]').classes()

    expect(content).toContain('[--chat-message-bg:var(--foreground)]')
    expect(content).toContain('[--chat-message-fg:var(--background)]')
  })

  it('takes the colour from `color`', () => {
    const wrapper = mount(ChatMessage, {
      props: { variant: 'soft', color: 'success', parts: [{ type: 'text', text: 'Paid' }] },
    })

    expect(wrapper.get('[data-slot=chat-message-content]').classes()).toContain(
      '[--chat-message-bg:var(--success-soft)]',
    )
  })

  it('drops the end gutter when compact', () => {
    const regular = mount(ChatMessage, { props: { parts: [] } })
    const compact = mount(ChatMessage, { props: { parts: [], compact: true } })

    expect(regular.get('[data-slot=chat-message-body]').classes()).toContain('sm:pe-12')
    expect(compact.get('[data-slot=chat-message-body]').classes()).not.toContain('sm:pe-12')
  })
})
