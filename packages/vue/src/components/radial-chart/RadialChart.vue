<template>
  <ChartFrame
    v-model:hidden="hidden"
    data-slot="radial-chart"
    :width="width"
    :height="height"
    :config="config"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <template v-for="name in frameSlotNames(slots)" #[name]="scope">
      <slot :name="name" v-bind="scope as any" />
    </template>
    <template v-if="slices && valueKey" #parts>
      <ChartPolarAngleAxis
        type="number"
        :domain="[0, domainMax]"
        :tick="false"
        :axis-line="false"
      />
      <ChartRadialBar
        :data-key="valueKey"
        :name-key="props.index"
        :background="props.background ?? chartDefaults.radial.background"
        :corner-radius="props.cornerRadius ?? chartDefaults.radial.cornerRadius"
      >
        <ChartCell v-for="slice in visibleSlices" :key="slice.key" :fill="slice.color" />
      </ChartRadialBar>
    </template>
    <template #default>
      <slot />
      <ChartPolarCenter v-if="slots.center">
        <slot name="center" v-bind="polar.center.value" />
      </ChartPolarCenter>
    </template>
  </ChartFrame>
</template>

<script lang="ts">
import type { VNode } from 'vue'

import type { ChartLegendProps } from '@/components/chart-legend/ChartLegend.vue'
import type { ChartTooltipContentEntry } from '@/components/chart-tooltip/ChartTooltipContent.vue'
import type { ChartRadialBarBackground } from '@/components/chart/ChartRadialBar.vue'
import type { ChartTooltipProps, ChartTooltipSlotProps } from '@/components/chart/ChartTooltip.vue'
import type { ChartPolarCenterSlotProps } from '@/components/chart/polar'
import type {
  ChartIndexKey,
  ChartLegendItem,
  ChartLegendPosition,
  ChartValueKey,
} from '@/components/chart/series-config'
import type { ChartDatum, ChartMargin } from '@/components/chart/types'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import theme from './theme'

type RadialChartTheme = typeof theme

export type RadialChartProps<T extends object = ChartDatum> = {
  /** Rows to plot. Each row becomes a ring, the first one innermost. */
  data: T[]
  /** Key of the ring name. Setting it draws the rings, tooltip and legend from props (no child parts needed). */
  index?: ChartIndexKey<T>
  /**
   * Key of the ring value.
   * @defaultValue the first numeric key
   */
  valueKey?: ChartValueKey<T>
  /**
   * Ring colors: an array used in row order, or a map keyed by ring name. A row's own `fill` wins.
   * @defaultValue the chart palette
   */
  colors?: string[] | Record<string, string>
  /**
   * Value of a full bar.
   * @defaultValue the largest value
   */
  max?: number
  /**
   * Track behind each bar. An object sets its `fill` and `class`.
   * @defaultValue true
   */
  background?: boolean | ChartRadialBarBackground
  /**
   * Corner radius of the bars, in px.
   * @defaultValue 12
   */
  cornerRadius?: number
  /**
   * Draws a gauge: `startAngle: 225`, `endAngle: -45`. `startAngle` and `endAngle` override it.
   * @defaultValue false
   */
  gauge?: boolean
  /**
   * Tooltip on hover and focus: `false` turns it off, an object sets `ChartTooltip` props.
   * @defaultValue true
   */
  tooltip?: boolean | Partial<ChartTooltipProps>
  /** Legend of the rings: `true` (below), a side, or `ChartLegend` props with a `position`. Clicking a row hides its ring. */
  legend?:
    | boolean
    | ChartLegendPosition
    | (Partial<ChartLegendProps<T>> & { position?: ChartLegendPosition })
  /** Formats ring values in the tooltip and the legend. */
  valueFormatter?: (value: number, name: string) => string
  /** Names of hidden rings (`v-model:hidden`). */
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
   * Space between the rings and the edges of the chart, in pixels.
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
   * Bar thickness, in px.
   * @defaultValue 10
   */
  barSize?: number
  /**
   * Gap between the bars of a ring when several `ChartRadialBar`s share the chart, in px or as a percentage.
   * @defaultValue 4
   */
  barGap?: number | string
  /**
   * Gap between rings when `barSize` is not set, in px or as a percentage of the ring.
   * @defaultValue '10%'
   */
  barCategoryGap?: number | string
  /** Largest bar thickness, in px. */
  maxBarSize?: number
  /**
   * Radius of the innermost ring, in px or as a percentage of half the shorter chart side.
   * @defaultValue '30%'
   */
  innerRadius?: number | string
  /**
   * Radius of the outermost ring, in px or as a percentage of half the shorter chart side.
   * @defaultValue '80%'
   */
  outerRadius?: number | string
  /**
   * Angle where the bars start, in degrees. 0 is at 3 o'clock; 90 points up.
   * @defaultValue 90 (225 with `gauge`)
   */
  startAngle?: number
  /**
   * Angle of a full bar, in degrees. The default goes clockwise once around.
   * @defaultValue -270 (-45 with `gauge`)
   */
  endAngle?: number
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<RadialChartTheme>
}

