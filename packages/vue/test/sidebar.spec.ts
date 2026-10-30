import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, ref } from 'vue'

import NavigationMenu from '@/components/navigation-menu/NavigationMenu.vue'
import type { SidebarProps } from '@/components/sidebar/Sidebar.types'
import Sidebar from '@/components/sidebar/Sidebar.vue'

import { expectAccessible } from './a11y'
import { settle } from './settle'

// A controllable `matchMedia`: `setDesktop(false)` puts the viewport below every breakpoint.
const media = { isDesktop: true, queries: [] as string[], listeners: new Set<() => void>() }

const setDesktop = async (isDesktop: boolean) => {
  media.isDesktop = isDesktop
  for (const listener of media.listeners) listener()
  await settle()
}

beforeEach(() => {
  media.isDesktop = true
  media.queries = []
  media.listeners.clear()

  vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
    media.queries.push(query)

    return {
      get matches() {
        return media.isDesktop
      },
      media: query,
      addEventListener: (_type: string, listener: () => void) => media.listeners.add(listener),
      removeEventListener: (_type: string, listener: () => void) =>
        media.listeners.delete(listener),
    } as unknown as MediaQueryList
  })
})

afterEach(() => {
  vi.restoreAllMocks()
  document.body.innerHTML = ''
})

const sidebar = () => document.querySelector<HTMLElement>('[data-slot=sidebar]')!
const dialog = () => document.querySelector<HTMLElement>('[role=dialog]')

const mountSidebar = (props: SidebarProps & { open?: boolean } = {}, slots = {}) => {
  const isOpen = ref(props.open ?? true)

  const wrapper = mount(Sidebar, {
    props: {
      ...props,
      open: isOpen.value,
      'onUpdate:open': (value: boolean) => {
        isOpen.value = value
        wrapper.setProps({ open: value })
      },
    },
    slots: { default: () => 'Navigation', ...slots },
    attachTo: document.body,
  })

  return { wrapper, isOpen }
}

const navigation = () =>
  h(NavigationMenu, {
    orientation: 'vertical',
    items: [
      { label: 'Overview', href: '#overview' },
      { label: 'Reports', children: [{ label: 'Revenue', href: '#revenue' }] },
    ],
  })

