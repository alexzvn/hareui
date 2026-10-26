import type { PrimitiveProps } from 'reka-ui'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Container = typeof theme

/** Props of `Container`, a centered wrapper that constrains page content to a maximum width. */
export type ContainerProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Container>
}

/** Slots of `Container`. */
export type ContainerSlots = {
  /** The container content. */
  default?: () => unknown
}
