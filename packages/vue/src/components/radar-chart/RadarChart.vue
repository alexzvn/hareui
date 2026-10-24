<template>
  <ChartFrame
    v-model:hidden="hidden"
    data-slot="radar-chart"
    :width="width"
    :height="height"
    :config="config"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <template v-for="name in frameSlotNames(slots)" #[name]="scope">
      <slot :name="name" v-bind="scope as any" />
    </template>
    <template #parts>
      <ChartPolarGrid v-if="grid" v-bind="grid" />
      <ChartPolarAngleAxis v-if="angleAxis" v-bind="angleAxis">
        <template v-if="slots['angle-tick']" #tick="tick">
          <slot name="angle-tick" v-bind="tick" />
        </template>
      </ChartPolarAngleAxis>
      <ChartPolarRadiusAxis v-if="radiusAxis" v-bind="radiusAxis" />
      <!-- Hidden radars stay mounted with `hide`, so colors are stable and toggling animates. -->
      <ChartRadar
        v-for="series in resolved"
        :key="series.key"
        :data-key="series.key"
        :name="series.name"
        :stroke="series.color"
        :fill="series.color"
        :fill-opacity="series.fillOpacity"
        :stroke-width="series.strokeWidth"
        :stroke-dasharray="series.strokeDasharray"
        :dot="series.dot"
        :active-dot="series.activeDot"
        :hide="series.hidden"
        :tooltip-type="series.tooltip === false ? 'none' : undefined"
      />
    </template>
    <template #default>
      <slot />
    </template>
  </ChartFrame>
</template>

<script lang="ts">
import type { VNode } from 'vue'

import type { ChartLegendProps } from '@/components/chart-legend/ChartLegend.vue'
import type { ChartTooltipContentEntry } from '@/components/chart-tooltip/ChartTooltipContent.vue'
import type {
  ChartPolarAngleAxisProps,
  ChartPolarAngleAxisSlots,
} from '@/components/chart/ChartPolarAngleAxis.vue'
import type { ChartPolarGridProps } from '@/components/chart/ChartPolarGrid.vue'
import type { ChartPolarRadiusAxisProps } from '@/components/chart/ChartPolarRadiusAxis.vue'
import type { ChartTooltipProps, ChartTooltipSlotProps } from '@/components/chart/ChartTooltip.vue'
import type {
  ChartIndexKey,
  ChartLegendItem,
  ChartLegendPosition,
  ChartRadarSeries,
  ChartSeriesInput,
} from '@/components/chart/series-config'
import type { ChartDatum, ChartDotProps, ChartMargin } from '@/components/chart/types'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type RadarChartTheme = typeof theme

export type RadarChartProps<T extends object = ChartDatum> = {
  /** Rows to plot. Each row is one spoke; each radar reads one field of every row. */
  data: T[]
  /** Key of the spoke labels. Setting it (or `series`) draws the grid, axis, radars, tooltip and legend from props. */
  index?: ChartIndexKey<T>
  /**
   * Radars to draw: a map from value key to config, or an array of keys and `{ key, ...config }` objects.
   * @defaultValue every numeric key except `index`
   */
  series?: ChartSeriesInput<T, ChartRadarSeries>
  /**
   * Radar colors, used in series order.
   * @defaultValue the chart palette
   */
  colors?: string[]
  /**
   * Fill opacity of every radar. A series' own `fillOpacity` wins.
   * @defaultValue 0.15
   */
  fillOpacity?: number
  /**
   * Outline width of every radar, in px. A series' own `strokeWidth` wins.
   * @defaultValue 2
   */
  strokeWidth?: number
  /**
   * Point markers of every radar: `true`, or circle attributes. A series' own `dot` wins.
   * @defaultValue false
   */
  dot?: boolean | ChartDotProps
  /**
   * Polygon grid: `false` hides it, an object sets `ChartPolarGrid` props.
   * @defaultValue true
   */
  grid?: boolean | Partial<ChartPolarGridProps>
  /**
   * Spoke labels from `index`: `false` hides them, an object sets `ChartPolarAngleAxis` props.
   * @defaultValue true
   */
  angleAxis?: boolean | Partial<ChartPolarAngleAxisProps>
  /**
   * Value labels along one spoke: `true` shows them, an object sets `ChartPolarRadiusAxis` props.
   * @defaultValue false
   */
  radiusAxis?: boolean | Partial<ChartPolarRadiusAxisProps>
  /**
   * Tooltip on hover and focus: `false` turns it off, an object sets `ChartTooltip` props.
   * @defaultValue true
   */
  tooltip?: boolean | Partial<ChartTooltipProps>
  /** Legend of the radars: `true` (below), a side, or `ChartLegend` props with a `position`. Clicking a row hides its radar. */
  legend?:
    | boolean
    | ChartLegendPosition
    | (Partial<ChartLegendProps<T>> & { position?: ChartLegendPosition })
  /** Formats values in the tooltip. A series' own `valueFormatter` wins. */
  valueFormatter?: (value: number, key: string) => string
  /** Formats the spoke labels and the tooltip header. */
  indexFormatter?: (value: number | string) => string
  /** Keys of hidden radars (`v-model:hidden`). */
  hidden?: string[]
  /**
   * Chart height in pixels.
   * @defaultValue 300
   */
  height?: number
  /**
   * Chart width in pixels or as a percentage of the parent.
   * @defaultValue '100%'
   */
  width?: number | `${number}%`
  /**
   * Space between the chart and its edges, in pixels.
   * @defaultValue { top: 5, right: 5, bottom: 5, left: 5 }
   */
  margin?: ChartMargin
  /**
   * Horizontal center, in px or as a percentage of the chart width.
   * @defaultValue '50%'
   */
  cx?: number | string
  /**
   * Vertical center, in px or as a percentage of the chart height.
   * @defaultValue '50%'
   */
  cy?: number | string
  /**
   * Radius of the center hole, in px or as a percentage of half the shorter chart side.
   * @defaultValue 0
   */
  innerRadius?: number | string
  /**
   * Radius of the outer ring, in px or as a percentage of half the shorter chart side.
   * @defaultValue '80%'
   */
  outerRadius?: number | string
  /**
   * Angle of the first spoke, in degrees. 0 is at 3 o'clock; 90 points up.
   * @defaultValue 90
   */
  startAngle?: number
  /**
   * Angle the spokes run to, in degrees. The default goes clockwise once around.
   * @defaultValue -270
   */
  endAngle?: number
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<RadarChartTheme>
}

