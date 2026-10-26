import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Button = typeof theme

/** Props of the `Button` component. */
export type ButtonProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'button'
   */
  as?: PrimitiveProps['as']
  /**
   * The native button type. Only applied when rendered as a `button`.
   * @defaultValue 'button'
   */
  type?: 'button' | 'submit' | 'reset'
  /**
   * Visual style of the button.
   * @defaultValue 'primary'
   */
  variant?: ComponentVariants<Button>['variant']
  /**
   * Size of the button.
   * @defaultValue 'md'
   */
  size?: ComponentVariants<Button>['size']
  /**
   * Whether the button takes the full width of its container.
   * @defaultValue false
   */
  fullWidth?: boolean
  /**
   * Whether the button only contains an icon (square shape).
   * @defaultValue false
   */
  iconOnly?: boolean
  /**
   * Whether the button is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the button is in a pending state: shows a spinner, blocks clicks, stays focusable.
   * @defaultValue false
   */
  pending?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Button>
}

/** Slots of the `Button` component. */
export type ButtonSlots = {
  /** Content rendered before the label. Replaces the pending spinner. */
  leading?: (props: { pending: boolean }) => VNode[]
  /** The button label. */
  default?: (props: { pending: boolean }) => VNode[]
  /** Content rendered after the label. */
  trailing?: (props: { pending: boolean }) => VNode[]
}
