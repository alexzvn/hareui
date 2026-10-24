import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Surface = typeof theme

export type SurfaceProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * The visual variant of the surface.
   * @defaultValue 'default'
   */
  variant?: ComponentVariants<Surface>['variant']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Surface>
}

export type SurfaceSlots = {
  /** The surface content. */
  default?: () => VNode[]
}