export type RadarChartSlots = {
  /** Chart parts: `ChartPolarGrid`, `ChartPolarAngleAxis`, `ChartPolarRadiusAxis`, `ChartRadar`, `ChartTooltip`. With `index` or `series`, extra parts drawn over the generated ones. */
  default?: () => VNode[]
  /** Replaces each spoke label. Render SVG (`<text>`, `<g>`). */
  'angle-tick'?: ChartPolarAngleAxisSlots['tick']
  /** Replaces the tooltip panel. */
  tooltip?: (props: ChartTooltipSlotProps) => VNode[]
  /** Content under the tooltip rows. */
  'tooltip-footer'?: (props: {
    label?: number | string
    payload: ChartTooltipContentEntry[]
  }) => VNode[]
  /** Replaces the legend. */
  legend?: (props: { items: ChartLegendItem[]; toggle: (key: string) => void }) => VNode[]
  /** Replaces each legend row. */
  'legend-item'?: (props: { item: ChartLegendItem; index: number; toggle: () => void }) => VNode[]
}
</script>

<script setup lang="ts" generic="T extends object">
import { computed } from 'vue'

import { definedProps } from '@/components/chart/cartesian-root'
import ChartFrame from '@/components/chart/ChartFrame.vue'
import ChartPolarAngleAxis from '@/components/chart/ChartPolarAngleAxis.vue'
import ChartPolarGrid from '@/components/chart/ChartPolarGrid.vue'
import ChartPolarRadiusAxis from '@/components/chart/ChartPolarRadiusAxis.vue'
import ChartRadar from '@/components/chart/ChartRadar.vue'
import { useChartRoot } from '@/components/chart/context'
import { frameSlotNames } from '@/components/chart/frame'
import { usePolarChart } from '@/components/chart/polar'
import { usePolarRoot } from '@/components/chart/polar-root'
import {
  chartDefaults,
  isChartGenerated,
  resolveChartPart,
  resolveSeries,
  seriesLegendItems,
  seriesValueFormatter,
} from '@/components/chart/series-config'
import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<RadarChartProps<T>>(), {
  height: 300,
  width: '100%',
  margin: () => ({ top: 5, right: 5, bottom: 5, left: 5 }),
  cx: '50%',
  cy: '50%',
  innerRadius: 0,
  outerRadius: '80%',
  startAngle: 90,
  endAngle: -270,
  dot: undefined,
  grid: undefined,
  angleAxis: undefined,
  radiusAxis: undefined,
  tooltip: undefined,
  legend: undefined,
})
const slots = defineSlots<RadarChartSlots>()
const hidden = defineModel<string[]>('hidden', { default: () => [] })

const generated = computed(() => isChartGenerated(props))
const resolved = computed(() => {
  if (!generated.value) return []
  const own = { fillOpacity: props.fillOpacity, strokeWidth: props.strokeWidth, dot: props.dot }
  const defined = Object.fromEntries(Object.entries(own).filter(([, value]) => value !== undefined))
  return resolveSeries<T, ChartRadarSeries>({
    data: props.data,
    index: props.index,
    series: props.series,
    colors: props.colors,
    hidden: hidden.value,
    defaults: { ...chartDefaults.radar, ...defined },
  })
})

const grid = computed(() =>
  generated.value ? resolveChartPart<Partial<ChartPolarGridProps>>(props.grid, {}) : null,
)
const angleAxis = computed(() =>
  generated.value
    ? resolveChartPart<Partial<ChartPolarAngleAxisProps>>(
        props.angleAxis,
        definedProps({
          dataKey: props.index as string | undefined,
          tickFormatter: props.indexFormatter,
        }),
      )
    : null,
)
const radiusAxis = computed(() =>
  generated.value
    ? resolveChartPart<Partial<ChartPolarRadiusAxisProps>>(props.radiusAxis, {}, false)
    : null,
)

const config = usePolarRoot({
  props,
  generated: () => generated.value,
  legendItems: () => seriesLegendItems(resolved.value),
  tooltip: () =>
    definedProps({
      valueFormatter: seriesValueFormatter(resolved.value, props.valueFormatter),
      labelFormatter: props.indexFormatter,
    }),
  hasLegendSlot: () => !!slots.legend,
})

const ui = useComponentUI('radarChart', theme, () => ({}))
const chart = useChartRoot({
  data: () => props.data as ChartDatum[],
  margin: () => props.margin,
  layout: () => 'centric',
  ui,
  uiProps: () => props.ui,
})
usePolarChart(chart, {
  kind: 'radar',
  cx: () => props.cx,
  cy: () => props.cy,
  innerRadius: () => props.innerRadius,
  outerRadius: () => props.outerRadius,
  startAngle: () => props.startAngle,
  endAngle: () => props.endAngle,
})
</script>
