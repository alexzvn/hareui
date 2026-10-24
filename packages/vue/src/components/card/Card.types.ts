import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Card = typeof theme

export type CardProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * Visual style of the card surface.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<Card>['variant']
  /** Title rendered in the header. */
  title?: string
  /** Description rendered under the title. */
  description?: string
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Card>
}

export type CardSlots = {
  /**
   * Content rendered directly inside the root, before the header, without a wrapper
   * (e.g. an icon, an image, or a full-bleed background).
   */
  leading?: () => VNode[]
  /** Replaces the whole header (title and description). */
  header?: () => VNode[]
  /** Replaces the title text. */
  title?: () => VNode[]
  /** Replaces the description text. */
  description?: () => VNode[]
  /** Card content. */
  default?: () => VNode[]
  /** Card footer. */
  footer?: () => VNode[]
}
