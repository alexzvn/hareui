import type { InjectionKey, Ref } from 'vue'
import { inject, provide, ref } from 'vue'

/** Custom persistence backend for dashboard sidebar/panel state. */
export interface DashboardStorageAdapter {
  getItem: (key: string) => string | null | undefined
  setItem: (key: string, value: string) => void
}

/** Where `DashboardGroup` persists sizes and collapsed state: a cookie (SSR-safe), `localStorage`, or a custom adapter. */
export type DashboardStorage = 'cookie' | 'local' | DashboardStorageAdapter

export type DashboardUnit = '%' | 'rem' | 'px'

export type DashboardSidebarSide = 'left' | 'right'

/** State of one sidebar slot of the group. `left` is the main sidebar, `right` the aside panel. */
export interface DashboardSidebarState {
  /** Mobile menu (sheet) open state. */
  open: Ref<boolean>
  /** Desktop collapsed state (icon rail or off-canvas). */
  collapsed: Ref<boolean>
  /** Element id of the mounted sidebar (`aria-controls` of its collapse button; its toggle points at `${id}-menu`); `undefined` until one mounts. */
  id: Ref<string | undefined>
  toggle: () => void
  collapse: (collapsed: boolean) => void
}

export interface DashboardContext {
  storage: DashboardStorage
  storageKey: string
  persistent: boolean
  unit: DashboardUnit
  /** Alias of `sidebars.left.open`. */
  sidebarOpen: Ref<boolean>
  /** Alias of `sidebars.left.toggle`. */
  toggleSidebar: () => void
  /** Alias of `sidebars.left.collapsed`. */
  sidebarCollapsed: Ref<boolean>
  /** Alias of `sidebars.left.collapse`. */
  collapseSidebar: (collapsed: boolean) => void
  sidebars: Record<DashboardSidebarSide, DashboardSidebarState>
}

export const dashboardContextKey: InjectionKey<DashboardContext> = Symbol('hareui-dashboard')

export function provideDashboardContext(context: DashboardContext): void {
  provide(dashboardContextKey, context)
}

/** Context of the closest `DashboardGroup`, or `undefined` outside one. */
export function useDashboard(): DashboardContext | undefined {
  return inject(dashboardContextKey, undefined)
}

/** Creates the reactive state of one sidebar slot (used by `DashboardGroup`, and standalone by sidebars outside a group). */
export function createDashboardSidebarState(): DashboardSidebarState {
  const open = ref(false)
  const collapsed = ref(false)
  const id = ref<string>()
  return {
    open,
    collapsed,
    id,
    toggle: () => {
      open.value = !open.value
    },
    collapse: (value) => {
      collapsed.value = value
    },
  }
}
