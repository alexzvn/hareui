<script lang="ts">
import type { ComponentSlots } from '../../types/tv'
import type { CartesianRootProps, CartesianRootSlots } from '../chart/cartesian-root'
import type { ChartComposedSeries } from '../chart/series-config'
import type { ChartRadius } from '../chart/shapes'
import type { ChartCurveType } from '../chart/types'
import theme from './theme'

type ComposedChartTheme = typeof theme

export interface ComposedChartProps<T extends object = Record<string, unknown>> extends CartesianRootProps<T, ChartComposedSeries> {
  /**
   * Stacks every area and bar on one stack; lines never stack. A series' own `stack` wins.
   * @defaultValue false
   */
  stacked?: boolean
  /**
   * Curve of every area and line.
   * @defaultValue 'monotone'
   */
  curve?: ChartCurveType
  /**
   * Stroke width of every area and line, in px.
   * @defaultValue 2, or 1.5 with `sparkline`
   */
  strokeWidth?: number
  /**
   * Corner radius of the bar ends.
   * @defaultValue 4
   */
  radius?: ChartRadius
  /** Per-slot class overrides. */
  ui?: ComponentSlots<ComposedChartTheme>
}

export interface ComposedChartSlots extends CartesianRootSlots {}
</script>

<script setup lang="ts" generic="T extends object">
import type { ChartDatum } from '../chart/types'
import { useSlots } from 'vue'
import { useComponentUI } from '../../composables/useComponentUI'
import { useCartesianChart } from '../chart/cartesian'
import { cartesianRootDefaults, definedProps, rootMargin, useCartesianRoot } from '../chart/cartesian-root'
import ChartCartesianFrame from '../chart/ChartCartesianFrame.vue'
import { useChartRoot } from '../chart/context'

const props = withDefaults(defineProps<ComposedChartProps<T>>(), { ...cartesianRootDefaults, stacked: undefined })
defineSlots<ComposedChartSlots>()
const hidden = defineModel<string[]>('hidden', { default: () => [] })
const slots = useSlots()
// Every slot is forwarded to the frame, which places it.
const slotNames = () => Object.keys(slots) as Array<keyof ComposedChartSlots>

const ui = useComponentUI('composedChart', theme, () => ({}))
const chart = useChartRoot({
  data: () => props.data as ChartDatum[],
  margin: () => rootMargin(props),
  layout: () => 'horizontal',
  ui,
  uiProps: () => props.ui,
})
useCartesianChart(chart, {})
const root = useCartesianRoot<T, ChartComposedSeries>({
  chart,
  props,
  hidden,
  // Each series picks its part with `type`; series inferred from `data` are lines.
  kind: series => series.type ?? 'line',
  stacked: () => props.stacked,
  rootDefaults: () => definedProps({ curve: props.curve, strokeWidth: props.strokeWidth, radius: props.radius }) as Partial<ChartComposedSeries>,
  hasLegendSlot: () => !!slots.legend,
})
</script>

<template>
  <ChartCartesianFrame
    v-model:hidden="hidden"
    data-slot="composed-chart"
    :width="width"
    :height="height"
    :config="root.config.value"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <template v-for="name in slotNames()" #[name]="scope">
      <slot :name="name" v-bind="scope as any" />
    </template>
  </ChartCartesianFrame>
</template>
