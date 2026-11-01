import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Marquee = typeof theme

/** Props of `Marquee`: content that scrolls in an endless loop, such as a row of logos or testimonials. */
export type MarqueeProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * Pause the animation while the pointer is over the marquee.
   * @defaultValue false
   */
  pauseOnHover?: boolean
  /**
   * Scroll the other way: towards the end (horizontal) or downwards (vertical).
   * @defaultValue false
   */
  reverse?: boolean
  /**
   * The scrolling direction.
   * @defaultValue 'horizontal'
   */
  orientation?: ComponentVariants<Marquee>['orientation']
  /**
   * How many copies of the content are rendered. Raise it when the content is shorter than the marquee, so the loop
   * leaves no gap. Copies after the first are hidden from assistive technology.
   * @defaultValue 4
   */
  repeat?: number
  /**
   * Fade the content out at both ends into the page background.
   * @defaultValue true
   */
  overlay?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Marquee>
}

/** Slots of `Marquee`. */
export type MarqueeSlots = {
  /** The content to scroll, rendered once per copy. */
  default?: () => VNode[]
}
