<script lang="ts">
import type { ComponentSlots } from '../../types/tv'
import type { ChartLegendProps } from '../chart-legend/ChartLegend.vue'
import type { ChartTooltipContentEntry } from '../chart-tooltip/ChartTooltipContent.vue'
import type { ChartTooltipProps, ChartTooltipSlotProps } from '../chart/ChartTooltip.vue'
import type { ChartPolarCenterSlotProps } from '../chart/polar'
import type { ChartIndexKey, ChartLegendItem, ChartLegendPosition, ChartValueKey } from '../chart/series-config'
import type { ChartDatum, ChartMargin } from '../chart/types'
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
  legend?: boolean | ChartLegendPosition | (Partial<ChartLegendProps<T>> & { position?: ChartLegendPosition })
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
  'default'?: () => any
  /** HTML centered in the pie, e.g. a total inside a donut. */
  'center'?: (props: ChartPolarCenterSlotProps) => any
  /** Replaces the tooltip panel. */
  'tooltip'?: (props: ChartTooltipSlotProps) => any
  /** Content under the tooltip rows. */
  'tooltip-footer'?: (props: { label?: number | string, payload: ChartTooltipContentEntry[] }) => any
  /** Replaces the legend. */
  'legend'?: (props: { items: ChartLegendItem[], toggle: (key: string) => void }) => any
  /** Replaces each legend row. */
  'legend-item'?: (props: { item: ChartLegendItem, index: number, toggle: () => void }) => any
}
</script>

<script setup lang="ts" generic="T extends object">
import { computed } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import ChartLegend from '../chart-legend/ChartLegend.vue'
import ChartCell from '../chart/ChartCell.vue'
import ChartPie from '../chart/ChartPie.vue'
import ChartPolarCenter from '../chart/ChartPolarCenter.vue'
import ChartSurface from '../chart/ChartSurface.vue'
import ChartTooltip from '../chart/ChartTooltip.vue'
import { useChartRoot } from '../chart/context'
import { provideChartLabelViewBox } from '../chart/label'
import { usePolarChart } from '../chart/polar'
import { chartDefaults, inferValueKeys, isChartGenerated, resolveChartLegend, resolveChartPart, resolveSlices, toggleHiddenKey } from '../chart/series-config'

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

const generated = computed(() => isChartGenerated(props))
const valueKey = computed(() => props.valueKey ?? (props.index === undefined ? undefined : inferValueKeys(props.data ?? [], props.index)[0]))
const slices = computed(() => (generated.value && props.index !== undefined
  ? resolveSlices({ data: props.data ?? [], index: props.index, valueKey: valueKey.value, colors: props.colors, hidden: hidden.value })
  : undefined))
const visibleSlices = computed(() => slices.value?.filter(slice => !slice.hidden) ?? [])

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

// Composition mode renders only the slot, so a `ChartTooltip` child stays the single tooltip.
const tooltip = computed(() => (generated.value
  ? resolveChartPart<Partial<ChartTooltipProps>>(props.tooltip, {
      valueFormatter: props.valueFormatter
        ? (value: number | string, entry: ChartTooltipContentEntry) => (typeof value === 'number' ? props.valueFormatter!(value, entry.name ?? '') : String(value))
        : undefined,
    })
  : null))

const legend = computed(() => (generated.value ? resolveChartLegend<ChartLegendProps<T>>(props.legend) : null))
const legendPosition = computed(() => legend.value?.position ?? (generated.value && slots.legend ? 'bottom' : null))
const legendItems = computed<ChartLegendItem[]>(() => (slices.value ?? []).map(({ key, name, color, hidden, value, percent }) => ({ key, name, color, hidden, value, percent })))
function toggle(key: string) {
  hidden.value = toggleHiddenKey(hidden.value, key)
}

const ui = useComponentUI('pieChart', theme, () => ({}))
const chart = useChartRoot({
  // Generated mode: only the visible slices reach the pie, so the active index points into them.
  data: () => (slices.value ? visibleSlices.value.map(slice => slice.row) : props.data) as ChartDatum[] | undefined,
  margin: () => props.margin,
  layout: () => 'centric',
  ui,
  uiProps: () => props.ui,
})
const polar = usePolarChart(chart, { kind: 'pie', slices: () => slices.value })

const centerViewBox = computed(() => ({
  cx: polar.cx.value,
  cy: polar.cy.value,
  innerRadius: 0,
  outerRadius: polar.outerRadius.value,
  startAngle: 0,
  endAngle: 360,
}))
provideChartLabelViewBox(() => (chart.width.value > 0 ? centerViewBox.value : null), 'center')
</script>

<template>
  <ChartSurface
    data-slot="pie-chart"
    :width="width"
    :height="height"
    :legend="legendPosition"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <template v-if="legendPosition" #legend>
      <slot name="legend" :items="legendItems" :toggle="toggle">
        <ChartLegend
          v-model:hidden="hidden"
          :items="legendItems"
          toggleable
          :orientation="legendPosition === 'left' || legendPosition === 'right' ? 'vertical' : 'horizontal'"
          :value-formatter="props.valueFormatter"
          v-bind="legend?.props"
          :class="[(legendPosition === 'top' || legendPosition === 'bottom') && 'justify-center', chart.classes('legend')]"
        >
          <template v-if="slots['legend-item']" #item="item">
            <slot name="legend-item" v-bind="item" />
          </template>
        </ChartLegend>
      </slot>
    </template>
    <ChartPie
      v-if="slices && valueKey"
      :data-key="valueKey"
      :name-key="props.index"
      v-bind="pie"
    >
      <ChartCell v-for="slice in visibleSlices" :key="slice.key" :fill="slice.color" />
    </ChartPie>
    <ChartTooltip v-if="tooltip" v-bind="tooltip">
      <template v-if="slots.tooltip" #content="content">
        <slot name="tooltip" v-bind="content" />
      </template>
      <template v-if="slots['tooltip-footer']" #footer="footer">
        <slot name="tooltip-footer" v-bind="footer" />
      </template>
    </ChartTooltip>
    <slot />
    <ChartPolarCenter v-if="slots.center">
      <slot name="center" v-bind="polar.center.value" />
    </ChartPolarCenter>
  </ChartSurface>
</template>
