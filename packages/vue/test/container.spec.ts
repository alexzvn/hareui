import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'

import Container from '@/components/container/Container.vue'

import { expectAccessible } from './a11y'

describe('Container', () => {
  it('adds no landmark or role of its own and passes axe', async () => {
    const wrapper = mount(Container, {
      slots: { default: () => [h('h2', 'Pricing'), h('p', 'Plans for every team.')] },
      attachTo: document.body,
    })

    expect(wrapper.element.tagName).toBe('DIV')
    expect(wrapper.element.hasAttribute('role')).toBe(false)
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('as renders a semantic element that keeps the attributes naming it', async () => {
    const wrapper = mount(Container, {
      props: { as: 'section' },
      attrs: { 'aria-labelledby': 'pricing' },
      slots: { default: () => h('h2', { id: 'pricing' }, 'Pricing') },
      attachTo: document.body,
    })

    const section = document.querySelector('section')!
    expect(section.getAttribute('aria-labelledby')).toBe('pricing')
    expect(document.getElementById('pricing')!.textContent).toBe('Pricing')
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
