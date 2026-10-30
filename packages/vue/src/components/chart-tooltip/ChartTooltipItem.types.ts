import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

/** Props for `ChartTooltipItem`, one series row of a composed chart tooltip. */
export type ChartTooltipItemProps = {
  /** Additional classes merged into the element. */
  class?: ClassValue
}

/** Slots for `ChartTooltipItem`. */
export type ChartTooltipItemSlots = {
  /** Row content: an indicator, a label and a value. */
  default?: () => VNode[]
}
