import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import type { VNode } from 'vue'
import { defineComponent, h } from 'vue'

import DashboardGroup from '@/components/dashboard-group/DashboardGroup.vue'
import DashboardNavbar from '@/components/dashboard-navbar/DashboardNavbar.vue'
import DashboardSidebarCollapse from '@/components/dashboard-sidebar-collapse/DashboardSidebarCollapse.vue'
import DashboardSidebarToggle from '@/components/dashboard-sidebar-toggle/DashboardSidebarToggle.vue'
import DashboardSidebar from '@/components/dashboard-sidebar/DashboardSidebar.vue'
import DashboardToolbar from '@/components/dashboard-toolbar/DashboardToolbar.vue'
import { createDashboardSidebarState, provideDashboardContext } from '@/composables/useDashboard'

import { expectAccessible } from './a11y'

// Provides the dashboard context the way DashboardGroup does, without depending on the group.
function mountInDashboard(render: () => VNode) {
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
  return { wrapper: mount(Harness), left, right }
}

const toggle = '[data-slot=dashboard-sidebar-toggle]'
const collapse = '[data-slot=dashboard-sidebar-collapse]'

describe('dashboardSidebarToggle', () => {
  it('toggles the left sidebar by default and leaves the right one alone', async () => {
    const { wrapper, left, right } = mountInDashboard(() => h(DashboardSidebarToggle))
    const button = wrapper.get(toggle)
    expect(button.attributes('aria-label')).toBe('Open sidebar')
    expect(button.attributes('aria-expanded')).toBe('false')

    await button.trigger('click')
    expect(left.open.value).toBe(true)
    expect(right.open.value).toBe(false)
    expect(button.attributes('aria-label')).toBe('Close sidebar')
    expect(button.attributes('aria-expanded')).toBe('true')

    await button.trigger('click')
    expect(left.open.value).toBe(false)
  })

  it('side="right" drives sidebars.right only', async () => {
    const { wrapper, left, right } = mountInDashboard(() =>
      h(DashboardSidebarToggle, { side: 'right' }),
    )
    await wrapper.get(toggle).trigger('click')
    expect(right.open.value).toBe(true)
    expect(left.open.value).toBe(false)
  })

  it('reflects state changed elsewhere (e.g. the sheet closing) and swaps the menu icon for a close icon', async () => {
    const { wrapper, left } = mountInDashboard(() => h(DashboardSidebarToggle))
    const menuIcon = wrapper.get(`${toggle} path`).attributes('d')
    left.open.value = true
    await wrapper.vm.$nextTick()
    expect(wrapper.get(toggle).attributes('aria-expanded')).toBe('true')
    expect(wrapper.get(toggle).attributes('aria-label')).toBe('Close sidebar')
    expect(wrapper.get(`${toggle} path`).attributes('d')).not.toBe(menuIcon)
    left.open.value = false
    await wrapper.vm.$nextTick()
    expect(wrapper.get(`${toggle} path`).attributes('d')).toBe(menuIcon)
  })

  it('is hidden from md and defaults to a ghost, icon-only button', () => {
    const { wrapper } = mountInDashboard(() => h(DashboardSidebarToggle))
    const classes = wrapper.get(toggle).classes()
    expect(classes).toContain('md:hidden')
    expect(wrapper.get(toggle).attributes('data-slot')).toBe('dashboard-sidebar-toggle')
    expect(wrapper.get(toggle).find('svg').exists()).toBe(true)
  })

  it('does nothing outside a dashboard group', async () => {
    const wrapper = mount(DashboardSidebarToggle)
    await wrapper.trigger('click')
    expect(wrapper.attributes('aria-expanded')).toBe('false')
  })

  it('lets a native @click and aria-label attr through', async () => {
    let clicks = 0
    const { wrapper, left } = mountInDashboard(() =>
      h(DashboardSidebarToggle, { 'aria-label': 'Menu', onClick: () => clicks++ }),
    )
    await wrapper.get(toggle).trigger('click')
    expect(clicks).toBe(1)
    expect(left.open.value).toBe(true)
    expect(wrapper.get(toggle).attributes('aria-label')).toBe('Menu')
  })
})

