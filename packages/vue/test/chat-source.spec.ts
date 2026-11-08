import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import ChatSource from '@/components/chat-source/ChatSource.vue'
import ChatSources from '@/components/chat-source/ChatSources.vue'
import type { ChatSourceDocumentPart, ChatSourceUrlPart } from '@/types/chat'

const urlPart: ChatSourceUrlPart = {
  type: 'source-url',
  sourceId: 's1',
  url: 'https://www.example.com/guide',
  title: 'Example guide',
}

const documentPart: ChatSourceDocumentPart = {
  type: 'source-document',
  sourceId: 's2',
  mediaType: 'application/pdf',
  title: '',
  filename: 'report.pdf',
}

describe('chat-source', () => {
  it('links a url part in a new tab with its title', () => {
    const wrapper = mount(ChatSource, { props: { part: urlPart } })
    const link = wrapper.find('a[data-slot=chat-source-trigger]')

    expect(link.attributes('href')).toBe('https://www.example.com/guide')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
    expect(link.text()).toContain('Example guide')
  })

  it('falls back to the domain without a title, with its initial as icon', () => {
    const wrapper = mount(ChatSource, { props: { href: 'https://www.example.com/a' } })

    expect(wrapper.find('[data-slot=chat-source-title]').text()).toBe('example.com')
    expect(wrapper.find('[data-slot=chat-source-icon]').text()).toBe('E')
  })

  it('renders a document part as plain text named after the file', () => {
    const wrapper = mount(ChatSource, { props: { part: documentPart } })

    expect(wrapper.attributes('data-source-type')).toBe('document')
    expect(wrapper.find('a').exists()).toBe(false)
    expect(wrapper.find('[data-slot=chat-source-title]').text()).toBe('report.pdf')
  })
})

describe('chat-sources', () => {
  it('counts the sources and lists them once expanded', async () => {
    const wrapper = mount(ChatSources, { props: { sources: [urlPart, documentPart] } })
    const trigger = wrapper.find('[data-slot=chat-sources-trigger]')

    expect(trigger.text()).toBe('2 sources')
    expect(trigger.attributes('aria-expanded')).toBe('false')

    await trigger.trigger('click')

    expect(trigger.attributes('aria-expanded')).toBe('true')
    expect(wrapper.findAll('[data-slot=chat-source]')).toHaveLength(2)
    expect(wrapper.emitted('update:open')).toEqual([[true]])
  })

  it('stacks up to the given number of favicons', () => {
    const sources = ['a', 'b', 'c'].map((name) => ({
      href: `https://${name}.com`,
      favicon: `https://${name}.com/favicon.ico`,
    }))

    const wrapper = mount(ChatSources, { props: { sources, maxFavicons: 2 } })

    expect(wrapper.findAll('[data-slot=chat-sources-favicons] img')).toHaveLength(2)
    expect(wrapper.find('[data-slot=chat-sources-trigger]').text()).toBe('3 sources')
  })

  it('replaces the trigger text with label', () => {
    const wrapper = mount(ChatSources, { props: { sources: [urlPart], label: 'Sources' } })

    expect(wrapper.find('[data-slot=chat-sources-trigger]').text()).toBe('Sources')
  })
})
