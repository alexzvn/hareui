import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Footer from '@/components/footer/Footer.vue'

import { expectAccessible } from './a11y'

const links = () =>
  h('nav', { 'aria-label': 'Footer' }, [
    h('a', { href: '/docs' }, 'Docs'),
    h('a', { href: '/blog' }, 'Blog'),
  ])

describe('Footer', () => {
  it('renders the contentinfo landmark (a top-level footer) with all its slots, and passes axe', async () => {
    const wrapper = mount(Footer, {
      slots: {
        top: () => h('p', 'Columns'),
        left: () => h('p', 'Copyright 2026'),
        default: links,
        right: () =>
          h(
            'a',
            { href: 'https://github.com', 'aria-label': 'GitHub' },
            h('svg', { 'aria-hidden': 'true' }),
          ),
        bottom: () => h('p', 'Made with Vue'),
      },
      attachTo: document.body,
    })

    const footer = document.querySelector('footer')!

    // A footer outside sectioning content maps to the contentinfo landmark.
    expect(footer.closest('article, aside, main, nav, section')).toBeNull()
    expect(footer.querySelector('nav[aria-label=Footer]')).not.toBeNull()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('passes axe with only the centre slot filled (empty start/end areas expose nothing)', async () => {
    const wrapper = mount(Footer, { slots: { default: links }, attachTo: document.body })
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('as swaps the element, e.g. to avoid a second contentinfo inside an article', async () => {
    const wrapper = mount(Footer, {
      props: { as: 'div' },
      slots: { default: links },
      attachTo: document.body,
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.find('footer').exists()).toBe(false)
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
