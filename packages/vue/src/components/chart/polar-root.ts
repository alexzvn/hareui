import type { ComputedRef, Ref } from 'vue'
import { computed } from 'vue'

import type { ChartLegendProps } from '@/components/chart-legend'
import type { ChartTooltipContentEntry } from '@/components/chart-tooltip'

import { definedProps } from './cartesian-root'
import type { ChartTooltipProps } from './ChartTooltip.vue'
import type { ChartContext } from './context'
import type { ChartFrameConfig } from './frame'
import { resolveFrameLegend } from './frame'
import { provideChartLabelViewBox } from './label'
import type { PolarContext } from './polar'
import type {
  ChartIndexKey,
  ChartLegendItem,
  ChartLegendPosition,
  ChartSlice,
  ChartValueKey,
} from './series-config'
import { inferValueKeys, isChartGenerated, resolveChartPart, resolveSlices } from './series-config'

/** Props of `PieChart`, `RadarChart` and `RadialChart` that the frame draws. */
export type PolarRootFrameProps = {
  /** Tooltip on hover and focus: `false` turns it off, an object sets `ChartTooltip` props. */
  tooltip?: boolean | Partial<ChartTooltipProps>
  /** `true` (below), a side, or `ChartLegend` props with a `position`. */
  legend?:
    | boolean
    | ChartLegendPosition
    | (Partial<ChartLegendProps<any>> & { position?: ChartLegendPosition })
}

export type PolarRootOptions = {
  props: PolarRootFrameProps
  /** Generated mode: the root draws its parts from props. Composition mode draws only the slot, so no legend or tooltip. */
  generated: () => boolean
  /** Legend rows: the root's series, or its slices. */
  legendItems: () => ChartLegendItem[]
  /** `ChartTooltip` props from root props (e.g. `valueFormatter`), under the `tooltip` prop. */
  tooltip: () => Partial<ChartTooltipProps>
  /** `ChartLegend` props from root props, under those of the `legend` prop. */
  legend?: () => Partial<ChartLegendProps<any>>
  /** Whether the root has a `legend` slot. */
  hasLegendSlot: () => boolean
}

/**
 * Turns a polar root's props into its `ChartFrame` config: the legend and the tooltip. Composition mode renders only
 * the slot, so a `ChartTooltip` child stays the single tooltip and there is no legend.
 */
export const usePolarRoot = (options: PolarRootOptions): ComputedRef<ChartFrameConfig> => {
  const { props } = options
  return computed<ChartFrameConfig>(() => {
    if (!options.generated()) return { legend: null, legendItems: [], tooltip: null }
    return {
      legend: resolveFrameLegend(props.legend, options.hasLegendSlot(), options.legend?.()),
      legendItems: options.legendItems(),
      tooltip: resolveChartPart<Partial<ChartTooltipProps>>(props.tooltip, options.tooltip()),
    }
  })
}

/** Props of the roots that draw one slice (or ring) per row: `PieChart` and `RadialChart`. */
export type SliceRootProps<T extends object> = {
  data?: T[]
  index?: ChartIndexKey<T>
  valueKey?: ChartValueKey<T>
  colors?: string[] | Record<string, string>
  /** Formats slice values in the tooltip and the legend. */
  valueFormatter?: (value: number, name: string) => string
} & PolarRootFrameProps

export type SliceRootOptions<T extends object> = {
  props: SliceRootProps<T>
  hidden: Ref<string[]>
  hasLegendSlot: () => boolean
}

/**
 * `usePolarRoot` for `PieChart` and `RadialChart`: their rows as slices (`index` turns it on), with the legend and
 * tooltip formatting slice values by name.
 */
export const useSliceRoot = <T extends object>(options: SliceRootOptions<T>) => {
  const { props, hidden } = options

  const generated = computed(() => isChartGenerated(props))
  const valueKey = computed(
    () =>
      props.valueKey ??
      (props.index === undefined ? undefined : inferValueKeys(props.data ?? [], props.index)[0]),
  )
  const slices = computed<ChartSlice<T>[] | undefined>(() =>
    generated.value && props.index !== undefined
      ? resolveSlices({
          data: props.data ?? [],
          index: props.index,
          valueKey: valueKey.value,
          colors: props.colors,
          hidden: hidden.value,
        })
      : undefined,
  )
  const visibleSlices = computed(() => slices.value?.filter((slice) => !slice.hidden) ?? [])

  const config = usePolarRoot({
    props,
    generated: () => generated.value,
    legendItems: () =>
      (slices.value ?? []).map(({ key, name, color, hidden, value, percent }) => ({
        key,
        name,
        color,
        hidden,
        value,
        percent,
      })),
    tooltip: () => ({
      valueFormatter: props.valueFormatter
        ? (value: number | string, entry: ChartTooltipContentEntry) =>
            typeof value === 'number'
              ? props.valueFormatter!(value, entry.name ?? '')
              : String(value)
        : undefined,
    }),
    legend: () => definedProps({ valueFormatter: props.valueFormatter }),
    hasLegendSlot: options.hasLegendSlot,
  })

  return { valueKey, slices, visibleSlices, config }
}

/**
 * A `ChartLabel` placed directly in a pie or radial root sits on the polar center, inside a disc of `radius` (the pie,
 * or the hole inside the innermost ring).
 */
export const providePolarCenterLabel = (
  chart: ChartContext,
  polar: PolarContext,
  radius: () => number,
): void => {
  const viewBox = computed(() => ({
    cx: polar.cx.value,
    cy: polar.cy.value,
    innerRadius: 0,
    outerRadius: radius(),
    startAngle: 0,
    endAngle: 360,
  }))
  provideChartLabelViewBox(() => (chart.width.value > 0 ? viewBox.value : null), 'center')
}
