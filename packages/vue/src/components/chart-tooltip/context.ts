import type { ComputedRef, InjectionKey } from 'vue'
import type { ComponentSlots, ComponentUI } from '../../types/tv'
import type theme from './theme'
import { inject } from 'vue'

export interface ChartTooltipContext {
  /** Resolved slot classes for the root's `indicator` variant. */
  classes: ComputedRef<ComponentUI<typeof theme>>
  /** The root's `ui` prop, merged into every part. */
  ui: () => ComponentSlots<typeof theme> | undefined
}

export const chartTooltipContextKey: InjectionKey<ChartTooltipContext> = Symbol('ChartTooltip')

export function useChartTooltipContext(part: string): ChartTooltipContext {
  const context = inject(chartTooltipContextKey, null)
  if (!context)
    throw new Error(`ChartTooltip${part} must be used inside ChartTooltipContent`)
  return context
}