export type RadialChartSlots = {
  /** Chart parts: `ChartRadialBar`, `ChartPolarAngleAxis`, `ChartPolarGrid`, `ChartTooltip`, a centered `ChartLabel`. With `index`, extra parts drawn over the generated rings. */
  default?: () => VNode[]
  /** HTML centered in the rings, e.g. the value of a gauge. */
  center?: (props: ChartPolarCenterSlotProps) => VNode[]
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

import ChartCell from '@/components/chart/ChartCell.vue'
import ChartFrame from '@/components/chart/ChartFrame.vue'
import ChartPolarAngleAxis from '@/components/chart/ChartPolarAngleAxis.vue'
import ChartPolarCenter from '@/components/chart/ChartPolarCenter.vue'
import ChartRadialBar from '@/components/chart/ChartRadialBar.vue'
import { useChartRoot } from '@/components/chart/context'
import { frameSlotNames } from '@/components/chart/frame'
import { usePolarChart } from '@/components/chart/polar'
import { providePolarCenterLabel, useSliceRoot } from '@/components/chart/polar-root'
import { chartDefaults } from '@/components/chart/series-config'
import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<RadialChartProps<T>>(), {
  height: 300,
  width: '100%',
  margin: () => ({ top: 5, right: 5, bottom: 5, left: 5 }),
  cx: '50%',
  cy: '50%',
  barSize: 10,
  barGap: 4,
  barCategoryGap: '10%',
  innerRadius: '30%',
  outerRadius: '80%',
  gauge: false,
  background: undefined,
  tooltip: undefined,
  legend: undefined,
})
const slots = defineSlots<RadialChartSlots>()
const hidden = defineModel<string[]>('hidden', { default: () => [] })

const { valueKey, slices, visibleSlices, config } = useSliceRoot({
  props,
  hidden,
  hasLegendSlot: () => !!slots.legend,
})
// Full bar: `max`, or the largest value of every ring (hidden ones too, so toggling a ring keeps the scale).
const domainMax = computed(
  () => props.max ?? Math.max(0, ...(slices.value ?? []).map((slice) => slice.value)),
)

const startAngle = computed(
  () => props.startAngle ?? (props.gauge ? chartDefaults.gauge.startAngle : 90),
)
const endAngle = computed(
  () => props.endAngle ?? (props.gauge ? chartDefaults.gauge.endAngle : -270),
)

const ui = useComponentUI('radialChart', theme, () => ({}))
const chart = useChartRoot({
  // Generated mode: only the visible rings reach the chart, so the active index points into them.
  data: () =>
    (slices.value ? visibleSlices.value.map((slice) => slice.row) : props.data) as ChartDatum[],
  margin: () => props.margin,
  layout: () => 'radial',
  ui,
  uiProps: () => props.ui,
})
const polar = usePolarChart(chart, {
  kind: 'radialBar',
  cx: () => props.cx,
  cy: () => props.cy,
  innerRadius: () => props.innerRadius,
  outerRadius: () => props.outerRadius,
  startAngle: () => startAngle.value,
  endAngle: () => endAngle.value,
  barSize: () => props.barSize,
  barGap: () => props.barGap,
  barCategoryGap: () => props.barCategoryGap,
  maxBarSize: () => props.maxBarSize,
  slices: () => slices.value,
})
// The hole inside the innermost ring.
providePolarCenterLabel(chart, polar, () => polar.innerRadius.value)
</script>
