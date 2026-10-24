import type { VNode } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Typography from '../src/components/typography/Typography.vue'
import { expectAccessible } from './a11y'

const mountAll = (children: () => VNode[]) => mount(defineComponent(() => () => h('div', children())), { attachTo: document.body })

describe('Typography', () => {
  it('defaults to a <p> body element', () => {
    const wrapper = mount(Typography, { slots: { default: 'Hello' } })
    expect(wrapper.element.tagName).toBe('P')
    expect(wrapper.attributes('data-slot')).toBe('typography')
    expect(wrapper.attributes('data-type')).toBe('body')
    expect(wrapper.text()).toBe('Hello')
  })

  it.each([
    ['h1', 'H1'],
    ['h2', 'H2'],
    ['h3', 'H3'],
    ['h4', 'H4'],
    ['h5', 'H5'],
    ['h6', 'H6'],
    ['body', 'P'],
    ['body-sm', 'P'],
    ['body-xs', 'P'],
    ['code', 'CODE'],
  ] as const)('renders %s as a <%s>', (type, tag) => {
    const wrapper = mount(Typography, { props: { type } })
    expect(wrapper.element.tagName).toBe(tag)
    expect(wrapper.attributes('data-type')).toBe(type)
  })

  it('as overrides the element implied by type', () => {
    const wrapper = mount(Typography, { props: { as: 'h2', type: 'h1' } })
    expect(wrapper.element.tagName).toBe('H2')
    expect(wrapper.attributes('data-type')).toBe('h1')
    expect(wrapper.classes()).toContain('text-4xl')
  })

  it('weight overrides the type default font weight', () => {
    const wrapper = mount(Typography, { props: { type: 'h1', weight: 'normal' } })
    expect(wrapper.classes()).toContain('font-normal')
  })

  it('truncate adds block truncate classes', () => {
    const wrapper = mount(Typography, { props: { truncate: true } })
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['block', 'truncate']))
  })

  it('prose renders a div[data-slot=prose] without typography data-attrs, ignoring type', () => {
    const wrapper = mount(Typography, {
      props: { prose: true, type: 'h1' },
      slots: { default: '<h1>Title</h1><p>Body</p>' },
    })
    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.attributes('data-slot')).toBe('prose')
    expect(wrapper.attributes('data-type')).toBeUndefined()
    expect(wrapper.classes()).not.toContain('text-4xl')
    expect(wrapper.find('h1').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(true)
  })

  it('class prop wins over theme classes (tailwind-merge)', () => {
    const wrapper = mount(Typography, { props: { type: 'h1', class: 'text-sm' } })
    expect(wrapper.classes()).toContain('text-sm')
    expect(wrapper.classes()).not.toContain('text-4xl')
  })

  it('ui.base overrides merge into the root class', () => {
    const wrapper = mount(Typography, { props: { ui: { base: 'italic' } } })
    expect(wrapper.classes()).toContain('italic')
  })

  it('is accessible as a heading outline, body text and code', async () => {
    const wrapper = mountAll(() => [
      h(Typography, { type: 'h1' }, () => 'Getting started'),
      h(Typography, { type: 'h2' }, () => 'Install'),
      h(Typography, { type: 'body-sm', color: 'muted' }, () => 'Run the command below.'),
      h(Typography, { type: 'code' }, () => 'bun add @hareui/vue'),
      h(Typography, { type: 'h3', truncate: true, title: 'A very long heading' }, () => 'A very long heading'),
    ])
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is accessible as prose with headings, links, lists and code', async () => {
    const wrapper = mount(Typography, {
      props: { prose: true, as: 'article' },
      slots: { default: '<h2>Usage</h2><p>See <a href="/docs">the docs</a>.</p><ul><li>One</li><li>Two</li></ul><pre><code>x</code></pre>' },
      attachTo: document.body,
    })
    expect(wrapper.element.tagName).toBe('ARTICLE')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
