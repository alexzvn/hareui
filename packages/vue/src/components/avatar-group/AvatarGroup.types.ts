import type { VNode } from 'vue'

import type { AvatarProps } from '@/components/avatar/Avatar.types'
import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type AvatarGroup = typeof theme

export type AvatarGroupProps = {
  /**
   * Size applied to child Avatars (and the overflow count) that don't set `size`.
   * @defaultValue 'md'
   */
  size?: AvatarProps['size']
  /** Color applied to child Avatars (and the overflow count) that don't set `color`. */
  color?: AvatarProps['color']
  /** Variant applied to child Avatars (and the overflow count) that don't set `variant`. */
  variant?: AvatarProps['variant']
  /** Maximum number of Avatars to render; the rest are counted in a `+N` avatar. Omit to show all. */
  max?: number
  /**
   * Wrapping grid layout without overlap.
   * @defaultValue false
   */
  grid?: boolean
  /**
   * Stacked overlap style: crescent clip or box-shadow ring. Ignored with `grid`.
   * @defaultValue 'clip'
   */
  overlap?: ComponentVariants<AvatarGroup>['overlap']
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<AvatarGroup>
}

export type AvatarGroupSlots = {
  /** The `Avatar` components. Only direct `Avatar` children inherit `size`, `color` and `variant`. */
  default?: () => VNode[]
  /**
   * Content of an explicit overflow-count avatar (e.g. `+9` for a known total). It is not
   * truncated by `max` and replaces the automatic count.
   */
  count?: () => VNode[]
}
