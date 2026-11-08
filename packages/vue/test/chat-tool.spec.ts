import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ChatTool from '@/components/chat-tool/ChatTool.vue'
import ChatToolGroup from '@/components/chat-tool/ChatToolGroup.vue'
import type { ChatToolPart } from '@/types/chat'

const weather = (part: Partial<ChatToolPart> = {}): ChatToolPart =>
  ({
    type: 'tool-getWeather',
    toolCallId: 'call-1',
    state: 'output-available',
    input: { city: 'Hanoi' },
    output: { temperature: 31 },
    ...part,
  }) as ChatToolPart

const trigger = (wrapper: ReturnType<typeof mount>) => wrapper.find('[data-slot=chat-tool-trigger]')

describe('chat-tool', () => {
  it('labels the call with its state and the tool name from the part type', () => {
    const wrapper = mount(ChatTool, { props: { part: weather() } })

    expect(wrapper.attributes('data-state')).toBe('output-available')
    expect(trigger(wrapper).text()).toContain('Used tool:')
    expect(trigger(wrapper).text()).toContain('getWeather')
  })

  it('reads the name of a dynamic tool from toolName', () => {
    const part = {
      type: 'dynamic-tool',
      toolName: 'search',
      toolCallId: 'c',
      state: 'input-available',
      input: {},
    }

    const wrapper = mount(ChatTool, { props: { part: part as ChatToolPart } })

    expect(trigger(wrapper).text()).toContain('Running tool:')
    expect(trigger(wrapper).text()).toContain('search')
  })

  it('starts collapsed and toggles the input and output on trigger click', async () => {
    const wrapper = mount(ChatTool, { props: { part: weather() } })

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')

    await trigger(wrapper).trigger('click')

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')
    expect(wrapper.find('[data-slot=chat-tool-input]').text()).toBe('{"city":"Hanoi"}')
    expect(wrapper.find('[data-slot=chat-tool-output]').text()).toContain('"temperature": 31')
    expect(wrapper.emitted('update:open')).toEqual([[true]])

    await trigger(wrapper).trigger('click')

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')
  })

  it('shows the error text in the output-error state', () => {
    const part = weather({ state: 'output-error', output: undefined, errorText: 'City not found' })
    const wrapper = mount(ChatTool, { props: { part, defaultOpen: true } })

    expect(trigger(wrapper).text()).toContain('Failed:')
    expect(wrapper.find('[data-slot=chat-tool-error]').text()).toBe('City not found')
    expect(wrapper.find('[data-slot=chat-tool-output]').exists()).toBe(false)
  })

  it('indents input too long for one line', () => {
    const input = { query: 'quiet cafés with long opening hours', near: 'Old Town', limit: 10 }
    const wrapper = mount(ChatTool, { props: { part: weather({ input }), defaultOpen: true } })

    expect(wrapper.find('[data-slot=chat-tool-input]').text()).toContain('"near": "Old Town"')
  })

  it('is not expandable without input, output or error', () => {
    const part = weather({ state: 'input-streaming', input: undefined, output: undefined })
    const wrapper = mount(ChatTool, { props: { part } })

    expect(trigger(wrapper).attributes('data-expandable')).toBe('false')
    expect(trigger(wrapper).attributes('disabled')).toBeDefined()
  })

  it('expands to show partial string input as it streams', () => {
    const part = weather({ state: 'input-streaming', input: '{"city": "Ha', output: undefined })
    const wrapper = mount(ChatTool, { props: { part, defaultOpen: true } })

    expect(trigger(wrapper).attributes('data-expandable')).toBe('true')
    expect(wrapper.find('[data-slot=chat-tool-input]').text()).toBe('{"city": "Ha')
  })

  it('opens on approval-requested and emits approve and deny', async () => {
    const wrapper = mount(ChatTool, {
      props: { part: weather({ state: 'approval-requested', output: undefined }) },
    })

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')
    expect(trigger(wrapper).text()).toContain('Approval needed:')

    await wrapper.find('[data-slot=chat-tool-approve]').trigger('click')
    await wrapper.find('[data-slot=chat-tool-deny]').trigger('click')

    expect(wrapper.emitted('approve')).toEqual([['call-1']])
    expect(wrapper.emitted('deny')).toEqual([['call-1']])
  })

  it('opens when the state turns approval-requested', async () => {
    const wrapper = mount(ChatTool, {
      props: { part: weather({ state: 'input-available', output: undefined }) },
    })

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')

    await wrapper.setProps({ part: weather({ state: 'approval-requested', output: undefined }) })

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')
  })

  it('hides the approval actions once the call is answered', () => {
    const wrapper = mount(ChatTool, {
      props: { part: weather({ state: 'output-denied', output: undefined }), defaultOpen: true },
    })

    expect(trigger(wrapper).text()).toContain('Denied:')
    expect(wrapper.find('[data-slot=chat-tool-approval]').exists()).toBe(false)
  })

  it('props override the part', () => {
    const wrapper = mount(ChatTool, {
      props: { part: weather(), toolName: 'forecast', label: 'Called', suffix: '120 ms' },
    })

    const text = trigger(wrapper).text()

    expect(text).toContain('Called')
    expect(text).not.toContain('Used tool:')
    expect(text).toContain('forecast')
    expect(text).toContain('120 ms')
  })
})

describe('chat-tool-group', () => {
  const parts = [
    weather({ toolCallId: 'a' }),
    weather({ toolCallId: 'b', state: 'approval-requested', output: undefined }),
  ]

  it('counts the calls and renders a card per part once expanded', async () => {
    const wrapper = mount(ChatToolGroup, { props: { parts } })
    const groupTrigger = wrapper.find('[data-slot=chat-tool-group-trigger]')

    expect(groupTrigger.text()).toBe('2 tool calls')
    expect(groupTrigger.attributes('aria-expanded')).toBe('false')

    await groupTrigger.trigger('click')

    expect(groupTrigger.attributes('aria-expanded')).toBe('true')
    expect(wrapper.findAll('[data-slot=chat-tool]')).toHaveLength(2)
  })

  it('shows the label in place of the count', () => {
    const wrapper = mount(ChatToolGroup, { props: { parts, label: 'Checked the forecast' } })

    expect(wrapper.find('[data-slot=chat-tool-group-trigger]').text()).toBe('Checked the forecast')
  })

  it('forwards approve and deny with the part', async () => {
    const wrapper = mount(ChatToolGroup, { props: { parts, defaultOpen: true } })

    await wrapper.find('[data-slot=chat-tool-approve]').trigger('click')
    await wrapper.find('[data-slot=chat-tool-deny]').trigger('click')

    expect(wrapper.emitted('approve')).toEqual([[parts[1]]])
    expect(wrapper.emitted('deny')).toEqual([[parts[1]]])
  })
})
