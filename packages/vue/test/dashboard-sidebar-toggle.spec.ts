import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'

import DashboardGroup from '@/components/dashboard-group/DashboardGroup.vue'
import DashboardSidebarToggle from '@/components/dashboard-sidebar-toggle/DashboardSidebarToggle.vue'
import DashboardSidebar from '@/components/dashboard-sidebar/DashboardSidebar.vue'

import { expectAccessible } from './a11y'

const settle = async () => {
  for (let i = 0; i < 4; i++) await nextTick()
}

/** Clicks like a user, past the millisecond Vue attached the listener in (it drops a click fired within it), then settles. */
const click = async (el: HTMLElement) => {
  const { promise, resolve } = Promise.withResolvers<void>()
  setTimeout(resolve, 2)
  await promise
  el.click()
  await settle()
}

const toggle = (side: 'left' | 'right' = 'left') =>
  document.querySelector<HTMLButtonElement>(`[data-testid=toggle-${side}]`)!

const mountDashboard = (toggleProps: Record<string, unknown> = {}) => {
  return mount(DashboardGroup, {
    props: { persistent: false },
    slots: {
      default: () => [
        h(
          DashboardSidebar,
          { id: 'main', 'aria-label': 'Main' },
          { default: () => h('a', { href: '#inbox' }, 'Inbox') },
        ),
        h('div', [
          h(DashboardSidebarToggle, { 'data-testid': 'toggle-left', ...toggleProps }),
          h(DashboardSidebarToggle, {
            'data-testid': 'toggle-right',
            side: 'right',
            ...toggleProps,
          }),
        ]),
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

describe('DashboardSidebarToggle', () => {
  it('is a named native button, collapsed and controlling nothing while the menu is closed, and passes axe', async () => {
    const wrapper = mountDashboard()
    const el = toggle()

    // A native <button type="button">: Tab reaches it, Enter and Space activate it.
    expect(el.tagName).toBe('BUTTON')
    expect(el.getAttribute('type')).toBe('button')
    expect(el.getAttribute('aria-label')).toBe('Open sidebar')
    expect(el.getAttribute('aria-expanded')).toBe('false')
    expect(el.hasAttribute('aria-controls')).toBe(false)
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('once open, is expanded, renamed and controls the sidebar menu inside the dialog', async () => {
    const wrapper = mountDashboard()
    await click(toggle())
    const el = toggle()
    expect(el.getAttribute('aria-expanded')).toBe('true')
    expect(el.getAttribute('aria-label')).toBe('Close sidebar')
    expect(el.getAttribute('aria-controls')).toBe('dashboard-sidebar-main-menu')
    const menu = document.getElementById(el.getAttribute('aria-controls')!)!
    expect(menu.closest('[role=dialog]')).not.toBeNull()
    expect(menu.textContent).toContain('Inbox')

    // The right toggle controls the right sidebar only.
    expect(toggle('right').getAttribute('aria-expanded')).toBe('false')
    wrapper.unmount()
  })

  it('passes axe with the menu open', async () => {
    const wrapper = mountDashboard()
    await click(toggle('right'))
    expect(toggle('right').getAttribute('aria-controls')).toBe('dashboard-sidebar-details-menu')
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('disabled: exposes the native disabled state, does not open, and passes axe', async () => {
    const wrapper = mountDashboard({ disabled: true })
    expect(toggle().disabled).toBe(true)
    await click(toggle())
    expect(toggle().getAttribute('aria-expanded')).toBe('false')
    expect(document.querySelector('[role=dialog]')).toBeNull()
    await expectAccessible(document.body)
    wrapper.unmount()
  })
})
