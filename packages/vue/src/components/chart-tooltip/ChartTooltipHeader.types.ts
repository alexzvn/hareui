import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

/** Props for `ChartTooltipHeader`, the heading row of a composed chart tooltip. */
export type ChartTooltipHeaderProps = {
  /** Additional classes merged into the element. */
  class?: ClassValue
}

/** Slots for `ChartTooltipHeader`. */
export type ChartTooltipHeaderSlots = {
  /** Header text, usually the x-axis label of the hovered point. */
  default?: () => VNode[]
}
