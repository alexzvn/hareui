import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'

import { ChatConversation } from '@/components/chat-conversation'
import type { ChatMessageData } from '@/types/chat'

const message = (id: string, role: 'user' | 'assistant', text: string): ChatMessageData => ({
  id,
  role,
  parts: [{ type: 'text', text }],
})

const messages = [message('1', 'user', 'Hi'), message('2', 'assistant', 'Hello! How can I help?')]

// happy-dom has no layout: give the viewport a fixed box and a content height the test controls
let scrollHeight = 1000
let resize: () => void = () => {}

beforeEach(() => {
  scrollHeight = 1000

  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: () => void) {
        resize = callback
      }

      observe() {}
      disconnect() {}
    },
  )

  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get: () => 400,
  })

  Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
    configurable: true,
    get: () => scrollHeight,
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  Reflect.deleteProperty(HTMLElement.prototype, 'clientHeight')
  Reflect.deleteProperty(HTMLElement.prototype, 'scrollHeight')
})

const mountConversation = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(ChatConversation, { props: { messages, ...props }, slots, attachTo: document.body })

const scrollTo = async (wrapper: ReturnType<typeof mountConversation>, top: number) => {
  wrapper.element.scrollTop = top
  await wrapper.trigger('scroll')
}

const buttonState = (wrapper: ReturnType<typeof mountConversation>) =>
  wrapper.get('[data-slot=chat-conversation-scroll-button-container]').attributes('data-state')

