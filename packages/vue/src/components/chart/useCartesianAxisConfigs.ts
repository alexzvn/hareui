import type { ComputedRef } from 'vue'
import { computed, onScopeDispose, shallowReactive, watchEffect } from 'vue'

import { isSameAxisId } from './cartesian-values'
import type { ChartAxisConfig, ChartAxisId } from './cartesian.types'
import type { ChartContext } from './context'

type AxisRegistry = Map<number, () => ChartAxisConfig>

const duplicateAxisMessage = (config: ChartAxisConfig) => {
  const id = String(config.id ?? 0)
  const prop = `:${config.axis}-axis="false"`
  const component = `Chart${config.axis.toUpperCase()}Axis`

  return `[hareui] Two ${config.axis} axes with id "${id}" in one chart. When the chart root draws its axes from props, turn its axis off (\`${prop}\`) before adding a ${component}, or give the extra axis its own id.`
}

// Two axes with the same id usually mean a root config prop (`x-axis`, `y-axis`) and a child `ChartXAxis` /
// `ChartYAxis` both draw it. Each duplicate warns once.
const warnDuplicateAxes = (registry: AxisRegistry) => {
  const warned = new Set<string>()

  watchEffect(() => {
    const seen = new Set<string>()

    for (const get of registry.values()) {
      const config = get()
      const key = `${config.axis}:${String(config.id ?? 0)}`

      if (seen.has(key) && !warned.has(key)) {
        warned.add(key)
        console.warn(duplicateAxisMessage(config))
      }

      seen.add(key)
    }
  })
}

/** Axis configs registered by `ChartXAxis` / `ChartYAxis`, plus the implicit axes series refer to. */
export const useCartesianAxisConfigs = (
  chart: ChartContext,
  isHorizontal: ComputedRef<boolean>,
) => {
  const registry: AxisRegistry = shallowReactive(new Map())
  let nextKey = 0

  const registerAxis = (get: () => ChartAxisConfig) => {
    const key = nextKey++
    registry.set(key, get)

    const unregister = () => registry.delete(key)
    onScopeDispose(unregister)

    return unregister
  }

  // Registered axes plus implicit hidden axes for ids series use without an axis component (sparklines).
  const configs = computed<ChartAxisConfig[]>(() => {
    const list = [...registry.values()].map((get) => get())

    const ensure = (axis: 'x' | 'y', id: ChartAxisId | undefined) => {
      const isRegistered = list.some(
        (config) => config.axis === axis && isSameAxisId(config.id, id),
      )

      if (isRegistered) return

      const isCategory = (axis === 'x') === isHorizontal.value
      list.push({ axis, id: id ?? 0, hide: true, type: isCategory ? 'category' : 'number' })
    }

    ensure('x', 0)
    ensure('y', 0)

    for (const series of chart.series.value) {
      ensure('x', series.xAxisId)
      ensure('y', series.yAxisId)
    }

    return list
  })

  if (import.meta.env?.DEV) warnDuplicateAxes(registry)

  return { registerAxis, configs }
}
