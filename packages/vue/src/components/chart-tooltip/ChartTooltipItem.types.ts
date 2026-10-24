import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

export type ChartTooltipItemProps = {
  /** Additional classes merged into the element. */
  class?: ClassValue
}

export type ChartTooltipItemSlots = {
  /** Row content: an indicator, a label and a value. */
  default?: () => VNode[]
}
