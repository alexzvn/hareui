import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import DashboardToolbar from '../src/components/dashboard-toolbar/DashboardToolbar.vue'
import { expectAccessible } from './a11y'

describe('DashboardToolbar', () => {
  // A layout row, not an ARIA toolbar: it has no roving focus, so every control stays in the Tab order.
  it('passes axe with links and buttons in both groups, all of them reachable with Tab', async () => {
    const wrapper = mount(DashboardToolbar, {
      slots: {
        left: () => h('nav', { 'aria-label': 'Sections' }, [h('a', { href: '#all' }, 'All'), h('a', { href: '#unread' }, 'Unread')]),
        right: () => h('button', { type: 'button' }, 'Filter'),
      },
      attachTo: document.body,
    })
    expect(wrapper.element.getAttribute('role')).toBeNull()
    for (const el of wrapper.findAll('a, button'))
      expect(el.attributes('tabindex')).toBeUndefined()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })

  it('as renders a named region when the consumer wants one', async () => {
    const wrapper = mount(DashboardToolbar, {
      props: { as: 'nav' },
      attrs: { 'aria-label': 'Inbox filters' },
      slots: { left: () => h('a', { href: '#all' }, 'All') },
      attachTo: document.body,
    })
    expect(document.querySelector('nav[aria-label="Inbox filters"]')).not.toBeNull()
    await expectAccessible(wrapper)
    wrapper.unmount()
  })
})
