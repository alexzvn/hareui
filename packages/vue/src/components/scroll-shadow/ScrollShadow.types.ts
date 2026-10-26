import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type ScrollShadow = typeof theme

/**
 * Which edges show a shadow: `auto` follows the scroll position, `none` hides both, and the edge
 * names force those shadows.
 */
export type ScrollShadowVisibility = 'auto' | 'both' | 'top' | 'bottom' | 'left' | 'right' | 'none'

/** Props of `ScrollShadow`, a scroll container that fades its edges while more content is hidden. */
export type ScrollShadowProps = {
  /**
   * The element or component to render the root as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * The shadow size in pixels.
   * @defaultValue 40
   */
  size?: number
  /**
   * The scroll offset (px) before the shadow appears.
   * @defaultValue 0
   */
  offset?: number
  /**
   * The scroll orientation.
   * @defaultValue 'vertical'
   */
  orientation?: ComponentVariants<ScrollShadow>['orientation']
  /**
   * The visual variant.
   * @defaultValue 'fade'
   */
  variant?: ComponentVariants<ScrollShadow>['variant']
  /**
   * Whether to hide the scrollbar.
   * @defaultValue false
   */
  hideScrollBar?: boolean
  /**
   * Which shadows to show. `auto` follows the scroll position; anything else forces the
   * shadows (manual mode).
   * @defaultValue 'auto'
   */
  visibility?: ScrollShadowVisibility
  /**
   * Whether scroll detection is enabled (HeroUI's `isEnabled`).
   * @defaultValue true
   */
  enabled?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ScrollShadow>
}

/** Slots of `ScrollShadow`. */
export type ScrollShadowSlots = {
  /** The scrollable content. */
  default?: () => VNode[]
}

/** Events of `ScrollShadow`. */
export type ScrollShadowEmits = {
  /** Emitted when the visible shadows change (auto mode only). */
  visibilityChange: [visibility: ScrollShadowVisibility]
}