describe('dashboardSidebarCollapse', () => {
  it('collapses and expands the left sidebar, aliased by the context refs', async () => {
    const { wrapper, left, right } = mountInDashboard(() => h(DashboardSidebarCollapse))
    const button = wrapper.get(collapse)
    expect(button.attributes('aria-label')).toBe('Collapse sidebar')
    expect(button.attributes('aria-expanded')).toBe('true')

    await button.trigger('click')
    expect(left.collapsed.value).toBe(true)
    expect(right.collapsed.value).toBe(false)
    expect(button.attributes('aria-label')).toBe('Expand sidebar')
    expect(button.attributes('aria-expanded')).toBe('false')

    await button.trigger('click')
    expect(left.collapsed.value).toBe(false)
  })

  it('side="right" collapses sidebars.right only and mirrors the icon', async () => {
    const leftIcon = mountInDashboard(() => h(DashboardSidebarCollapse))
      .wrapper.get(`${collapse} path`)
      .attributes('d')
    const { wrapper, left, right } = mountInDashboard(() =>
      h(DashboardSidebarCollapse, { side: 'right' }),
    )
    await wrapper.get(collapse).trigger('click')
    expect(right.collapsed.value).toBe(true)
    expect(left.collapsed.value).toBe(false)
    expect(wrapper.get(`${collapse} path`).attributes('d')).not.toBe(leftIcon)
  })

  it('is hidden below md and centres itself on a collapsed sidebar rail', () => {
    const { wrapper } = mountInDashboard(() => h(DashboardSidebarCollapse))
    expect(wrapper.get(collapse).classes()).toEqual(
      expect.arrayContaining(['hidden', 'md:flex', 'group-data-[collapsed=true]/sidebar:mx-auto']),
    )
  })
})

