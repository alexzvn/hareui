import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Link = typeof theme

export type LinkProps = {
  /**
   * The element or component to render as, e.g. a router link component.
   * @defaultValue 'a'
   */
  as?: PrimitiveProps['as']
  /** The URL the link points to. */
  href?: string
  /** Whether the link is disabled: sets `aria-disabled` and blocks navigation. */
  disabled?: boolean
  /**
   * Show the icon (HeroUI's `Link.Icon`). Defaults to the external-link arrow; fill `#icon` to replace it.
   * @defaultValue false
   */
  icon?: boolean
  /**
   * Which side of the text the icon goes on.
   * @defaultValue 'end'
   */
  iconPlacement?: 'start' | 'end'
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Link>
}

export type LinkSlots = {
  /** The link text. */
  default?: () => VNode[]
  /** Custom icon content; renders the icon wrapper even when `icon` is not set. */
  icon?: () => VNode[]
}
