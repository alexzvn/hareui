import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type CloseButton = typeof theme

/** Props of `CloseButton`, an icon button that closes or dismisses its surrounding surface. */
export type CloseButtonProps = {
  /**
   * Visual style of the close button.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<CloseButton>['variant']
  /**
   * Whether the button is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Accessible label of the button.
   * @defaultValue 'Close'
   */
  ariaLabel?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<CloseButton>
}

/** Slots of `CloseButton`. */
export type CloseButtonSlots = {
  /** Replaces the default close icon. */
  default?: () => VNode[]
}