describe('ChatConversation', () => {
  it('renders the messages in a log and starts at the bottom', () => {
    const wrapper = mountConversation()

    expect(wrapper.attributes('role')).toBe('log')
    expect(wrapper.text()).toContain('Hello! How can I help?')
    expect(wrapper.element.scrollTop).toBe(600)
    expect(buttonState(wrapper)).toBe('hidden')
    wrapper.unmount()
  })

  it('follows growing content while at the bottom', async () => {
    const wrapper = mountConversation({ status: 'streaming' })

    scrollHeight = 1300
    resize()

    expect(wrapper.element.scrollTop).toBe(900)
    expect(wrapper.attributes('aria-busy')).toBe('true')
    wrapper.unmount()
  })

  it('stops following once the user scrolls up, and shows the scroll-to-bottom button', async () => {
    const wrapper = mountConversation({ status: 'streaming' })

    await scrollTo(wrapper, 200)
    scrollHeight = 1300
    resize()
    await nextTick()

    expect(wrapper.element.scrollTop).toBe(200)
    expect(buttonState(wrapper)).toBe('visible')
    wrapper.unmount()
  })

  it('stops following on an upward wheel before any scroll event', async () => {
    const wrapper = mountConversation({ status: 'streaming' })

    await wrapper.trigger('wheel', { deltaY: -40 })
    scrollHeight = 1300
    resize()

    expect(wrapper.element.scrollTop).toBe(600)
    wrapper.unmount()
  })

  it('resumes following when the user scrolls back to the bottom', async () => {
    const wrapper = mountConversation({ status: 'streaming' })

    await scrollTo(wrapper, 200)
    await scrollTo(wrapper, 600)
    scrollHeight = 1300
    resize()
    await nextTick()

    expect(wrapper.element.scrollTop).toBe(900)
    expect(buttonState(wrapper)).toBe('hidden')
    wrapper.unmount()
  })

  it('scrolls to the bottom and resumes following from the button', async () => {
    const wrapper = mountConversation({ status: 'streaming' })

    await scrollTo(wrapper, 100)
    await wrapper.get('[data-slot=chat-conversation-scroll-button]').trigger('click')

    // The button scrolls smoothly: the position lands later and fires a scroll event, as in a browser
    await vi.waitFor(() => expect(wrapper.element.scrollTop).toBe(600))
    await wrapper.trigger('scroll')

    expect(buttonState(wrapper)).toBe('hidden')

    scrollHeight = 1300
    resize()

    expect(wrapper.element.scrollTop).toBe(900)
    wrapper.unmount()
  })

  it('hides the scroll-to-bottom button with scroll-button off', () => {
    const wrapper = mountConversation({ scrollButton: false })

    expect(wrapper.find('[data-slot=chat-conversation-scroll-button]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('passes scroll-button options to the button', () => {
    const wrapper = mountConversation({
      scrollButton: { 'aria-label': 'Newest messages', icon: 'icon-probe' },
    })

    const button = wrapper.get('[data-slot=chat-conversation-scroll-button]')

    expect(button.attributes('aria-label')).toBe('Newest messages')
    expect(button.find('.icon-probe').exists()).toBe(true)
    wrapper.unmount()
  })

  it('does not follow content with should-auto-scroll off', async () => {
    const wrapper = mountConversation({ status: 'streaming', shouldAutoScroll: false })

    scrollHeight = 1300
    resize()
    await nextTick()

    expect(wrapper.element.scrollTop).toBe(600)
    expect(buttonState(wrapper)).toBe('visible')
    wrapper.unmount()
  })

  it('brings the reply into view when a message is submitted', async () => {
    const wrapper = mountConversation({ status: 'ready' })

    await scrollTo(wrapper, 100)
    scrollHeight = 1200

    await wrapper.setProps({
      status: 'submitted',
      messages: [...messages, message('3', 'user', 'Thanks')],
    })

    expect(wrapper.element.scrollTop).toBe(800)
    expect(wrapper.find('[data-slot=chat-conversation-indicator]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('passes whether a message is streaming to forwarded message slots', () => {
    const wrapper = mountConversation(
      { status: 'streaming' },
      {
        content: ({ message: item, streaming }: { message: ChatMessageData; streaming: boolean }) =>
          h('span', { class: 'probe' }, `${item.id}:${streaming}`),
      },
    )

    expect(wrapper.findAll('.probe').map((probe) => probe.text())).toEqual(['1:false', '2:true'])
    wrapper.unmount()
  })

  it('shows the indicator in the empty reply instead of a second message', () => {
    const empty: ChatMessageData = { id: '3', role: 'assistant', parts: [] }

    const wrapper = mountConversation({
      messages: [...messages, empty],
      status: 'streaming',
      assistant: { actions: [{ kind: 'copy' }] },
    })

    const articles = wrapper.findAll('[data-slot=chat-message]')

    expect(articles).toHaveLength(3)
    expect(wrapper.find('[data-slot=chat-conversation-indicator]').exists()).toBe(false)
    expect(articles[2]!.find('[data-slot=chat-loader]').exists()).toBe(true)
    expect(articles[2]!.find('[data-slot=chat-message-actions]').exists()).toBe(false)
    expect(articles[1]!.find('[data-slot=chat-message-actions]').exists()).toBe(true)
    wrapper.unmount()
  })

  it('gives the typing indicator no actions', () => {
    const wrapper = mountConversation({
      status: 'submitted',
      assistant: { icon: 'i-bot', actions: [{ kind: 'copy' }] },
    })

    const indicator = wrapper.get('[data-slot=chat-conversation-indicator]')

    expect(indicator.find('[data-slot=chat-message-leading]').exists()).toBe(true)
    expect(indicator.find('[data-slot=chat-message-actions]').exists()).toBe(false)
    wrapper.unmount()
  })

  it('sticks the footer to the bottom and lifts the scroll button by its height', async () => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get: () => 96,
    })

    const wrapper = mountConversation({}, { footer: () => h('form', { class: 'prompt' }) })

    await nextTick()

    expect(wrapper.find('[data-slot=chat-conversation-footer] .prompt').exists()).toBe(true)
    expect(wrapper.attributes('data-footer')).toBe('')
    expect(wrapper.attributes('style')).toContain('--chat-conversation-footer: 96px')
    Reflect.deleteProperty(HTMLElement.prototype, 'offsetHeight')
    wrapper.unmount()
  })

  it('scrolls a message into view by id', () => {
    const wrapper = mountConversation()
    const spy = vi.fn<(options?: ScrollToOptions) => void>()

    wrapper.element.scrollTo = spy as typeof wrapper.element.scrollTo
    ;(wrapper.vm as unknown as { scrollToMessage: (id: string) => void }).scrollToMessage('2')

    expect(spy).toHaveBeenCalledOnce()
    wrapper.unmount()
  })
})
