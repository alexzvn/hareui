import type { PrimitiveProps } from 'reka-ui'
import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Skeleton = typeof theme

/** Props of `Skeleton`, an animated placeholder shown while content loads. */
export type SkeletonProps = {
  /**
   * The element or component to render as.
   * @defaultValue 'div'
   */
  as?: PrimitiveProps['as']
  /**
   * Animation type. When omitted, the `--skeleton-animation` CSS variable on `:root`
   * (`shimmer`, `pulse` or `none`) decides, falling back to `shimmer`.
   */
  animationType?: ComponentVariants<Skeleton>['animationType']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Skeleton>
}

/** Slots of `Skeleton`. */
export type SkeletonSlots = {
  /** Optional content rendered inside the placeholder. */
  default?: () => VNode[]
}
