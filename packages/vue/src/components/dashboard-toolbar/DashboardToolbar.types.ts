import type { PrimitiveProps } from 'reka-ui'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type DashboardToolbar = typeof theme

export type DashboardToolbarProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<DashboardToolbar>
}

export type DashboardToolbarSlots = {
  /** Replaces the `left` and `right` groups. */
  default?: () => unknown
  /** Content aligned to the start. */
  left?: () => unknown
  /** Content aligned to the end. */
  right?: () => unknown
}
