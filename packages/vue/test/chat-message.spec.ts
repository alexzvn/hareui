import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import type { ChatMessageAction } from '@/components/chat-message-actions/ChatMessageActions.types'
import type { ChatMessagePartSlotProps } from '@/components/chat-message/ChatMessage.types'
import ChatMessage from '@/components/chat-message/ChatMessage.vue'
import type { ChatMessageData, ChatMessagePart, ChatToolPart } from '@/types/chat'

const userMessage: ChatMessageData = {
  id: 'u1',
  role: 'user',
  parts: [{ type: 'text', text: 'Hello there' }],
}

const mixedParts: ChatMessagePart[] = [
  { type: 'reasoning', text: 'Thinking it over' },
  { type: 'text', text: 'Line one\nLine two' },
  { type: 'tool-getWeather', toolCallId: 'c1', state: 'output-available', input: { city: 'Oslo' } },
  { type: 'dynamic-tool', toolName: 'lookup', toolCallId: 'c2', state: 'input-available' },
  { type: 'file', mediaType: 'image/png', url: 'https://example.com/a.png', filename: 'a.png' },
  { type: 'source-url', sourceId: 's1', url: 'https://example.com' },
  { type: 'step-start' },
]

const texts = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[data-slot=chat-message-text]').map((text) => text.element.textContent)

