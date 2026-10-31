import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { IconValue } from '@/types/icon'
import type { LinkBaseProps } from '@/types/link'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ItemCard = typeof theme

/**
 * Props of `ItemCard`, a row with an icon, a title, a description and a trailing action. With `to` or `href` it
 * renders a link (through `RouterLink` when the app has it); a link or a card with a click listener gets hover and
 * press feedback.
 */
export type ItemCardProps = LinkBaseProps & {
  /**
   * The element or component to render as when the card is not a link. Without it, a card with a click listener
   * renders a `button`.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** The icon shown in the leading box. */
  icon?: IconValue
  /** The primary text, truncated to one line. */
  title?: string
  /** The secondary text under the title, truncated to one line. */
  description?: string
  /**
   * Visual style of the card. Inside an `ItemCardGroup` it defaults to the group's variant. Exposed as
   * `data-variant`.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<ItemCard>['variant']
  /** Called when the card is clicked. Gives the card hover and press feedback; without a link it renders a `button`. */
  onClick?: (event: MouseEvent) => void
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ItemCard>
}

/** Slots of `ItemCard`. */
export type ItemCardSlots = {
  /** The content of the leading icon box. Replaces the `icon` prop. */
  icon?: () => VNode[]
  /** Replaces the title text. */
  title?: () => VNode[]
  /** Replaces the description text. */
  description?: () => VNode[]
  /** Trailing content, such as a button, a switch or a chevron. */
  action?: () => VNode[]
  /** Extra content under the description. */
  default?: () => VNode[]
}
