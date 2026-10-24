import type { ComputedRef, InjectionKey } from 'vue'
import { computed, inject, onScopeDispose, provide, shallowReactive } from 'vue'

import type { ClassValue } from '@/utils/tv'

/** Per-datum style overrides set by `ChartCell`. */
export type ChartCellStyle = {
  fill?: string
  fillOpacity?: number
  stroke?: string
  strokeWidth?: number
  class?: ClassValue
}

type ChartCellRegistry = {
  register: (get: () => ChartCellStyle) => void
}

const chartCellsKey: InjectionKey<ChartCellRegistry> = Symbol('hareui-chart-cells')

/**
 * Series: collects the `ChartCell`s in its default slot. Cells match data by order, so `cells.value[i]`
 * styles row `i`.
 */
export const provideChartCells = (): ComputedRef<ChartCellStyle[]> => {
  const registry = shallowReactive(new Map<number, () => ChartCellStyle>())
  let next = 0
  provide(chartCellsKey, {
    register(get) {
      const key = next++
      registry.set(key, get)
      onScopeDispose(() => registry.delete(key))
    },
  })

  return computed(() => [...registry.values()].map((get) => get()))
}

/** `ChartCell`: registers its style with the enclosing series. */
export const useChartCellRegistry = (): ChartCellRegistry | null => {
  return inject(chartCellsKey, null)
}
