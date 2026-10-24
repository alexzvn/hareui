import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Toolbar = typeof theme

export type ToolbarProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * The orientation of the toolbar. Arrow keys follow it, ToggleButtonGroups inside take it,
   * and Separators inside take the perpendicular one.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<Toolbar>['orientation']
  /**
   * Whether the toolbar has a surface background with full rounding (HeroUI's `isAttached`).
   * @defaultValue false
   */
  attached?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Toolbar>
}

export type ToolbarSlots = {
  /** Toolbar controls; receives HeroUI's render props. */
  default?: (props: { orientation: 'horizontal' | 'vertical' }) => VNode[]
}
