import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'

import type { ChatMessageAction } from '@/components/chat-message-actions/ChatMessageActions.types'
import ChatMessageActions from '@/components/chat-message-actions/ChatMessageActions.vue'
import type { ChatMessageData } from '@/types/chat'

const writeText = vi.fn<(text: string) => Promise<void>>()

beforeEach(() => {
  writeText.mockReset().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } })
})

afterEach(() => {
  vi.useRealTimers()
  document.body.innerHTML = ''
})

const message: ChatMessageData = {
  id: 'm1',
  role: 'assistant',
  parts: [
    { type: 'text', text: 'First paragraph.' },
    { type: 'tool-search', toolCallId: 'c1', state: 'output-available' },
    { type: 'text', text: 'Second paragraph.' },
  ],
}

const buttons = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('[data-slot=chat-message-action]')

const settle = async () => {
  await nextTick()
  await nextTick()
}

describe('chat-message-actions', () => {
  it('is a labelled group of buttons named after their kind', () => {
    const wrapper = mount(ChatMessageActions, {
      props: {
        actions: [{ kind: 'copy' }, { kind: 'like' }, { kind: 'regenerate', label: 'Try again' }],
      },
    })

    expect(wrapper.attributes('role')).toBe('group')
    expect(wrapper.attributes('aria-label')).toBe('Message actions')

    expect(buttons(wrapper).map((button) => button.attributes('aria-label'))).toEqual([
      'Copy',
      'Good response',
      'Try again',
    ])
  })

  it('calls onClick with the message and emits action', async () => {
    const onClick = vi.fn<(event: MouseEvent, message?: ChatMessageData) => void>()
    const action: ChatMessageAction = { kind: 'like', onClick }
    const wrapper = mount(ChatMessageActions, { props: { actions: [action], message } })

    await buttons(wrapper)[0]!.trigger('click')

    expect(onClick).toHaveBeenCalledWith(expect.any(MouseEvent), message)
    const emitted = wrapper.emitted<[ChatMessageAction, MouseEvent]>('action')
    expect(emitted).toHaveLength(1)
    expect(emitted?.[0]?.[0]).toStrictEqual(action)
    expect(emitted?.[0]?.[1]).toBeInstanceOf(MouseEvent)
  })

  it('marks a pressed toggle and disables a disabled action', () => {
    const actions: ChatMessageAction[] = [
      { kind: 'like', pressed: true },
      { kind: 'dislike', pressed: false },
      { kind: 'more', disabled: true },
    ]

    const wrapper = mount(ChatMessageActions, { props: { actions } })

    expect(buttons(wrapper)[0]!.attributes('aria-pressed')).toBe('true')
    expect(buttons(wrapper)[1]!.attributes('aria-pressed')).toBe('false')
    expect(buttons(wrapper)[2]!.attributes('disabled')).toBeDefined()
  })

  it('copies the text parts of the message and emits copy', async () => {
    const wrapper = mount(ChatMessageActions, { props: { actions: [{ kind: 'copy' }], message } })

    await buttons(wrapper)[0]!.trigger('click')
    await settle()

    expect(writeText).toHaveBeenCalledWith('First paragraph.\n\nSecond paragraph.')
    expect(wrapper.emitted('copy')).toEqual([['First paragraph.\n\nSecond paragraph.']])
  })

  it('copies text in place of the message', async () => {
    const wrapper = mount(ChatMessageActions, {
      props: { actions: [{ kind: 'copy' }], message, text: 'Override' },
    })

    await buttons(wrapper)[0]!.trigger('click')
    await settle()

    expect(writeText).toHaveBeenCalledWith('Override')
  })

  it('shows and announces the copied state for two seconds', async () => {
    vi.useFakeTimers()

    const wrapper = mount(ChatMessageActions, {
      props: { actions: [{ kind: 'copy' }], text: 'Hello' },
    })

    await buttons(wrapper)[0]!.trigger('click')
    await settle()

    expect(buttons(wrapper)[0]!.attributes('aria-label')).toBe('Copied')
    expect(buttons(wrapper)[0]!.attributes('data-copied')).toBe('true')
    expect(wrapper.get('[role=status]').text()).toBe('Copied')

    vi.advanceTimersByTime(2000)
    await nextTick()

    expect(buttons(wrapper)[0]!.attributes('aria-label')).toBe('Copy')
    expect(buttons(wrapper)[0]!.attributes('data-copied')).toBeUndefined()
    expect(wrapper.get('[role=status]').text()).toBe('')
  })

  it('stays idle and emits no copy when the clipboard refuses the write', async () => {
    writeText.mockRejectedValue(new Error('denied'))

    const wrapper = mount(ChatMessageActions, {
      props: { actions: [{ kind: 'copy' }], text: 'Hello' },
    })

    await buttons(wrapper)[0]!.trigger('click')
    await settle()

    expect(buttons(wrapper)[0]!.attributes('aria-label')).toBe('Copy')
    expect(wrapper.emitted('copy')).toBeUndefined()
    expect(wrapper.emitted('action')).toHaveLength(1)
  })

  it('renders the default slot after the buttons', () => {
    const wrapper = mount(ChatMessageActions, {
      props: { actions: [{ kind: 'copy' }] },
      slots: { default: '<span data-test="extra">1.2 s</span>' },
    })

    expect(wrapper.element.lastElementChild?.getAttribute('data-test')).toBe('extra')
  })

  it('sets and clears v-model:feedback from like and dislike', async () => {
    const wrapper = mount(ChatMessageActions, {
      props: {
        actions: [{ kind: 'like' }, { kind: 'dislike' }] satisfies ChatMessageAction[],
        feedback: null,
        'onUpdate:feedback': (value: unknown) => wrapper.setProps({ feedback: value as null }),
      },
    })

    await buttons(wrapper)[0]!.trigger('click')

    expect(buttons(wrapper)[0]!.attributes('aria-pressed')).toBe('true')
    expect(buttons(wrapper)[1]!.attributes('aria-pressed')).toBe('false')

    await buttons(wrapper)[0]!.trigger('click')

    expect(wrapper.emitted('update:feedback')).toEqual([['like'], [null]])
    expect(buttons(wrapper)[0]!.attributes('aria-pressed')).toBe('false')
  })

  it('passes Button props through and names edit and share', () => {
    const wrapper = mount(ChatMessageActions, {
      props: {
        actions: [
          { kind: 'edit', variant: 'secondary' },
          { kind: 'share', pending: true },
        ],
      },
    })

    expect(buttons(wrapper).map((button) => button.attributes('aria-label'))).toEqual([
      'Edit',
      'Share',
    ])

    expect(buttons(wrapper)[1]!.attributes('data-pending')).toBe('true')
  })

  it('opens a menu from an action with items', async () => {
    const wrapper = mount(ChatMessageActions, {
      props: { actions: [{ kind: 'more', items: [{ value: 'report', label: 'Report' }] }] },
      attachTo: document.body,
    })

    expect(buttons(wrapper)[0]!.attributes('aria-haspopup')).toBe('menu')
    wrapper.unmount()
  })
})
