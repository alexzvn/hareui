import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

export type ChartTooltipValueProps = {
  /** Additional classes merged into the element. */
  class?: ClassValue
}

export type ChartTooltipValueSlots = {
  /** Series value, already formatted. */
  default?: () => VNode[]
}
