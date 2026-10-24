import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import DashboardGroup from '../src/components/dashboard-group/DashboardGroup.vue'
import DashboardSidebar from '../src/components/dashboard-sidebar/DashboardSidebar.vue'
import DashboardSidebarCollapse from '../src/components/dashboard-sidebar-collapse/DashboardSidebarCollapse.vue'
import { expectAccessible } from './a11y'

/** Clicks like a user, past the millisecond Vue attached the listener in (it drops a click fired within it). */
async function click(el: HTMLElement) {
  const { promise, resolve } = Promise.withResolvers<void>()
  setTimeout(resolve, 2)
  await promise
  el.click()
  await nextTick()
}

const button = (side: 'left' | 'right' = 'left') => document.querySelector<HTMLButtonElement>(`[data-testid=collapse-${side}]`)!

function mountDashboard(collapseProps: Record<string, unknown> = {}) {
  return mount(DashboardGroup, {
    props: { persistent: false },
    slots: {
      default: () => [
        h(DashboardSidebar, { 'id': 'main', 'aria-label': 'Main', 'collapsible': true }, { default: () => h('a', { href: '#inbox' }, 'Inbox') }),
        h('div', [
          h(DashboardSidebarCollapse, { 'data-testid': 'collapse-left', ...collapseProps }),
          h(DashboardSidebarCollapse, { 'data-testid': 'collapse-right', 'side': 'right', ...collapseProps }),
        ]),
        h(DashboardSidebar, { 'id': 'details', 'side': 'right', 'aria-label': 'Details', 'collapsible': true }, { default: () => h('p', 'Details') }),
      ],
    },
    attachTo: document.body,
  })
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('DashboardSidebarCollapse', () => {
  it('is a named native button, expanded and controlling its sidebar, and passes axe', async () => {
    const wrapper = mountDashboard()
    await nextTick()
    const el = button()
    expect(el.tagName).toBe('BUTTON')
    expect(el.getAttribute('type')).toBe('button')
    expect(el.getAttribute('aria-label')).toBe('Collapse sidebar')
    expect(el.getAttribute('aria-expanded')).toBe('true')
    expect(el.getAttribute('aria-controls')).toBe('dashboard-sidebar-main')
    expect(document.getElementById('dashboard-sidebar-main')!.tagName).toBe('ASIDE')
    expect(button('right').getAttribute('aria-controls')).toBe('dashboard-sidebar-details')
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('collapsed: not expanded, renamed to expand, and passes axe', async () => {
    const wrapper = mountDashboard()
    await click(button())
    expect(document.getElementById('dashboard-sidebar-main')!.dataset.collapsed).toBe('true')
    expect(button().getAttribute('aria-expanded')).toBe('false')
    expect(button().getAttribute('aria-label')).toBe('Expand sidebar')
    expect(button().getAttribute('aria-controls')).toBe('dashboard-sidebar-main')
    expect(button('right').getAttribute('aria-expanded')).toBe('true')
    await expectAccessible(document.body)

    await click(button())
    expect(button().getAttribute('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('has no dangling aria-controls while no sidebar is mounted', async () => {
    const wrapper = mount(DashboardGroup, {
      props: { persistent: false },
      slots: { default: () => h(DashboardSidebarCollapse, { 'data-testid': 'collapse-left' }) },
      attachTo: document.body,
    })
    expect(button().hasAttribute('aria-controls')).toBe(false)
    await expectAccessible(document.body)
    wrapper.unmount()
  })

  it('disabled: exposes the native disabled state, does not collapse, and passes axe', async () => {
    const wrapper = mountDashboard({ disabled: true })
    expect(button().disabled).toBe(true)
    await click(button())
    expect(button().getAttribute('aria-expanded')).toBe('true')
    await expectAccessible(document.body)
    wrapper.unmount()
  })
})
