import type { VNode } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import Card from '../src/components/card/Card.vue'
import { expectAccessible } from './a11y'

const mountAll = (children: () => VNode[]) => mount(defineComponent(() => () => h('div', children())), { attachTo: document.body })

describe('Card', () => {
  it('omits the header without title, description or #header', () => {
    const wrapper = mount(Card, { slots: { default: 'Body' } })
    expect(wrapper.find('[data-slot=card-header]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=card-content]').text()).toBe('Body')
  })

  it('renders title and description inside the header', () => {
    const wrapper = mount(Card, { props: { title: 'T', description: 'D' } })
    expect(wrapper.find('[data-slot=card-header] h3[data-slot=card-title]').text()).toBe('T')
    expect(wrapper.find('[data-slot=card-header] [data-slot=card-description]').text()).toBe('D')
    expect(wrapper.find('[data-slot=card-content]').exists()).toBe(false)
  })

  it('#header replaces title and description', () => {
    const wrapper = mount(Card, { props: { title: 'T' }, slots: { header: '<strong>Custom</strong>' } })
    expect(wrapper.find('[data-slot=card-header] strong').exists()).toBe(true)
    expect(wrapper.find('[data-slot=card-title]').exists()).toBe(false)
  })

  it('#footer renders the footer element', () => {
    const wrapper = mount(Card, { slots: { footer: 'F' } })
    expect(wrapper.find('[data-slot=card-footer]').text()).toBe('F')
  })

  it('#leading renders unwrapped root children before the header', () => {
    const wrapper = mount(Card, {
      props: { title: 'T' },
      slots: { leading: '<img alt="a"><i>b</i>', default: 'Body' },
    })
    const children = [...wrapper.element.children].map(el => el.getAttribute('data-slot') ?? el.tagName.toLowerCase())
    expect(children).toEqual(['img', 'i', 'card-header', 'card-content'])
  })

  it('is accessible with header, content and footer, and as a labelled article (documented usage)', async () => {
    const wrapper = mountAll(() => [
      h(Card, { title: 'Plan', description: 'Billed monthly' }, {
        default: () => h('p', 'Includes 5 seats.'),
        footer: () => h('button', { type: 'button' }, 'Upgrade'),
      }),
      h(Card, { 'as': 'article', 'aria-labelledby': 'card-title' }, { title: () => h('span', { id: 'card-title' }, 'Article Title') }),
    ])
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('is accessible rendered as a link, its name coming from the contents or aria-label', async () => {
    const wrapper = mount(Card, {
      props: { as: 'a', title: 'Product Name' },
      attrs: { 'href': '/details', 'aria-label': 'View product details' },
      attachTo: document.body,
    })
    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('aria-label')).toBe('View product details')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('the title is a heading and aria-labelledby on the root resolves to it', () => {
    const wrapper = mount(Card, {
      props: { as: 'section' },
      attrs: { 'aria-labelledby': 'plan-title' },
      slots: { title: () => h('span', { id: 'plan-title' }, 'Pro plan') },
      attachTo: document.body,
    })
    expect(wrapper.get('[data-slot=card-title]').element.tagName).toBe('H3')
    expect(document.getElementById(wrapper.attributes('aria-labelledby')!)?.textContent).toBe('Pro plan')
    wrapper.unmount()
  })
})
