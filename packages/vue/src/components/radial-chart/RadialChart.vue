<script lang="ts">
import type { ComponentSlots } from '../../types/tv'
import type { ChartLegendProps } from '../chart-legend/ChartLegend.vue'
import type { ChartTooltipContentEntry } from '../chart-tooltip/ChartTooltipContent.vue'
import type { ChartRadialBarBackground } from '../chart/ChartRadialBar.vue'
import type { ChartTooltipProps, ChartTooltipSlotProps } from '../chart/ChartTooltip.vue'
import type { ChartPolarCenterSlotProps } from '../chart/polar'
import type { ChartIndexKey, ChartLegendItem, ChartLegendPosition, ChartValueKey } from '../chart/series-config'
import type { ChartDatum, ChartMargin } from '../chart/types'
import theme from './theme'

type RadialChartTheme = typeof theme

export interface RadialChartProps<T extends object = ChartDatum> {
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
  legend?: boolean | ChartLegendPosition | (Partial<ChartLegendProps<T>> & { position?: ChartLegendPosition })
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
  class?: any
  /** Per-slot class overrides. */
  ui?: ComponentSlots<RadialChartTheme>
}

export interface RadialChartSlots {
  /** Chart parts: `ChartRadialBar`, `ChartPolarAngleAxis`, `ChartPolarGrid`, `ChartTooltip`, a centered `ChartLabel`. With `index`, extra parts drawn over the generated rings. */
  'default'?: () => any
  /** HTML centered in the rings, e.g. the value of a gauge. */
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
import ChartPolarAngleAxis from '../chart/ChartPolarAngleAxis.vue'
import ChartPolarCenter from '../chart/ChartPolarCenter.vue'
import ChartRadialBar from '../chart/ChartRadialBar.vue'
import ChartSurface from '../chart/ChartSurface.vue'
import ChartTooltip from '../chart/ChartTooltip.vue'
import { useChartRoot } from '../chart/context'
import { provideChartLabelViewBox } from '../chart/label'
import { usePolarChart } from '../chart/polar'
import { chartDefaults, inferValueKeys, isChartGenerated, resolveChartLegend, resolveChartPart, resolveSlices, toggleHiddenKey } from '../chart/series-config'

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

const generated = computed(() => isChartGenerated(props))
const valueKey = computed(() => props.valueKey ?? (props.index === undefined ? undefined : inferValueKeys(props.data, props.index)[0]))
const slices = computed(() => (generated.value && props.index !== undefined
  ? resolveSlices({ data: props.data, index: props.index, valueKey: valueKey.value, colors: props.colors, hidden: hidden.value })
  : undefined))
const visibleSlices = computed(() => slices.value?.filter(slice => !slice.hidden) ?? [])
// Full bar: `max`, or the largest value of every ring (hidden ones too, so toggling a ring keeps the scale).
const domainMax = computed(() => props.max ?? Math.max(0, ...(slices.value ?? []).map(slice => slice.value)))

const startAngle = computed(() => props.startAngle ?? (props.gauge ? chartDefaults.gauge.startAngle : 90))
const endAngle = computed(() => props.endAngle ?? (props.gauge ? chartDefaults.gauge.endAngle : -270))

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

const ui = useComponentUI('radialChart', theme, () => ({}))
const chart = useChartRoot({
  // Generated mode: only the visible rings reach the chart, so the active index points into them.
  data: () => (slices.value ? visibleSlices.value.map(slice => slice.row) : props.data) as ChartDatum[],
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

const centerViewBox = computed(() => ({
  cx: polar.cx.value,
  cy: polar.cy.value,
  innerRadius: 0,
  outerRadius: polar.innerRadius.value,
  startAngle: 0,
  endAngle: 360,
}))
provideChartLabelViewBox(() => (chart.width.value > 0 ? centerViewBox.value : null), 'center')
</script>

<template>
  <ChartSurface
    data-slot="radial-chart"
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
    <template v-if="slices && valueKey">
      <ChartPolarAngleAxis type="number" :domain="[0, domainMax]" :tick="false" :axis-line="false" />
      <ChartRadialBar
        :data-key="valueKey"
        :name-key="props.index"
        :background="props.background ?? chartDefaults.radial.background"
        :corner-radius="props.cornerRadius ?? chartDefaults.radial.cornerRadius"
      >
        <ChartCell v-for="slice in visibleSlices" :key="slice.key" :fill="slice.color" />
      </ChartRadialBar>
    </template>
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
