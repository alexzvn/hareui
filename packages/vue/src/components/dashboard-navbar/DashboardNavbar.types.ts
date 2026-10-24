import type { PrimitiveProps } from 'reka-ui'

import type { DashboardSidebarToggleProps } from '@/components/dashboard-sidebar-toggle/DashboardSidebarToggle.types'
import type { DashboardContext, DashboardSidebarSide } from '@/composables/useDashboard'
import type { ComponentSlots, ComponentUI } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type DashboardNavbar = typeof theme

export type DashboardNavbarProps = {
  /**
   * The element or component to render as. An object sets the element per part (`{ root, title }`).
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as'] | { root?: PrimitiveProps['as']; title?: PrimitiveProps['as'] }
  /** The title displayed in the left group. */
  title?: string
  /**
   * The button that opens the sidebar on mobile (a `DashboardSidebarToggle`). An object is forwarded to it; `false` hides it.
   * @defaultValue true
   */
  toggle?: boolean | DashboardSidebarToggleProps
  /**
   * The side of the navbar to render the toggle button on. It also selects the sidebar it controls (`left` or `right`) unless `toggle.side` is set.
   * @defaultValue 'left'
   */
  toggleSide?: DashboardSidebarSide
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardNavbar>
}

/** The dashboard state handed to the navbar slots (the group's configuration is left out). */
export type DashboardNavbarSlotProps = Pick<
  DashboardContext,
  'sidebarOpen' | 'toggleSidebar' | 'sidebarCollapsed' | 'collapseSidebar' | 'sidebars'
>

export type DashboardNavbarSlots = {
  /** Replaces the `leading`, `title` and `trailing` content of the left group. */
  left?: (props: Partial<DashboardNavbarSlotProps>) => unknown
  /** Content before the title, e.g. an icon or a logo. */
  leading?: (
    props: Partial<DashboardNavbarSlotProps> & { ui: ComponentUI<DashboardNavbar> },
  ) => unknown
  /** The title. Defaults to the `title` prop. */
  title?: () => unknown
  /** Content after the title. */
  trailing?: (
    props: Partial<DashboardNavbarSlotProps> & { ui: ComponentUI<DashboardNavbar> },
  ) => unknown
  /** Centered content, shown from the `lg` breakpoint. */
  default?: (props: Partial<DashboardNavbarSlotProps>) => unknown
  /** Content aligned to the end. */
  right?: (props: Partial<DashboardNavbarSlotProps>) => unknown
  /** Replaces the sidebar toggle button. */
  toggle?: (
    props: Partial<DashboardNavbarSlotProps> & { ui: ComponentUI<DashboardNavbar> },
  ) => unknown
}