describe('chat-message', () => {
  it('lays a user message out at the end in a secondary bubble', () => {
    const wrapper = mount(ChatMessage, {
      props: { message: userMessage, avatar: { fallback: 'AB' } },
    })

    expect(wrapper.element.tagName).toBe('ARTICLE')
    expect(wrapper.attributes('data-role')).toBe('user')
    expect(wrapper.attributes('data-side')).toBe('end')
    expect(wrapper.attributes('data-variant')).toBe('secondary')
  })

  it('lays an assistant message out at the start as plain text', () => {
    const wrapper = mount(ChatMessage, { props: { parts: [{ type: 'text', text: 'Hi' }] } })

    expect(wrapper.attributes('data-role')).toBe('assistant')
    expect(wrapper.attributes('data-side')).toBe('start')
    expect(wrapper.attributes('data-variant')).toBe('tertiary')
  })

  it('lets role, side and variant override the message', () => {
    const wrapper = mount(ChatMessage, {
      props: { message: userMessage, role: 'assistant', side: 'end', variant: 'outline' },
    })

    expect(wrapper.attributes('data-role')).toBe('assistant')
    expect(wrapper.attributes('data-side')).toBe('end')
    expect(wrapper.attributes('data-variant')).toBe('outline')
  })

  it('renders the avatar before the body only with avatar, icon or #leading', () => {
    const plain = mount(ChatMessage, { props: { message: userMessage } })
    expect(plain.find('[data-slot=chat-message-leading]').exists()).toBe(false)

    const withAvatar = mount(ChatMessage, {
      props: { message: userMessage, avatar: { fallback: 'AB' } },
    })

    const children = [...withAvatar.element.children].map((child) =>
      child.getAttribute('data-slot'),
    )

    expect(children).toEqual(['chat-message-leading', 'chat-message-body'])
    expect(withAvatar.get('[data-slot=chat-message-leading]').text()).toContain('AB')

    const withIcon = mount(ChatMessage, { props: { message: userMessage, icon: 'i-test-icon' } })
    expect(withIcon.find('[data-slot=chat-message-leading] .i-test-icon').exists()).toBe(true)

    const withSlot = mount(ChatMessage, {
      props: { message: userMessage },
      slots: { leading: '<span data-test="leading">Bot</span>' },
    })

    expect(withSlot.find('[data-slot=chat-message-leading] [data-test=leading]').exists()).toBe(
      true,
    )
  })

  it('renders every part type with its own component by default', () => {
    const wrapper = mount(ChatMessage, { props: { parts: mixedParts } })
    const content = wrapper.get('[data-slot=chat-message-content]').element
    const slotsInOrder = [...content.children].map((child) => child.getAttribute('data-slot'))

    expect(texts(wrapper)).toEqual(['Line one\nLine two'])

    expect(slotsInOrder).toEqual([
      'chain-of-thought',
      'chat-message-text',
      'chat-tool',
      'chat-tool',
      'chat-attachment',
      'chat-message-sources',
    ])
  })

  it('forwards v-model:feedback to the actions', async () => {
    const wrapper = mount(ChatMessage, {
      props: { parts: [], actions: [{ kind: 'like' }, { kind: 'dislike' }] },
    })

    await wrapper.findAll('[data-slot=chat-message-action]')[1]!.trigger('click')

    expect(wrapper.emitted('update:feedback')).toEqual([['dislike']])
  })

  it('renders text parts through #text', () => {
    const wrapper = mount(ChatMessage, {
      props: { parts: mixedParts },
      slots: {
        text: ({ part }: ChatMessagePartSlotProps) => h('em', (part as { text: string }).text),
      },
    })

    expect(wrapper.get('em').text()).toBe('Line one\nLine two')
    expect(wrapper.find('[data-slot=chat-message-text]').exists()).toBe(false)
  })

  it('passes tool-* and dynamic-tool parts to #tool', () => {
    const wrapper = mount(ChatMessage, {
      props: { parts: mixedParts },
      slots: {
        tool: ({ part, index }: ChatMessagePartSlotProps<ChatToolPart>) =>
          h('div', { 'data-test': 'tool', 'data-index': index }, part.toolName ?? part.type),
      },
    })

    const tools = wrapper.findAll('[data-test=tool]')
    expect(tools.map((tool) => tool.text())).toEqual(['tool-getWeather', 'lookup'])
    expect(tools.map((tool) => tool.attributes('data-index'))).toEqual(['2', '3'])
  })

  it('passes reasoning, file and source parts to their slots', () => {
    const wrapper = mount(ChatMessage, {
      props: { parts: mixedParts },
      slots: {
        reasoning: () => h('div', { 'data-test': 'reasoning' }),
        file: () => h('div', { 'data-test': 'file' }),
        source: () => h('div', { 'data-test': 'source' }),
      },
    })

    for (const name of ['reasoning', 'file', 'source']) {
      expect(wrapper.findAll(`[data-test=${name}]`)).toHaveLength(1)
    }
  })

  it('falls back from #part to the slot of the type when #part renders nothing', () => {
    const wrapper = mount(ChatMessage, {
      props: { parts: mixedParts },
      slots: {
        part: ({ part }: ChatMessagePartSlotProps) =>
          part.type === 'tool-getWeather' ? [h('div', { 'data-test': 'weather' })] : [],
        tool: () => h('div', { 'data-test': 'tool' }),
      },
    })

    expect(wrapper.findAll('[data-test=weather]')).toHaveLength(1)
    expect(wrapper.findAll('[data-test=tool]')).toHaveLength(1)
    expect(texts(wrapper)).toEqual(['Line one\nLine two'])
  })

  it('replaces every part with #content', () => {
    const wrapper = mount(ChatMessage, {
      props: { parts: mixedParts },
      slots: { content: '<span data-test="loading">…</span>' },
    })

    expect(wrapper.find('[data-test=loading]').exists()).toBe(true)
    expect(wrapper.find('[data-slot=chat-message-text]').exists()).toBe(false)
  })

  it('passes the resolved message to the slots', () => {
    let received: ChatMessageData | undefined
    mount(ChatMessage, {
      props: { message: userMessage, role: 'assistant' },
      slots: {
        header: ({ message }: { message: ChatMessageData }) => {
          received = message
          return []
        },
      },
    })

    expect(received).toEqual({ id: 'u1', role: 'assistant', parts: userMessage.parts })
  })

  it('renders actions in the footer and forwards action', async () => {
    const wrapper = mount(ChatMessage, {
      props: { message: userMessage, actions: [{ kind: 'like' }] },
    })

    expect(
      wrapper.find('[data-slot=chat-message-footer] [data-slot=chat-message-actions]').exists(),
    ).toBe(true)

    await wrapper.get('[data-slot=chat-message-action]').trigger('click')

    expect(wrapper.emitted('action')?.[0]?.[0]).toEqual({ kind: 'like' })
  })

  it('renders no footer without actions or #actions', () => {
    const footer = (actions?: ChatMessageAction[]) =>
      mount(ChatMessage, { props: { message: userMessage, actions } }).find(
        '[data-slot=chat-message-footer]',
      )

    expect(footer().exists()).toBe(false)
    expect(footer([]).exists()).toBe(false)
  })
})
