import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { LinkBaseProps } from '@/types/link'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Link = typeof theme

/**
 * Props of `Link`: a styled anchor with an optional external-link icon. `to` goes through `RouterLink` when the app
 * has vue-router; `as` renders it through another component instead.
 */
export type LinkProps = LinkBaseProps & {
  /**
   * The element or component to render as, e.g. a router link component.
   * @defaultValue 'a'
   */
  as?: PrimitiveProps['as']
  /**
   * Show the icon. Defaults to the external-link arrow; fill `#icon` to replace it.
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

/** Slots of `Link`: the link text and a custom icon. */
export type LinkSlots = {
  /** The link text. */
  default?: () => VNode[]
  /** Custom icon content; renders the icon wrapper even when `icon` is not set. */
  icon?: () => VNode[]
}
