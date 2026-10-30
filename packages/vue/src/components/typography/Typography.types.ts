import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Typography = typeof theme

/** Props of `Typography`: text in one of the theme's semantic `type` styles, rendered as its element. */
export type TypographyProps = {
  /**
   * The element or component to render as, overriding the element implied by `type`.
   */
  as?: PrimitiveProps['as']
  /**
   * Semantic typography style.
   * @defaultValue 'body'
   */
  type?: ComponentVariants<Typography>['type']
  /**
   * Text alignment.
   * @defaultValue 'start'
   */
  align?: ComponentVariants<Typography>['align']
  /**
   * Text color.
   * @defaultValue 'default'
   */
  color?: ComponentVariants<Typography>['color']
  /** Font weight override. */
  weight?: ComponentVariants<Typography>['weight']
  /**
   * Truncates the text to one line with ellipsis.
   * @defaultValue false
   */
  truncate?: boolean
  /**
   * Renders a rich prose container instead: children are plain HTML (headings, paragraphs,
   * links, lists, code, …) and receive a default typography rhythm. `type`, `align`,
   * `color`, `weight` and `truncate` are ignored in this mode.
   * @defaultValue false
   */
  prose?: boolean
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Typography>
}

/** Slots of `Typography`. */
export type TypographySlots = {
  /** Typography content. */
  default?: () => VNode[]
}
