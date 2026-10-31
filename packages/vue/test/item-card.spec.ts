import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'

import ItemCard from '@/components/item-card/ItemCard.vue'

import { expectAccessible } from './a11y'

const Glyph = defineComponent(() => () => h('svg', { 'data-test': 'glyph' }))

// A minimal vue-router RouterLink: it hands the link state to its slot and records navigation.
const routerStub = (navigate: (to: unknown) => void) =>
  defineComponent({
    props: { to: { type: [String, Object], required: true }, custom: Boolean, replace: Boolean },
    setup(props, { slots }) {
      return () =>
        slots.default?.({
          href: `/app${props.to}`,
          isActive: props.to === '/settings',
          isExactActive: props.to === '/settings',
          navigate: () => navigate(props.to),
        })
    },
  })

describe('ItemCard', () => {
  it('is accessible with an icon, a title, a description and an action', async () => {
    const wrapper = mount(ItemCard, {
      props: { icon: Glyph, title: 'Backups', description: 'Nightly at 02:00' },
      slots: { action: () => h('button', { type: 'button' }, 'Edit') },
      attachTo: document.body,
    })

    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('renders the icon, title and description props', () => {
    const wrapper = mount(ItemCard, {
      props: { icon: Glyph, title: 'Backups', description: 'Nightly at 02:00' },
    })

    expect(wrapper.find('[data-slot=item-card-icon] [data-test=glyph]').exists()).toBe(true)
    expect(wrapper.get('[data-slot=item-card-title]').text()).toBe('Backups')
    expect(wrapper.get('[data-slot=item-card-description]').text()).toBe('Nightly at 02:00')
  })

  it('renders an icon class string as a decorative span', () => {
    const wrapper = mount(ItemCard, { props: { icon: 'i-test-cloud', title: 'Sync' } })
    const icon = wrapper.get('[data-slot=item-card-icon] > span.i-test-cloud')

    expect(icon.attributes('aria-hidden')).toBe('true')
  })

  it('omits the icon, description and action elements when nothing fills them', () => {
    const wrapper = mount(ItemCard, { props: { title: 'Sync' } })

    expect(wrapper.find('[data-slot=item-card-icon]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=item-card-description]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=item-card-action]').exists()).toBe(false)
  })

  it('lets the slots replace the icon, title and description props', () => {
    const wrapper = mount(ItemCard, {
      props: { icon: Glyph, title: 'Backups', description: 'Nightly' },
      slots: {
        icon: () => h('span', { 'data-test': 'emoji' }, '☁'),
        title: () => 'Custom title',
        description: () => 'Custom description',
      },
    })

    expect(wrapper.find('[data-test=glyph]').exists()).toBe(false)
    expect(wrapper.get('[data-slot=item-card-icon]').text()).toBe('☁')
    expect(wrapper.get('[data-slot=item-card-title]').text()).toBe('Custom title')
    expect(wrapper.get('[data-slot=item-card-description]').text()).toBe('Custom description')
  })

  it('renders the action slot at the end of the row and the default slot under the text', () => {
    const wrapper = mount(ItemCard, {
      props: { title: 'Storage' },
      slots: { action: () => 'Manage', default: () => h('progress', { value: 40, max: 100 }) },
    })

    const lastChild = (wrapper.element as HTMLElement).lastElementChild
    expect(lastChild?.getAttribute('data-slot')).toBe('item-card-action')
    expect(wrapper.get('[data-slot=item-card-action]').text()).toBe('Manage')
    expect(wrapper.find('[data-slot=item-card-content] > progress').exists()).toBe(true)
  })

  it('renders a div by default and the element given in `as`', () => {
    const plain = mount(ItemCard, { props: { title: 'Sync' } })
    const item = mount(ItemCard, { props: { title: 'Sync', as: 'li' } })

    expect(plain.element.tagName).toBe('DIV')
    expect(item.element.tagName).toBe('LI')
  })

  it('defaults to the default variant in data-variant', () => {
    const wrapper = mount(ItemCard, { props: { title: 'Sync' } })
    expect(wrapper.attributes('data-variant')).toBe('default')
  })

  it('reflects the variant prop in data-variant', () => {
    const wrapper = mount(ItemCard, { props: { title: 'Sync', variant: 'outline' } })
    expect(wrapper.attributes('data-variant')).toBe('outline')
  })

  it('renders an anchor with `href`', () => {
    const wrapper = mount(ItemCard, { props: { title: 'Docs', href: 'https://example.com' } })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('https://example.com')
  })

  it('renders `to` as a plain anchor without a router', () => {
    const wrapper = mount(ItemCard, { props: { title: 'Settings', to: '/settings' } })

    expect(wrapper.element.tagName).toBe('A')
    expect(wrapper.attributes('href')).toBe('/settings')
  })

  it('adds `noopener noreferrer` to a new-tab link', () => {
    const wrapper = mount(ItemCard, {
      props: { title: 'Docs', href: 'https://example.com', target: '_blank' },
    })

    expect(wrapper.attributes('target')).toBe('_blank')
    expect(wrapper.attributes('rel')).toBe('noopener noreferrer')
  })

  it('routes `to` through RouterLink when the app registers it', async () => {
    const navigate = vi.fn<(to: unknown) => void>()

    const wrapper = mount(ItemCard, {
      props: { title: 'Settings', to: '/settings' },
      global: { components: { RouterLink: routerStub(navigate) } },
    })

    const anchor = wrapper.get('a')
    expect(anchor.attributes('href')).toBe('/app/settings')
    expect(anchor.attributes('data-slot')).toBe('item-card')
    expect(anchor.attributes('data-active')).toBe('true')
    await anchor.trigger('click')
    expect(navigate).toHaveBeenCalledWith('/settings')
  })

  it('passes attributes to the anchor rendered through RouterLink', () => {
    const wrapper = mount(ItemCard, {
      props: { title: 'Settings', to: '/settings' },
      attrs: { id: 'settings-card' },
      global: { components: { RouterLink: routerStub(vi.fn<(to: unknown) => void>()) } },
    })

    expect(wrapper.get('a').attributes('id')).toBe('settings-card')
  })

  it('drops `href` and sets aria-disabled on a disabled link', () => {
    const wrapper = mount(ItemCard, { props: { title: 'Docs', href: '/docs', disabled: true } })

    expect(wrapper.attributes('href')).toBeUndefined()
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('renders a button that emits the click when it has a click listener', async () => {
    const onClick = vi.fn<(event: MouseEvent) => void>()
    const wrapper = mount(ItemCard, { props: { title: 'Profile', onClick } })

    expect(wrapper.element.tagName).toBe('BUTTON')
    expect(wrapper.attributes('type')).toBe('button')
    await wrapper.trigger('click')
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('disables the button of a disabled card with a click listener', () => {
    const wrapper = mount(ItemCard, {
      props: { title: 'Profile', disabled: true, onClick: () => {} },
    })

    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('keeps the `as` element when a click listener is set', () => {
    const wrapper = mount(ItemCard, { props: { title: 'Profile', as: 'li', onClick: () => {} } })
    expect(wrapper.element.tagName).toBe('LI')
  })
})
