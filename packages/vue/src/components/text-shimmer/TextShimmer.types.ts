import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type TextShimmer = typeof theme

/** Props of `TextShimmer`. */
export type TextShimmerProps = {
  /** The text to shimmer. The default slot replaces it. */
  text?: string
  /**
   * The element or component the root renders as.
   * @defaultValue 'span'
   */
  as?: PrimitiveProps['as']
  /**
   * Seconds one sweep of the highlight takes.
   * @defaultValue 2.5
   */
  duration?: number
  /**
   * How far the highlight band reaches either side of its centre, in characters (`ch`).
   * @defaultValue 4
   */
  spread?: number
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<TextShimmer>
}

/** Slots of `TextShimmer`. */
export type TextShimmerSlots = {
  /**
   * The content to shimmer, in place of `text`. It renders twice: once visibly, once hidden from assistive technology
   * as the mask of the highlight. Keep it static: a component with its own state or timers runs twice.
   */
  default?: () => VNode[]
}
