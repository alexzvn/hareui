import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

/** Props for `ChartTooltipLabel`, the series name inside a `ChartTooltipItem`. */
export type ChartTooltipLabelProps = {
  /** Additional classes merged into the element. */
  class?: ClassValue
}

/** Slots for `ChartTooltipLabel`. */
export type ChartTooltipLabelSlots = {
  /** Series name. */
  default?: () => VNode[]
}
