import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import DashboardGroup from '@/components/dashboard-group/DashboardGroup.vue'
import DashboardNavbar from '@/components/dashboard-navbar/DashboardNavbar.vue'
import DashboardPanel from '@/components/dashboard-panel/DashboardPanel.vue'
import DashboardSidebarCollapse from '@/components/dashboard-sidebar-collapse/DashboardSidebarCollapse.vue'
import DashboardSidebar from '@/components/dashboard-sidebar/DashboardSidebar.vue'

import { expectAccessible } from './a11y'

const nav = (label: string) =>
  h('nav', { 'aria-label': label }, [
    h('a', { href: '#inbox' }, 'Inbox'),
    h('a', { href: '#settings' }, 'Settings'),
  ])

/** A full dashboard: a labelled resizable/collapsible sidebar, a panel with a navbar and a labelled aside panel. */
function mountDashboard() {
  return mount(DashboardGroup, {
    props: { persistent: false },
    slots: {
      default: () => [
        h(
          DashboardSidebar,
          { id: 'main', 'aria-label': 'Main', resizable: true, collapsible: true },
          {
            header: () => h('a', { href: '/' }, 'Acme'),
            default: () => nav('Primary'),
            footer: () => h('button', { type: 'button' }, 'Account'),
          },
        ),
        h(
          DashboardPanel,
          { id: 'inbox' },
          {
            header: () =>
              h(
                DashboardNavbar,
                { title: 'Inbox' },
                { leading: () => h(DashboardSidebarCollapse) },
              ),
            body: () => h('p', 'No messages.'),
          },
        ),
        h(
          DashboardSidebar,
          { id: 'details', side: 'right', 'aria-label': 'Details' },
          { default: () => h('p', 'Details') },
        ),
      ],
    },
    attachTo: document.body,
  })
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('DashboardGroup', () => {
  it('adds no landmark of its own around the dashboard, whose complementary landmarks are distinct, and passes axe', async () => {
    const wrapper = mountDashboard()
    await nextTick()
    expect(wrapper.element.hasAttribute('role')).toBe(false)
    const asides = [...document.querySelectorAll('aside')]
    expect(asides.map((a) => a.getAttribute('aria-label'))).toEqual(['Main', 'Details'])
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('passes axe with the sidebar collapsed to its rail from the shared context', async () => {
    const wrapper = mountDashboard()
    // Past the millisecond Vue attached the listener in: it drops a click fired within it.
    const { promise, resolve } = Promise.withResolvers<void>()
    setTimeout(resolve, 2)
    await promise
    document.querySelector<HTMLElement>('[data-slot=dashboard-sidebar-collapse]')!.click()
    await nextTick()
    expect(document.querySelector('#dashboard-sidebar-main')!.getAttribute('data-collapsed')).toBe(
      'true',
    )
    await expectAccessible(document.body)
    wrapper.unmount()
  })
})
