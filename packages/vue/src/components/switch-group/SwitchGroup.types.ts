import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type SwitchGroup = typeof theme

/** Props of `SwitchGroup`: lays out related `Switch` components vertically or horizontally. */
export type SwitchGroupProps = {
  /**
   * The axis the switches are laid out along.
   * @defaultValue 'vertical'
   */
  orientation?: ComponentVariants<SwitchGroup>['orientation']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<SwitchGroup>
}

/** Slots of `SwitchGroup`. */
export type SwitchGroupSlots = {
  /** The `Switch` items to render. */
  default?: () => VNode[]
}