describe('dashboardNavbar', () => {
  it('renders the title as an h1 and the toggle on the left, driving the left sidebar', async () => {
    const { wrapper, left, right } = mountInDashboard(() => h(DashboardNavbar, { title: 'Inbox' }))
    expect(wrapper.get('h1').text()).toBe('Inbox')
    const button = wrapper.get(
      '[data-slot=dashboard-navbar-left] [data-slot=dashboard-navbar-toggle]',
    )
    expect(
      wrapper
        .find('[data-slot=dashboard-navbar-right] [data-slot=dashboard-navbar-toggle]')
        .exists(),
    ).toBe(false)

    await button.trigger('click')
    expect(left.open.value).toBe(true)
    expect(right.open.value).toBe(false)
  })

  it('toggle-side="right" moves the toggle to the right group and drives sidebars.right', async () => {
    const { wrapper, left, right } = mountInDashboard(() =>
      h(DashboardNavbar, { title: 'Inbox', toggleSide: 'right' }),
    )
    expect(
      wrapper
        .find('[data-slot=dashboard-navbar-left] [data-slot=dashboard-navbar-toggle]')
        .exists(),
    ).toBe(false)
    await wrapper
      .get('[data-slot=dashboard-navbar-right] [data-slot=dashboard-navbar-toggle]')
      .trigger('click')
    expect(right.open.value).toBe(true)
    expect(left.open.value).toBe(false)
  })

  it('toggle.side overrides the sidebar the toggle controls', async () => {
    const { wrapper, left, right } = mountInDashboard(() =>
      h(DashboardNavbar, { toggle: { side: 'right' } }),
    )
    await wrapper.get('[data-slot=dashboard-navbar-toggle]').trigger('click')
    expect(right.open.value).toBe(true)
    expect(left.open.value).toBe(false)
  })

  it('forwards an object toggle to the button and hides it with false', () => {
    const custom = mountInDashboard(() =>
      h(DashboardNavbar, { toggle: { variant: 'secondary', class: 'rounded-full' } }),
    ).wrapper.get('[data-slot=dashboard-navbar-toggle]')
    expect(custom.classes()).toContain('rounded-full')
    expect(custom.classes()).toEqual(expect.arrayContaining(['md:hidden']))

    const hidden = mountInDashboard(() => h(DashboardNavbar, { toggle: false })).wrapper
    expect(hidden.find('[data-slot=dashboard-navbar-toggle]').exists()).toBe(false)
  })

  it('toggle.class overrides the toggle slot classes, such as the optical offset', () => {
    const ghost = mountInDashboard(() => h(DashboardNavbar)).wrapper.get(
      '[data-slot=dashboard-navbar-toggle]',
    )
    expect(ghost.classes()).toEqual(expect.arrayContaining(['-ms-2.5', 'md:-ms-2']))

    const filled = mountInDashboard(() =>
      h(DashboardNavbar, { toggle: { variant: 'secondary', class: 'ms-0 md:ms-0' } }),
    ).wrapper.get('[data-slot=dashboard-navbar-toggle]')
    expect(filled.classes()).toEqual(expect.arrayContaining(['ms-0', 'md:ms-0']))
    expect(filled.classes()).not.toContain('-ms-2.5')
    expect(filled.classes()).not.toContain('md:-ms-2')
  })

  it('#toggle replaces the button and receives the dashboard state', async () => {
    const { wrapper, left } = mountInDashboard(() =>
      h(DashboardNavbar, null, {
        toggle: (ctx: { toggleSidebar: () => void }) =>
          h('button', { id: 'custom', onClick: ctx.toggleSidebar }, 'Menu'),
      }),
    )
    expect(wrapper.find('[data-slot=dashboard-navbar-toggle]').exists()).toBe(false)
    await wrapper.get('#custom').trigger('click')
    expect(left.open.value).toBe(true)
  })

  it('slots receive sidebarOpen and sidebars; the default slot renders a center group', async () => {
    let seen: { sidebarOpen?: boolean; hasRight?: boolean } = {}
    const { wrapper, left } = mountInDashboard(() =>
      h(DashboardNavbar, null, {
        default: (ctx: { sidebarOpen: { value: boolean }; sidebars: object }) => {
          seen = { sidebarOpen: ctx.sidebarOpen.value, hasRight: 'right' in ctx.sidebars }
          return h('span', { id: 'center' }, 'Search')
        },
        right: () => h('span', { id: 'actions' }, 'Actions'),
      }),
    )
    expect(wrapper.get('[data-slot=dashboard-navbar-center] #center').text()).toBe('Search')
    expect(wrapper.get('[data-slot=dashboard-navbar-right] #actions').text()).toBe('Actions')
    expect(seen).toEqual({ sidebarOpen: false, hasRight: true })

    left.open.value = true
    await wrapper.vm.$nextTick()
    expect(seen.sidebarOpen).toBe(true)
  })

  it('omits the center group without a default slot and the title without title/#title', () => {
    const { wrapper } = mountInDashboard(() => h(DashboardNavbar))
    expect(wrapper.find('[data-slot=dashboard-navbar-center]').exists()).toBe(false)
    expect(wrapper.find('[data-slot=dashboard-navbar-title]').exists()).toBe(false)
  })

  it('#leading and #trailing surround the title inside the left group', () => {
    const { wrapper } = mountInDashboard(() =>
      h(
        DashboardNavbar,
        { title: 'Inbox', toggle: false },
        {
          leading: () => h('i', { id: 'lead' }),
          trailing: () => h('b', { id: 'trail' }),
        },
      ),
    )
    const order = [...wrapper.get('[data-slot=dashboard-navbar-left]').element.children].map(
      (c) => c.id || c.getAttribute('data-slot'),
    )
    expect(order).toEqual(['lead', 'dashboard-navbar-title', 'trail'])
  })

  it('as accepts an object per part', () => {
    const { wrapper } = mountInDashboard(() =>
      h(DashboardNavbar, { title: 'Inbox', as: { root: 'header', title: 'h2' } }),
    )
    expect(wrapper.get('[data-slot=dashboard-navbar]').element.tagName).toBe('HEADER')
    expect(wrapper.get('[data-slot=dashboard-navbar-title]').element.tagName).toBe('H2')
  })

  it('as accepts a single element for the root', () => {
    const { wrapper } = mountInDashboard(() => h(DashboardNavbar, { title: 'Inbox', as: 'nav' }))
    expect(wrapper.get('[data-slot=dashboard-navbar]').element.tagName).toBe('NAV')
    expect(wrapper.get('[data-slot=dashboard-navbar-title]').element.tagName).toBe('H1')
  })

  it('renders without a dashboard group', () => {
    const wrapper = mount(DashboardNavbar, { props: { title: 'Solo' } })
    expect(wrapper.get('h1').text()).toBe('Solo')
  })
})

