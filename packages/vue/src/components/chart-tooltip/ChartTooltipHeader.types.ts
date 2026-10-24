import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

export type ChartTooltipHeaderProps = {
  /** Additional classes merged into the element. */
  class?: ClassValue
}

export type ChartTooltipHeaderSlots = {
  /** Header text, usually the x-axis label of the hovered point. */
  default?: () => VNode[]
}
