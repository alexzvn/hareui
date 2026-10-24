<template>
  <ChartFrame
    v-model:hidden="hidden"
    data-slot="pie-chart"
    :width="width"
    :height="height"
    :config="config"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <template v-for="name in frameSlotNames(slots)" #[name]="scope">
      <slot :name="name" v-bind="scope as any" />
    </template>
    <template #parts>
      <ChartPie v-if="slices && valueKey" :data-key="valueKey" :name-key="props.index" v-bind="pie">
        <ChartCell v-for="slice in visibleSlices" :key="slice.key" :fill="slice.color" />
      </ChartPie>
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
import type { ChartLegendProps } from '@/components/chart-legend/ChartLegend.vue'
import type { ChartTooltipContentEntry } from '@/components/chart-tooltip/ChartTooltipContent.vue'
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

import theme from './theme'

type PieChartTheme = typeof theme

export interface PieChartProps<T extends object = ChartDatum> {
  /** Rows of the chart. With `index`, each row is one slice; otherwise they are shared by every `ChartPie` without its own `data`. */
  data?: T[]
  /** Key of the slice name. Setting it draws the pie, tooltip and legend from props (no child parts needed). */
  index?: ChartIndexKey<T>
  /**
   * Key of the slice value.
   * @defaultValue the first numeric key
   */
  valueKey?: ChartValueKey<T>
  /**
   * Slice colors: an array used in row order, or a map keyed by slice name. A row's own `fill` wins.
   * @defaultValue the chart palette
   */
  colors?: string[] | Record<string, string>
  /**
   * Draws a donut: `innerRadius: '68%'`, `cornerRadius: 12`, `paddingAngle: -20`. The props below override it.
   * @defaultValue false
   */
  donut?: boolean
  /** Radius of the center hole, in px or as a percentage of half the shorter chart side. */
  innerRadius?: number | string
  /** Radius of the pie, in px or as a percentage of half the shorter chart side. */
  outerRadius?: number | string
  /** Corner radius of each slice, in px. */
  cornerRadius?: number
  /** Gap between slices, in degrees. Negative values overlap rounded slices. */
  paddingAngle?: number
  /** Angle of the first slice edge, in degrees. 0 is at 3 o'clock; 90 points up. */
  startAngle?: number
  /** Angle the slices run to, in degrees. */
  endAngle?: number
  /**
   * Tooltip on hover and focus: `false` turns it off, an object sets `ChartTooltip` props.
   * @defaultValue true
   */
  tooltip?: boolean | Partial<ChartTooltipProps>
  /** Legend of the slices: `true` (below), a side, or `ChartLegend` props with a `position`. Clicking a row hides its slice. */
  legend?:
    | boolean
    | ChartLegendPosition
    | (Partial<ChartLegendProps<T>> & { position?: ChartLegendPosition })
  /** Formats slice values in the tooltip and the legend. */
  valueFormatter?: (value: number, name: string) => string
  /** Names of hidden slices (`v-model:hidden`). */
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
   * Space between the pies and the edges of the chart, in pixels.
   * @defaultValue { top: 5, right: 5, bottom: 5, left: 5 }
   */
  margin?: ChartMargin
  /** Additional classes merged into the root element. */
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<PieChartTheme>
}

export interface PieChartSlots {
  /** Chart parts: `ChartPie`, `ChartTooltip`, a centered `ChartLabel`, and raw SVG such as `<defs>`. With `index`, extra parts drawn over the generated pie. */
  default?: () => any
  /** HTML centered in the pie, e.g. a total inside a donut. */
  center?: (props: ChartPolarCenterSlotProps) => any
  /** Replaces the tooltip panel. */
  tooltip?: (props: ChartTooltipSlotProps) => any
  /** Content under the tooltip rows. */
  'tooltip-footer'?: (props: {
    label?: number | string
    payload: ChartTooltipContentEntry[]
  }) => any
  /** Replaces the legend. */
  legend?: (props: { items: ChartLegendItem[]; toggle: (key: string) => void }) => any
  /** Replaces each legend row. */
  'legend-item'?: (props: { item: ChartLegendItem; index: number; toggle: () => void }) => any
}
</script>

<script setup lang="ts" generic="T extends object">
import { computed } from 'vue'

import ChartCell from '@/components/chart/ChartCell.vue'
import ChartFrame from '@/components/chart/ChartFrame.vue'
import ChartPie from '@/components/chart/ChartPie.vue'
import ChartPolarCenter from '@/components/chart/ChartPolarCenter.vue'
import { useChartRoot } from '@/components/chart/context'
import { frameSlotNames } from '@/components/chart/frame'
import { usePolarChart } from '@/components/chart/polar'
import { providePolarCenterLabel, useSliceRoot } from '@/components/chart/polar-root'
import { chartDefaults } from '@/components/chart/series-config'
import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<PieChartProps<T>>(), {
  height: 300,
  width: '100%',
  margin: () => ({ top: 5, right: 5, bottom: 5, left: 5 }),
  donut: false,
  tooltip: undefined,
  legend: undefined,
})
const slots = defineSlots<PieChartSlots>()
const hidden = defineModel<string[]>('hidden', { default: () => [] })

const { valueKey, slices, visibleSlices, config } = useSliceRoot({
  props,
  hidden,
  hasLegendSlot: () => !!slots.legend,
})

const pie = computed(() => {
  const own = {
    innerRadius: props.innerRadius,
    outerRadius: props.outerRadius,
    cornerRadius: props.cornerRadius,
    paddingAngle: props.paddingAngle,
    startAngle: props.startAngle,
    endAngle: props.endAngle,
  }
  const defined = Object.fromEntries(Object.entries(own).filter(([, value]) => value !== undefined))
  return { ...(props.donut ? chartDefaults.donut : {}), ...defined }
})

const ui = useComponentUI('pieChart', theme, () => ({}))
const chart = useChartRoot({
  // Generated mode: only the visible slices reach the pie, so the active index points into them.
  data: () =>
    (slices.value ? visibleSlices.value.map((slice) => slice.row) : props.data) as
      | ChartDatum[]
      | undefined,
  margin: () => props.margin,
  layout: () => 'centric',
  ui,
  uiProps: () => props.ui,
})
// The center follows the first pie drawn (see `usePolarChart`), so the root passes no geometry of its own.
const polar = usePolarChart(chart, { kind: 'pie', slices: () => slices.value })
providePolarCenterLabel(chart, polar, () => polar.outerRadius.value)
</script>
