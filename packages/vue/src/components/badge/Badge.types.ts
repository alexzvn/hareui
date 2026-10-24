import type { VNode } from 'vue'

import type { ComponentSlots, ComponentVariants } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type Badge = typeof theme

export type BadgeProps = {
  /** Text or number shown in the badge, wrapped in the `label` element. Omit it (and `#content`) for a dot. */
  content?: string | number
  /** Badge color. */
  color?: ComponentVariants<Badge>['color']
  /** Corner of the anchored element the badge sits on. */
  placement?: ComponentVariants<Badge>['placement']
  /** Badge size. */
  size?: ComponentVariants<Badge>['size']
  /** Badge variant. */
  variant?: ComponentVariants<Badge>['variant']
  /** Additional classes merged into the badge element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<Badge>
}

export type BadgeSlots = {
  /** The element the badge is anchored to (HeroUI's `Badge.Anchor` children). Without it the badge renders on its own. */
  default?: () => VNode[]
  /** Custom badge content such as an icon, rendered without the `label` wrapper. */
  content?: () => VNode[]
}
