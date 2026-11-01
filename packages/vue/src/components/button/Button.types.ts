import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { AvatarProps } from '@/components/avatar/Avatar.types'
import type { IconValue } from '@/types/icon'
import type { LinkBaseProps } from '@/types/link'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Button = typeof theme

/** A click handler of `Button`; a returned promise keeps a `loadingAuto` button pending until it settles. */
type ButtonClickHandler = (event: MouseEvent) => unknown

/**
 * Props of the `Button` component. With `to` or `href` it renders a link (through `RouterLink` when the app has
 * vue-router); without them it renders exactly as `as` says.
 */
export type ButtonProps = Omit<LinkBaseProps, 'disabled'> & {
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
   * Whether the button only contains an icon (square shape). Also on when `leadingIcon`, `trailingIcon` or `avatar`
   * is set without a `label` or default slot.
   * @defaultValue false
   */
  iconOnly?: boolean
  /**
   * Whether the button is disabled. A disabled link drops its `href` and gets `aria-disabled="true"`.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the button is in a pending state: shows a spinner, blocks clicks, stays focusable.
   * @defaultValue false
   */
  pending?: boolean
  /**
   * Show the button `pending` while the promise returned by `@click` runs, and, on a `type="submit"` button, while
   * its parent `Form` submits.
   * @defaultValue false
   */
  loadingAuto?: boolean
  /** The button text. The default slot wins over it. */
  label?: string
  /** An icon rendered before the label. `#leading` wins over it; a pending spinner replaces it. */
  leadingIcon?: IconValue
  /** An icon rendered after the label. `#trailing` wins over it. */
  trailingIcon?: IconValue
  /** An avatar rendered before the label, unless a `leadingIcon` is set. `#leading` wins over it. */
  avatar?: AvatarProps
  /** Called on click. A returned promise keeps a `loadingAuto` button pending until it settles. */
  onClick?: ButtonClickHandler | ButtonClickHandler[]
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Button>
}

/** Slots of the `Button` component. */
export type ButtonSlots = {
  /** Content rendered before the label. Replaces the pending spinner, `leadingIcon` and `avatar`. */
  leading?: (props: { pending: boolean }) => VNode[]
  /** The button label. Wins over `label`. */
  default?: (props: { pending: boolean }) => VNode[]
  /** Content rendered after the label. Replaces `trailingIcon`. */
  trailing?: (props: { pending: boolean }) => VNode[]
}
