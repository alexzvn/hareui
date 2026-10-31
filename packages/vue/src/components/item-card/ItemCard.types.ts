import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { IconValue } from '@/types/icon'
import type { LinkBaseProps } from '@/types/link'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ItemCard = typeof theme

/**
 * Props of `ItemCard`, a row with an icon, a title, a description and a trailing action. With `to` or `href` the title
 * renders a link (through `RouterLink` when the app has it), with a click listener a `button`; either covers the whole
 * card, gets hover and press feedback, and leaves the `#action` slot's controls outside it.
 */
export type ItemCardProps = LinkBaseProps & {
  /**
   * The card's element or component. With `to` or `href`, a component (e.g. a framework link) renders the link
   * instead and the card stays a `div`.
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
  /**
   * Called when the card is pressed. Renders the title as a `button` covering the card, with hover and press feedback.
   * Not called while the card is disabled.
   */
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
  /** Replaces the title text. On a link or clickable card it sits inside the press target, so keep controls out. */
  title?: () => VNode[]
  /** Replaces the description text. */
  description?: () => VNode[]
  /** Trailing content, such as a button, a switch or a chevron. Its controls stay outside the card's press target. */
  action?: () => VNode[]
  /** Extra content under the description. */
  default?: () => VNode[]
}
