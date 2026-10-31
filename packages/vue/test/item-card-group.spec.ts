import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import ItemCardGroup from '@/components/item-card-group/ItemCardGroup.vue'
import ItemCard from '@/components/item-card/ItemCard.vue'

import { expectAccessible } from './a11y'

const cards = () => [
  h(ItemCard, { title: 'Profile', description: 'Name and photo' }),
  h(ItemCard, { title: 'Security', description: 'Password and sessions', variant: 'outline' }),
]

const cardVariants = (wrapper: VueWrapper) =>
  wrapper.findAll('[data-slot=item-card]').map((card) => card.attributes('data-variant'))

describe('ItemCardGroup', () => {
  it('is accessible with a heading and cards', async () => {
    const wrapper = mount(ItemCardGroup, {
      props: { title: 'Account', description: 'Your sign-in details' },
      slots: { default: cards },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('renders a group named by its title and described by its description', () => {
    const wrapper = mount(ItemCardGroup, {
      props: { title: 'Account', description: 'Your sign-in details' },
      slots: { default: cards },
    })

    const title = wrapper.get('h3[data-slot=item-card-group-title]')
    const description = wrapper.get('p[data-slot=item-card-group-description]')
    expect(wrapper.attributes('role')).toBe('group')
    expect(title.text()).toBe('Account')
    expect(description.text()).toBe('Your sign-in details')
    expect(wrapper.attributes('aria-labelledby')).toBe(title.attributes('id'))
    expect(wrapper.attributes('aria-describedby')).toBe(description.attributes('id'))
  })

  it('renders no header without a title, a description or header slots', () => {
    const wrapper = mount(ItemCardGroup, { slots: { default: cards } })

    expect(wrapper.find('[data-slot=item-card-group-header]').exists()).toBe(false)
    expect(wrapper.attributes('aria-labelledby')).toBeUndefined()
  })

  it('lets the title and description slots replace the props', () => {
    const wrapper = mount(ItemCardGroup, {
      props: { title: 'Account', description: 'Details' },
      slots: { title: () => 'Billing', description: () => 'Cards and invoices', default: cards },
    })

    expect(wrapper.get('[data-slot=item-card-group-title]').text()).toBe('Billing')
    expect(wrapper.get('[data-slot=item-card-group-description]').text()).toBe('Cards and invoices')
  })

  it('lets the header slot replace the whole heading', () => {
    const wrapper = mount(ItemCardGroup, {
      props: { title: 'Account' },
      slots: { header: () => h('h2', 'Workspace'), default: cards },
    })

    expect(wrapper.get('[data-slot=item-card-group-header]').text()).toBe('Workspace')
    expect(wrapper.find('[data-slot=item-card-group-title]').exists()).toBe(false)
  })

  it('passes its variant to cards without their own, and a card variant wins', () => {
    const wrapper = mount(ItemCardGroup, {
      props: { variant: 'secondary' },
      slots: { default: cards },
    })

    expect(wrapper.attributes('data-variant')).toBe('secondary')
    expect(cardVariants(wrapper)).toEqual(['secondary', 'outline'])
  })

  it('passes the default variant to its cards when none is set', () => {
    const wrapper = mount(ItemCardGroup, { slots: { default: cards } })
    expect(cardVariants(wrapper)).toEqual(['default', 'outline'])
  })

  it('updates the cards when the group variant changes', async () => {
    const wrapper = mount(ItemCardGroup, {
      props: { variant: 'tertiary' },
      slots: { default: cards },
    })

    await wrapper.setProps({ variant: 'transparent' })
    expect(cardVariants(wrapper)).toEqual(['transparent', 'outline'])
  })

  it('defaults to the list layout without a column count', () => {
    const wrapper = mount(ItemCardGroup, { slots: { default: cards } })

    expect(wrapper.attributes('data-layout')).toBe('list')

    expect(
      (wrapper.element as HTMLElement).style.getPropertyValue('--item-card-group-columns'),
    ).toBe('')
  })

  it('sets two grid columns by default in the grid layout', () => {
    const wrapper = mount(ItemCardGroup, { props: { layout: 'grid' }, slots: { default: cards } })
    const style = (wrapper.element as HTMLElement).style

    expect(wrapper.attributes('data-layout')).toBe('grid')
    expect(style.getPropertyValue('--item-card-group-columns')).toBe('2')
  })

  it('reflects `columns` in the grid column variable', () => {
    const wrapper = mount(ItemCardGroup, {
      props: { layout: 'grid', columns: 3 },
      slots: { default: cards },
    })

    const style = (wrapper.element as HTMLElement).style
    expect(style.getPropertyValue('--item-card-group-columns')).toBe('3')
  })
})
