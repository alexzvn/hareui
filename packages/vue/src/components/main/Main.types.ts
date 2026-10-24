import type { PrimitiveProps } from 'reka-ui'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Main = typeof theme

export type MainProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'main'
   */
  as?: PrimitiveProps['as']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Main>
}

export type MainSlots = {
  /** The page content. */
  default?: () => unknown
}
