import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

export type ChartTooltipLabelProps = {
  /** Additional classes merged into the element. */
  class?: ClassValue
}

export type ChartTooltipLabelSlots = {
  /** Series name. */
  default?: () => VNode[]
}
