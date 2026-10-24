import type { PrimitiveProps } from 'reka-ui'

import type { ButtonProps } from '@/components/button/Button.types'
import type { DashboardSidebarSide } from '@/composables/useDashboard'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type DashboardSidebarCollapse = typeof theme

export type DashboardSidebarCollapseProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'button'
   */
  as?: PrimitiveProps['as']
  /**
   * The side of the sidebar to collapse: `left` is the main sidebar, `right` the aside panel.
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
  ui?: ComponentSlots<DashboardSidebarCollapse>
}

export type DashboardSidebarCollapseSlots = {
  /** The button content. Defaults to the gravity-ui `layout-side-content-left` icon (`-right` for `side="right"`). */
  default?: (props: { collapsed: boolean }) => unknown
}
