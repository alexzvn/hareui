import type { PrimitiveProps } from 'reka-ui'

import type { ButtonProps } from '@/components/button/Button.types'
import type { DashboardSidebarSide } from '@/composables/useDashboard'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type DashboardSidebarToggle = typeof theme

/** Props of `DashboardSidebarToggle`, the button that opens and closes a dashboard sidebar's mobile menu. */
export type DashboardSidebarToggleProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'button'
   */
  as?: PrimitiveProps['as']
  /**
   * The side of the sidebar to toggle: `left` is the main sidebar, `right` the aside panel.
   * @defaultValue 'left'
   */
  side?: DashboardSidebarSide
  /**
   * Visual style of the button.
   * @defaultValue 'ghost'
   */
  variant?: ButtonProps['variant']
  /**
   * Size of the button.
   * @defaultValue 'sm'
   */
  size?: ButtonProps['size']
  /**
   * Whether the button is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardSidebarToggle>
}

/** Slots of `DashboardSidebarToggle`. */
export type DashboardSidebarToggleSlots = {
  /** The button content. Defaults to the gravity-ui `bars` icon, and to a close icon while the sidebar is open. */
  default?: (props: { open: boolean }) => unknown
}
