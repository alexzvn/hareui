import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

/** Props for `ChartTooltipValue`, the series value inside a `ChartTooltipItem`. */
export type ChartTooltipValueProps = {
  /** Additional classes merged into the element. */
  class?: ClassValue
}

/** Slots for `ChartTooltipValue`. */
export type ChartTooltipValueSlots = {
  /** Series value, already formatted. */
  default?: () => VNode[]
}
