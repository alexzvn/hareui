import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ChainOfThought from '@/components/chain-of-thought/ChainOfThought.vue'

const steps = [
  { label: 'Search', content: 'Looking up the forecast.' },
  { label: 'Answer', content: 'It will rain.' },
]

const trigger = (wrapper: ReturnType<typeof mount>) =>
  wrapper.find('[data-slot=chain-of-thought-trigger]')

// The trigger's text as read by assistive tech: the shimmer's aria-hidden highlight copy is left out
const label = (wrapper: ReturnType<typeof mount>) => {
  const clone = trigger(wrapper).element.cloneNode(true) as Element

  clone.querySelectorAll('[aria-hidden="true"]').forEach((node) => node.remove())

  return clone.textContent?.trim()
}

describe('chain-of-thought', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders each step with its label and content', () => {
    const wrapper = mount(ChainOfThought, { props: { steps, defaultOpen: true } })
    const rendered = wrapper.findAll('[data-slot=chain-of-thought-step]')

    expect(rendered).toHaveLength(2)
    expect(rendered[0]!.text()).toContain('Search')
    expect(rendered[0]!.text()).toContain('Looking up the forecast.')
  })

  it('falls back to a single step from text', () => {
    const wrapper = mount(ChainOfThought, { props: { text: 'Plain reasoning', defaultOpen: true } })

    expect(wrapper.findAll('[data-slot=chain-of-thought-step]')).toHaveLength(1)
    expect(wrapper.text()).toContain('Plain reasoning')
  })

  it('starts collapsed when done and toggles on trigger click', async () => {
    const wrapper = mount(ChainOfThought, { props: { steps } })

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')

    await trigger(wrapper).trigger('click')

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')
    expect(wrapper.emitted('update:open')).toEqual([[true]])

    await trigger(wrapper).trigger('click')

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')
  })

  it('labels the trigger with the streaming state and the duration', async () => {
    const wrapper = mount(ChainOfThought, { props: { steps, streaming: true } })

    expect(label(wrapper)).toBe('Thinking…')

    await wrapper.setProps({ streaming: false, duration: 4 })

    expect(label(wrapper)).toBe('Thought for 4 seconds')

    await wrapper.setProps({ duration: undefined, label: 'Reasoned' })

    expect(label(wrapper)).toBe('Reasoned')
  })

  it('opens while streaming and collapses after the close delay', async () => {
    vi.useFakeTimers()

    const wrapper = mount(ChainOfThought, { props: { steps, streaming: true } })

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')

    await wrapper.setProps({ streaming: false })

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')

    vi.advanceTimersByTime(500)
    await wrapper.vm.$nextTick()

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')
  })

  it('keeps the user choice made during streaming', async () => {
    vi.useFakeTimers()

    const wrapper = mount(ChainOfThought, { props: { steps, streaming: true } })

    await trigger(wrapper).trigger('click')
    await trigger(wrapper).trigger('click')
    await wrapper.setProps({ streaming: false })

    vi.advanceTimersByTime(1000)
    await wrapper.vm.$nextTick()

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')
  })

  it('stays collapsed while streaming when auto.open is off', () => {
    const wrapper = mount(ChainOfThought, {
      props: { steps, streaming: true, auto: { open: false } },
    })

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('false')
  })

  it('stays open after streaming when auto.closeDelay is 0', async () => {
    vi.useFakeTimers()

    const wrapper = mount(ChainOfThought, {
      props: { steps, streaming: true, auto: { closeDelay: 0 } },
    })

    await wrapper.setProps({ streaming: false })
    vi.advanceTimersByTime(5000)
    await wrapper.vm.$nextTick()

    expect(trigger(wrapper).attributes('aria-expanded')).toBe('true')
  })

  it('renders a step icon in place of the dot and marks the step status', () => {
    const wrapper = mount(ChainOfThought, {
      props: {
        defaultOpen: true,
        steps: [
          { label: 'Read', icon: 'gravity-ui:file', status: 'done' },
          { label: 'Write', status: 'active' },
          { label: 'Check', status: 'pending' },
        ],
      },
    })

    const rendered = wrapper.findAll('[data-slot=chain-of-thought-step]')

    expect(rendered.map((step) => step.attributes('data-status'))).toEqual([
      'done',
      'active',
      'pending',
    ])

    expect(rendered[0]!.find('[data-slot=chain-of-thought-step-icon]').exists()).toBe(true)
    expect(rendered[0]!.find('.rounded-full').exists()).toBe(false)
    expect(rendered[1]!.find('[data-slot=text-shimmer]').exists()).toBe(true)
  })
})