describe('dashboardToolbar', () => {
  it('renders left and right groups from their slots', () => {
    const wrapper = mount(DashboardToolbar, { slots: { left: () => 'L', right: () => 'R' } })
    expect(wrapper.get('[data-slot=dashboard-toolbar-left]').text()).toBe('L')
    expect(wrapper.get('[data-slot=dashboard-toolbar-right]').text()).toBe('R')
  })

  it('the default slot replaces both groups', () => {
    const wrapper = mount(DashboardToolbar, {
      slots: { default: () => h('span', { id: 'x' }, 'Menu') },
    })
    expect(wrapper.find('#x').exists()).toBe(true)
    expect(wrapper.find('[data-slot=dashboard-toolbar-left]').exists()).toBe(false)
  })
})

describe('dashboardNavbar accessibility', () => {
  function mountNavbar(navbar: Record<string, unknown> = {}) {
    return mount(DashboardGroup, {
      props: { persistent: false },
      slots: {
        default: () => [
          h(
            DashboardSidebar,
            { id: 'main', 'aria-label': 'Main' },
            { default: () => h('a', { href: '#inbox' }, 'Inbox') },
          ),
          h(
            DashboardNavbar,
            { title: 'Inbox', ...navbar },
            {
              default: () => h('nav', { 'aria-label': 'Views' }, [h('a', { href: '#all' }, 'All')]),
              right: () => h('button', { type: 'button' }, 'Compose'),
            },
          ),
        ],
      },
      attachTo: document.body,
    })
  }

  it('heads the page with its title, names its toggle, and passes axe', async () => {
    const wrapper = mountNavbar()
    const heading = document.querySelector('[data-slot=dashboard-navbar-title]')!
    expect(heading.tagName).toBe('H1')
    expect(heading.textContent).toBe('Inbox')
    const button = document.querySelector<HTMLButtonElement>('[data-slot=dashboard-navbar-toggle]')!
    expect(button.getAttribute('aria-label')).toBe('Open sidebar')
    expect(button.getAttribute('aria-expanded')).toBe('false')
    await expectAccessible(document.body)
    wrapper.unmount()
    document.body.innerHTML = ''
  })

  it('passes axe with the toggle on the right and a custom title level', async () => {
    const wrapper = mountNavbar({ toggleSide: 'right', as: { title: 'h2' } })
    expect(document.querySelector('[data-slot=dashboard-navbar-title]')!.tagName).toBe('H2')
    expect(
      document.querySelector(
        '[data-slot=dashboard-navbar-right] [data-slot=dashboard-navbar-toggle]',
      ),
    ).not.toBeNull()
    await expectAccessible(document.body)
    wrapper.unmount()
    document.body.innerHTML = ''
  })
})
