import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { defineComponent, h } from 'vue'

import DashboardNavbar from '@/components/dashboard-navbar/DashboardNavbar.vue'
import DashboardSidebarCollapse from '@/components/dashboard-sidebar-collapse/DashboardSidebarCollapse.vue'
import DashboardSidebarToggle from '@/components/dashboard-sidebar-toggle/DashboardSidebarToggle.vue'
import { createDashboardSidebarState, provideDashboardContext } from '@/composables/useDashboard'

// Provides the dashboard context the way DashboardGroup does, without depending on the group.
const mountInDashboard = (render: () => VNode) => {
  const left = createDashboardSidebarState()
  const right = createDashboardSidebarState()
  const Harness = defineComponent({
    setup() {
      provideDashboardContext({
        storage: 'local',
        storageKey: 'test',
        persistent: false,
        unit: 'rem',
        sidebarOpen: left.open,
        toggleSidebar: left.toggle,
        sidebarCollapsed: left.collapsed,
        collapseSidebar: left.collapse,
        sidebars: { left, right },
      })

      return render
    },
  })

  return mount(Harness)
}

describe('DashboardSidebarToggle theme', () => {
  it('is hidden from md', () => {
    const wrapper = mountInDashboard(() => h(DashboardSidebarToggle))
    expect(wrapper.get('[data-slot=dashboard-sidebar-toggle]').classes()).toContain('md:hidden')
  })
})

describe('DashboardSidebarCollapse theme', () => {
  it('is hidden below md and centres itself on a collapsed sidebar rail', () => {
    const wrapper = mountInDashboard(() => h(DashboardSidebarCollapse))
    expect(wrapper.get('[data-slot=dashboard-sidebar-collapse]').classes()).toEqual(
      expect.arrayContaining(['hidden', 'md:flex', 'group-data-[collapsed=true]/sidebar:mx-auto']),
    )
  })
})

describe('DashboardNavbar theme', () => {
  it('forwards an object toggle class to the button, keeping the toggle classes', () => {
    const custom = mountInDashboard(() =>
      h(DashboardNavbar, { toggle: { variant: 'secondary', class: 'rounded-full' } }),
    ).get('[data-slot=dashboard-navbar-toggle]')

    expect(custom.classes()).toContain('rounded-full')
    expect(custom.classes()).toEqual(expect.arrayContaining(['md:hidden']))
  })

  it('toggle.class overrides the toggle slot classes, such as the optical offset', () => {
    const ghost = mountInDashboard(() => h(DashboardNavbar)).get(
      '[data-slot=dashboard-navbar-toggle]',
    )

    expect(ghost.classes()).toEqual(expect.arrayContaining(['-ms-2.5', 'md:-ms-2']))

    const filled = mountInDashboard(() =>
      h(DashboardNavbar, { toggle: { variant: 'secondary', class: 'ms-0 md:ms-0' } }),
    ).get('[data-slot=dashboard-navbar-toggle]')

    expect(filled.classes()).toEqual(expect.arrayContaining(['ms-0', 'md:ms-0']))
    expect(filled.classes()).not.toContain('-ms-2.5')
    expect(filled.classes()).not.toContain('md:-ms-2')
  })
})
