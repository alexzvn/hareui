import type { InjectionKey, Ref } from 'vue'
import { inject, provide, ref } from 'vue'

/** Custom persistence backend for dashboard sidebar/panel state. */
export type DashboardStorageAdapter = {
  getItem: (key: string) => string | null | undefined
  setItem: (key: string, value: string) => void
}

/** Where `DashboardGroup` persists sizes and collapsed state: a cookie (SSR-safe), `localStorage`, or a custom adapter. */
export type DashboardStorage = 'cookie' | 'local' | DashboardStorageAdapter

/** The unit of dashboard sidebar and panel sizes: a percentage of the group, `rem`, or pixels. */
export type DashboardUnit = '%' | 'rem' | 'px'

/** Which sidebar slot of a `DashboardGroup`: `left` is the main sidebar, `right` the aside panel. */
export type DashboardSidebarSide = 'left' | 'right'

/** State of one sidebar slot of the group. `left` is the main sidebar, `right` the aside panel. */
export type DashboardSidebarState = {
  /** Mobile menu (sheet) open state. */
  open: Ref<boolean>
  /** Desktop collapsed state (icon rail or off-canvas). */
  collapsed: Ref<boolean>
  /** Element id of the mounted sidebar (`aria-controls` of its collapse button; its toggle points at `${id}-menu`); `undefined` until one mounts. */
  id: Ref<string | undefined>
  /** Toggles the mobile menu (sheet). */
  toggle: () => void
  /** Collapses (`true`) or expands (`false`) the desktop sidebar. */
  collapse: (collapsed: boolean) => void
}

/** Shared state of a `DashboardGroup`, read by its sidebars, panels and toggles through `useDashboard()`. */
export type DashboardContext = {
  /** Where sizes and collapsed state are persisted. */
  storage: DashboardStorage
  /** Prefix of every persisted entry key. */
  storageKey: string
  /** Whether sizes and collapsed state are persisted across reloads. */
  persistent: boolean
  /** The unit of every sidebar and panel size in the group. */
  unit: DashboardUnit
  /** Alias of `sidebars.left.open`. */
  sidebarOpen: Ref<boolean>
  /** Alias of `sidebars.left.toggle`. */
  toggleSidebar: () => void
  /** Alias of `sidebars.left.collapsed`. */
  sidebarCollapsed: Ref<boolean>
  /** Alias of `sidebars.left.collapse`. */
  collapseSidebar: (collapsed: boolean) => void
  /** Per-side sidebar state: `left` is the main sidebar, `right` the aside panel. */
  sidebars: Record<DashboardSidebarSide, DashboardSidebarState>
}

const dashboardContextKey: InjectionKey<DashboardContext> = Symbol('hareui-dashboard')

export const provideDashboardContext = (context: DashboardContext): void => {
  provide(dashboardContextKey, context)
}

/** Context of the closest `DashboardGroup`, or `undefined` outside one. */
export const useDashboard = (): DashboardContext | undefined => {
  return inject(dashboardContextKey, undefined)
}

/** Creates the reactive state of one sidebar slot (used by `DashboardGroup`, and standalone by sidebars outside a group). */
export const createDashboardSidebarState = (): DashboardSidebarState => {
  const isOpen = ref(false)
  const isCollapsed = ref(false)
  const id = ref<string>()

  return {
    open: isOpen,
    collapsed: isCollapsed,
    id,
    toggle: () => {
      isOpen.value = !isOpen.value
    },
    collapse: (value) => {
      isCollapsed.value = value
    },
  }
}
