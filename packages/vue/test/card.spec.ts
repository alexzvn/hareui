import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Card from '../src/components/card/Card.vue'

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
})