describe('Sidebar', () => {
  describe('desktop', () => {
    it('renders an aside with the header, body and footer', async () => {
      const { wrapper } = mountSidebar(
        { title: 'Northwind', description: 'Studio plan' },
        { footer: () => 'Signed in as Rosa' },
      )

      await settle()

      expect(sidebar().tagName).toBe('ASIDE')
      expect(sidebar().querySelector('[data-slot=sidebar-title]')?.textContent).toBe('Northwind')

      expect(sidebar().querySelector('[data-slot=sidebar-description]')?.textContent).toBe(
        'Studio plan',
      )

      expect(sidebar().querySelector('[data-slot=sidebar-body]')?.textContent).toBe('Navigation')

      expect(sidebar().querySelector('[data-slot=sidebar-footer]')?.textContent).toBe(
        'Signed in as Rosa',
      )

      await expectAccessible(document.body)
      wrapper.unmount()
    })

    it('omits the header and footer when nothing fills them', async () => {
      const { wrapper } = mountSidebar()
      await settle()

      expect(sidebar().querySelector('[data-slot=sidebar-header]')).toBeNull()
      expect(sidebar().querySelector('[data-slot=sidebar-footer]')).toBeNull()
      wrapper.unmount()
    })

    it('reflects v-model:open as the expanded/collapsed state', async () => {
      const { wrapper } = mountSidebar({ open: false, collapsible: 'icon' })
      await settle()

      expect(sidebar().dataset.state).toBe('collapsed')
      expect(sidebar().dataset.collapsible).toBe('icon')

      await wrapper.setProps({ open: true })

      expect(sidebar().dataset.state).toBe('expanded')
      wrapper.unmount()
    })

    it('collapses from the close button and emits update:open', async () => {
      const { wrapper, isOpen } = mountSidebar({ title: 'Northwind', close: true })
      await settle()

      const close = sidebar().querySelector<HTMLButtonElement>('[data-slot=sidebar-close]')!
      expect(close.getAttribute('aria-label')).toBe('Close sidebar')

      close.click()
      await settle()

      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
      expect(isOpen.value).toBe(false)
      expect(sidebar().dataset.state).toBe('collapsed')
      wrapper.unmount()
    })

    it('forwards close button props', async () => {
      const { wrapper } = mountSidebar({ title: 'Northwind', close: { disabled: true } })
      await settle()

      const close = sidebar().querySelector<HTMLButtonElement>('[data-slot=sidebar-close]')
      expect(close?.disabled).toBe(true)
      wrapper.unmount()
    })

    it('toggles from the rail', async () => {
      const { wrapper } = mountSidebar({ rail: true })
      await settle()

      const rail = sidebar().querySelector<HTMLButtonElement>('[data-slot=sidebar-rail]')!
      expect(rail.getAttribute('aria-label')).toBe('Toggle sidebar')
      expect(rail.tabIndex).toBe(-1)

      rail.click()
      await settle()
      expect(sidebar().dataset.state).toBe('collapsed')

      rail.click()
      await settle()
      expect(sidebar().dataset.state).toBe('expanded')
      wrapper.unmount()
    })

    it('has no state, close button, rail or menu when collapsible is none', async () => {
      const { wrapper } = mountSidebar({
        collapsible: 'none',
        close: true,
        rail: true,
        title: 'Docs',
      })

      await setDesktop(false)

      expect(sidebar().dataset.state).toBeUndefined()
      expect(sidebar().querySelector('[data-slot=sidebar-close]')).toBeNull()
      expect(sidebar().querySelector('[data-slot=sidebar-rail]')).toBeNull()
      expect(dialog()).toBeNull()
      wrapper.unmount()
    })

    it('passes state, open and close to the section slots', async () => {
      const { wrapper } = mountSidebar(
        { collapsible: 'icon' },
        {
          header: ({ state, open }: { state: string; open: boolean }) =>
            h('span', { 'data-test': 'header' }, `${state}:${open}`),
          default: ({ close }: { close: () => void }) =>
            h('button', { 'data-test': 'collapse', onClick: close }, 'Collapse'),
        },
      )

      await settle()

      const header = () => sidebar().querySelector('[data-test=header]')?.textContent
      expect(header()).toBe('expanded:true')

      sidebar().querySelector<HTMLButtonElement>('[data-test=collapse]')!.click()
      await settle()

      expect(header()).toBe('collapsed:false')
      wrapper.unmount()
    })

    it('renders the actions, close and rail slots with the resolved state', async () => {
      const { wrapper } = mountSidebar(
        { rail: true },
        {
          actions: ({ state }: { state: string }) => h('span', { 'data-test': 'actions' }, state),
          close: () => h('button', { 'data-test': 'close' }, 'Hide'),
          rail: ({ state }: { state: string }) => h('span', { 'data-test': 'rail' }, state),
        },
      )

      await settle()

      expect(sidebar().querySelector('[data-test=actions]')?.textContent).toBe('expanded')
      expect(sidebar().querySelector('[data-test=close]')).not.toBeNull()
      expect(sidebar().querySelector('[data-test=rail]')?.textContent).toBe('expanded')
      expect(sidebar().querySelector('[data-slot=sidebar-rail]')).toBeNull()
      wrapper.unmount()
    })

    it('forwards attributes to the root and renders as another element', async () => {
      const wrapper = mount(Sidebar, {
        props: { as: 'nav' },
        attrs: { id: 'main-nav', 'aria-label': 'Main' },
        slots: { default: () => 'Navigation' },
        attachTo: document.body,
      })

      await settle()

      expect(sidebar().tagName).toBe('NAV')
      expect(sidebar().id).toBe('main-nav')
      expect(sidebar().getAttribute('aria-label')).toBe('Main')
      wrapper.unmount()
    })
  })

  describe('mobile menu', () => {
    it('queries the breakpoint in rem', async () => {
      const { wrapper } = mountSidebar({ breakpoint: 'lg' })
      await settle()

      expect(media.queries.at(-1)).toBe('(min-width: 64rem)')

      await wrapper.setProps({ breakpoint: 'sm' })

      expect(media.queries.at(-1)).toBe('(min-width: 40rem)')
      wrapper.unmount()
    })

    it('closes when the viewport shrinks and opens as a dialog from v-model', async () => {
      const { wrapper, isOpen } = mountSidebar({ title: 'Northwind' })
      await setDesktop(false)

      expect(isOpen.value).toBe(false)
      expect(dialog()).toBeNull()

      await wrapper.setProps({ open: true })
      await settle()

      const menu = dialog()!
      expect(menu).not.toBeNull()
      expect(menu.textContent).toContain('Navigation')

      expect(document.getElementById(menu.getAttribute('aria-labelledby')!)?.textContent).toBe(
        'Northwind',
      )

      await expectAccessible(document.body)
      wrapper.unmount()
    })

    it('closes the menu from its close button and reports it through v-model', async () => {
      const { wrapper, isOpen } = mountSidebar({ title: 'Northwind' })
      await setDesktop(false)
      await wrapper.setProps({ open: true })
      await settle()

      const close = dialog()!.querySelector<HTMLButtonElement>('[data-slot=sidebar-close]')!
      close.click()
      await settle()

      expect(isOpen.value).toBe(false)
      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
      wrapper.unmount()
    })

    it('closes the menu on Escape', async () => {
      const { wrapper, isOpen } = mountSidebar({ title: 'Northwind' })
      await setDesktop(false)
      await wrapper.setProps({ open: true })
      await settle()

      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
      await settle()

      expect(isOpen.value).toBe(false)
      wrapper.unmount()
    })

    it('restores the desktop state when the viewport widens again', async () => {
      const { wrapper, isOpen } = mountSidebar({ open: false, collapsible: 'icon' })
      await setDesktop(false)
      await wrapper.setProps({ open: true })
      await settle()

      await setDesktop(true)

      expect(dialog()).toBeNull()
      expect(isOpen.value).toBe(false)
      expect(sidebar().dataset.state).toBe('collapsed')
      wrapper.unmount()
    })

    it('opens a full-screen modal for mode="modal"', async () => {
      const { wrapper } = mountSidebar({ mode: 'modal', title: 'Northwind' })
      await setDesktop(false)
      await wrapper.setProps({ open: true })
      await settle()

      expect(dialog()?.dataset.slot).toBe('modal-dialog')
      expect(document.querySelector('[data-slot=drawer-dialog]')).toBeNull()
      wrapper.unmount()
    })

    it('renders a drag handle for mode="drawer"', async () => {
      const { wrapper } = mountSidebar({ mode: 'drawer', title: 'Northwind' })
      await setDesktop(false)
      await wrapper.setProps({ open: true })
      await settle()

      expect(dialog()?.querySelector('[data-slot=sidebar-handle]')).not.toBeNull()
      wrapper.unmount()
    })

    it('names the menu after menu.title over title and forwards the menu props', async () => {
      const { wrapper } = mountSidebar({
        title: 'Northwind',
        menu: { title: 'Site navigation', placement: 'right' },
      })

      await setDesktop(false)
      await wrapper.setProps({ open: true })
      await settle()

      const menu = dialog()!
      const name = document.getElementById(menu.getAttribute('aria-labelledby')!)?.textContent

      expect(name).toBe('Site navigation')
      expect(menu.dataset.placement).toBe('right')
      wrapper.unmount()
    })

    it('replaces the menu content with the content slot', async () => {
      const { wrapper, isOpen } = mountSidebar(
        { title: 'Northwind' },
        {
          content: ({ close }: { close: () => void }) =>
            h('button', { 'data-test': 'custom', onClick: close }, 'Done'),
        },
      )

      await setDesktop(false)
      await wrapper.setProps({ open: true })
      await settle()

      expect(dialog()?.querySelector('[data-slot=sidebar-body]')).toBeNull()

      dialog()!.querySelector<HTMLButtonElement>('[data-test=custom]')!.click()
      await settle()

      expect(isOpen.value).toBe(false)
      wrapper.unmount()
    })

    it('closes the menu when a link is clicked, not when a group expands', async () => {
      const { wrapper, isOpen } = mountSidebar({ title: 'Northwind' }, { default: navigation })
      await setDesktop(false)
      await wrapper.setProps({ open: true })
      await settle()

      const group = [...dialog()!.querySelectorAll('button')].find(
        (button) => button.textContent?.trim() === 'Reports',
      )!

      group.click()
      await settle()

      expect(isOpen.value).toBe(true)
      expect(group.getAttribute('aria-expanded')).toBe('true')

      dialog()!.querySelector<HTMLAnchorElement>('a[href="#revenue"]')!.click()
      await settle()

      expect(isOpen.value).toBe(false)
      expect(wrapper.emitted('update:open')?.at(-1)).toEqual([false])
      wrapper.unmount()
    })

    it('keeps the menu open after a link click with auto-close off', async () => {
      const { wrapper, isOpen } = mountSidebar(
        { title: 'Northwind', autoClose: false },
        { default: navigation },
      )

      await setDesktop(false)
      await wrapper.setProps({ open: true })
      await settle()

      dialog()!.querySelector<HTMLAnchorElement>('a[href="#overview"]')!.click()
      await settle()

      expect(isOpen.value).toBe(true)
      wrapper.unmount()
    })

    it('leaves the desktop sidebar expanded when a link is clicked or the page navigates', async () => {
      const { wrapper, isOpen } = mountSidebar({}, { default: navigation })
      await settle()

      sidebar().querySelector<HTMLAnchorElement>('a[href="#overview"]')!.click()
      window.dispatchEvent(new HashChangeEvent('hashchange'))
      await settle()

      expect(isOpen.value).toBe(true)
      expect(sidebar().dataset.state).toBe('expanded')
      wrapper.unmount()
    })
  })
})
