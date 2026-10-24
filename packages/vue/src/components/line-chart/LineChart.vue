<template>
  <ChartCartesianFrame
    v-model:hidden="hidden"
    data-slot="line-chart"
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

<script lang="ts">
import type { CartesianRootProps, CartesianRootSlots } from '@/components/chart/cartesian-root'
import type { ChartLineSeries } from '@/components/chart/series-config'
import type { ChartCurveType } from '@/components/chart/types'
import type { ComponentSlots } from '@/types/tv'

import theme from './theme'

type LineChartTheme = typeof theme

export interface LineChartProps<
  T extends object = Record<string, unknown>,
> extends CartesianRootProps<T, ChartLineSeries> {
  /**
   * Curve of every series.
   * @defaultValue 'monotone'
   */
  curve?: ChartCurveType
  /**
   * Stroke width of every series, in px.
   * @defaultValue 2, or 1.5 with `sparkline`
   */
  strokeWidth?: number
  /**
   * Dot at every data point.
   * @defaultValue false
   */
  dot?: ChartLineSeries['dot']
  /**
   * Draws across missing values instead of leaving a gap.
   * @defaultValue false
   */
  connectNulls?: boolean
  /** Per-slot class overrides. */
  ui?: ComponentSlots<LineChartTheme>
}

export interface LineChartSlots extends CartesianRootSlots {}
</script>

<script setup lang="ts" generic="T extends object">
import { useSlots } from 'vue'

import { useCartesianChart } from '@/components/chart/cartesian'
import {
  cartesianRootDefaults,
  definedProps,
  rootMargin,
  useCartesianRoot,
} from '@/components/chart/cartesian-root'
import ChartCartesianFrame from '@/components/chart/ChartCartesianFrame.vue'
import { useChartRoot } from '@/components/chart/context'
import type { ChartDatum } from '@/components/chart/types'
import { useComponentUI } from '@/composables/useComponentUI'

const props = withDefaults(defineProps<LineChartProps<T>>(), {
  ...cartesianRootDefaults,
  dot: undefined,
  connectNulls: undefined,
})
defineSlots<LineChartSlots>()
const hidden = defineModel<string[]>('hidden', { default: () => [] })
const slots = useSlots()
// Every slot is forwarded to the frame, which places it.
const slotNames = () => Object.keys(slots) as Array<keyof LineChartSlots>

const ui = useComponentUI('lineChart', theme, () => ({}))
const chart = useChartRoot({
  data: () => props.data as ChartDatum[],
  margin: () => rootMargin(props),
  layout: () => 'horizontal',
  ui,
  uiProps: () => props.ui,
})
useCartesianChart(chart, {})
const root = useCartesianRoot<T, ChartLineSeries>({
  chart,
  props,
  hidden,
  kind: () => 'line',
  rootDefaults: () =>
    definedProps({
      curve: props.curve,
      strokeWidth: props.strokeWidth,
      dot: props.dot,
      connectNulls: props.connectNulls,
    }),
  hasLegendSlot: () => !!slots.legend,
})
</script>
