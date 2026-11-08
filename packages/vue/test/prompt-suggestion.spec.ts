import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import type { PromptSuggestionGroup, PromptSuggestionItem } from '@/components/prompt-suggestion'
import { PromptSuggestion } from '@/components/prompt-suggestion'

import { expectAccessible } from './a11y'

const mountSuggestions = (props: Record<string, unknown> = {}, slots = {}) =>
  mount(PromptSuggestion, { props, slots, attachTo: document.body })

const buttons = (wrapper: ReturnType<typeof mountSuggestions>) =>
  wrapper.findAll('[data-slot=prompt-suggestion-item]')

describe('PromptSuggestion', () => {
  it('renders one button per suggestion, with strings as labels', async () => {
    const wrapper = mountSuggestions({
      title: 'What do you want to work on?',
      items: ['Summarize a document', { label: 'Plan a trip' }],
    })

    expect(wrapper.get('h2').text()).toBe('What do you want to work on?')
    expect(buttons(wrapper).map((b) => b.text())).toEqual(['Summarize a document', 'Plan a trip'])
    expect(buttons(wrapper).every((b) => b.element.tagName === 'BUTTON')).toBe(true)
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('emits select with the label of a plain suggestion', async () => {
    const wrapper = mountSuggestions({ items: ['Summarize a document'] })

    await buttons(wrapper)[0]!.trigger('click')

    expect(wrapper.emitted('select')).toEqual([
      ['Summarize a document', { label: 'Summarize a document' }],
    ])

    wrapper.unmount()
  })

  it('emits the full prompt and the item when a suggestion has its own prompt', async () => {
    const item: PromptSuggestionItem = {
      label: 'Weekly report',
      prompt: 'Draft a weekly status report from my notes.',
    }

    const wrapper = mountSuggestions({ items: [item] })

    await buttons(wrapper)[0]!.trigger('click')

    expect(wrapper.emitted('select')).toEqual([[item.prompt, item]])
    wrapper.unmount()
  })

  it('does not emit for a disabled suggestion or a disabled list', async () => {
    const wrapper = mountSuggestions({ items: [{ label: 'Off', disabled: true }, 'On'] })

    await buttons(wrapper)[0]!.trigger('click')
    expect(buttons(wrapper)[0]!.attributes('disabled')).toBeDefined()
    expect(wrapper.emitted('select')).toBeUndefined()

    await wrapper.setProps({ disabled: true })
    await buttons(wrapper)[1]!.trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
    wrapper.unmount()
  })

  it('renders groups with their label and emits from grouped suggestions', async () => {
    const groups: PromptSuggestionGroup[] = [
      { label: 'Write', items: ['Draft an email'] },
      { label: 'Code', description: 'Ship faster', items: ['Review a pull request'] },
    ]

    const wrapper = mountSuggestions({ variant: 'card', groups })
    const sections = wrapper.findAll('[data-slot=prompt-suggestion-group]')

    expect(sections.map((s) => s.get('h3').text())).toEqual(['Write', 'Code'])

    expect(sections[1]!.get('[data-slot=prompt-suggestion-group-description]').text()).toBe(
      'Ship faster',
    )

    await buttons(wrapper)[1]!.trigger('click')

    expect(wrapper.emitted('select')).toEqual([
      ['Review a pull request', { label: 'Review a pull request' }],
    ])

    wrapper.unmount()
  })

  it('renders card meta and tags, and replaces a suggestion through its slot', () => {
    const wrapper = mountSuggestions(
      {
        variant: 'card',
        items: [
          { label: 'Launch plan', meta: '5 min', tags: ['Planning'] },
          { label: 'Custom', slot: 'custom' },
        ],
      },
      { custom: ({ item }: { item: PromptSuggestionItem }) => h('span', `Slot: ${item.label}`) },
    )

    const [card, custom] = buttons(wrapper)

    expect(card!.get('[data-slot=prompt-suggestion-item-meta]').text()).toBe('5 min')
    expect(card!.get('[data-slot=prompt-suggestion-item-tags]').text()).toBe('Planning')
    expect(custom!.text()).toBe('Slot: Custom')
    wrapper.unmount()
  })

  it('shows the trailing chevron on pills by default and hides it with trailing-icon false', () => {
    const trailing = '[data-slot=prompt-suggestion-item-trailing]'
    const wrapper = mountSuggestions({ items: ['Plan a trip'] })
    const hidden = mountSuggestions({ items: ['Plan a trip'], trailingIcon: false })

    expect(wrapper.find(trailing).exists()).toBe(true)
    expect(hidden.find(trailing).exists()).toBe(false)

    wrapper.unmount()
    hidden.unmount()
  })
})
