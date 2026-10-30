import type { ComputedRef, InjectionKey } from 'vue'
import { inject } from 'vue'

import type { ComponentUI } from '@/types/tv'

import type theme from './theme'

export type ChartTooltipContext = {
  /** Resolved slot classes for the root's `indicator` variant, with the root's `ui` prop layered in. */
  classes: ComputedRef<ComponentUI<typeof theme>>
}

export const chartTooltipContextKey: InjectionKey<ChartTooltipContext> = Symbol('ChartTooltip')

export const useChartTooltipContext = (part: string): ChartTooltipContext => {
  const context = inject(chartTooltipContextKey, null)
  if (!context) throw new Error(`ChartTooltip${part} must be used inside ChartTooltipContent`)

  return context
}
