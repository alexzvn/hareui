import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Separator = typeof theme

/** Props of `Separator`: a horizontal or vertical divider between content. */
export type SeparatorProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * The orientation of the separator. Inside a Toolbar it defaults to the one perpendicular to the toolbar.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<Separator>['orientation']
  /**
   * The visual variant of the separator.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<Separator>['variant']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Separator>
}

/** Slots of `Separator`. */
export type SeparatorSlots = {
  /** Content rendered inside the separator (uncommon; HeroUI's separator is normally empty). */
  default?: () => VNode[]
}
