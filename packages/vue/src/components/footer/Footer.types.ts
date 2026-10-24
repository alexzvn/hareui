import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Footer = typeof theme

/** Props of the `Footer` component: the page footer, with start, center and end content areas. */
export type FooterProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'footer'
   */
  as?: PrimitiveProps['as']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Footer>
}

/** Slots of the `Footer` component. */
export type FooterSlots = {
  /** Content aligned to the start on large screens (e.g. copyright). */
  left?: () => VNode[]
  /** Centered content (e.g. links). */
  default?: () => VNode[]
  /** Content aligned to the end on large screens (e.g. social buttons). */
  right?: () => VNode[]
  /** Full-width area above the footer bar (e.g. link columns). Only rendered when filled. */
  top?: () => VNode[]
  /** Full-width area below the footer bar. Only rendered when filled. */
  bottom?: () => VNode[]
}
