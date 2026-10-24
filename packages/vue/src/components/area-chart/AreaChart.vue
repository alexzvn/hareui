<script lang="ts">
import type { ComponentSlots } from '../../types/tv'
import type { CartesianRootProps, CartesianRootSlots } from '../chart/cartesian-root'
import type { ChartAreaSeries } from '../chart/series-config'
import type { ChartCurveType } from '../chart/types'
import theme from './theme'

type AreaChartTheme = typeof theme

export interface AreaChartProps<
  T extends object = Record<string, unknown>,
> extends CartesianRootProps<T, ChartAreaSeries> {
  /**
   * Stacks every area on one stack. A series' own `stack` wins.
   * @defaultValue false
   */
  stacked?: boolean
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
   * Fill of every area: `'gradient'` fades the series color downwards, `'solid'` fills it flat, `'none'` draws only
   * the line, any other value is used as the fill (e.g. `url(#my-gradient)`).
   * @defaultValue 'gradient'
   */
  fill?: ChartAreaSeries['fill']
  /**
   * Fill opacity, or `[top, bottom]` opacities of the gradient.
   * @defaultValue [0.2, 0.02]
   */
  fillOpacity?: ChartAreaSeries['fillOpacity']
  /**
   * Dot at every data point.
   * @defaultValue false
   */
  dot?: ChartAreaSeries['dot']
  /**
   * Draws across missing values instead of leaving a gap.
   * @defaultValue false
   */
  connectNulls?: boolean
  /** Per-slot class overrides. */
  ui?: ComponentSlots<AreaChartTheme>
}

export interface AreaChartSlots extends CartesianRootSlots {}
</script>

<script setup lang="ts" generic="T extends object">
import { useSlots } from 'vue'

import { useComponentUI } from '../../composables/useComponentUI'
import { useCartesianChart } from '../chart/cartesian'
import {
  cartesianRootDefaults,
  definedProps,
  rootMargin,
  useCartesianRoot,
} from '../chart/cartesian-root'
import ChartCartesianFrame from '../chart/ChartCartesianFrame.vue'
import { useChartRoot } from '../chart/context'
import type { ChartDatum } from '../chart/types'

const props = withDefaults(defineProps<AreaChartProps<T>>(), {
  ...cartesianRootDefaults,
  stacked: undefined,
  dot: undefined,
  connectNulls: undefined,
})
defineSlots<AreaChartSlots>()
const hidden = defineModel<string[]>('hidden', { default: () => [] })
const slots = useSlots()
// Every slot is forwarded to the frame, which places it.
const slotNames = () => Object.keys(slots) as Array<keyof AreaChartSlots>

const ui = useComponentUI('areaChart', theme, () => ({}))
const chart = useChartRoot({
  data: () => props.data as ChartDatum[],
  margin: () => rootMargin(props),
  layout: () => 'horizontal',
  ui,
  uiProps: () => props.ui,
})
useCartesianChart(chart, {})
const root = useCartesianRoot<T, ChartAreaSeries>({
  chart,
  props,
  hidden,
  kind: () => 'area',
  stacked: () => props.stacked,
  rootDefaults: () =>
    definedProps({
      curve: props.curve,
      strokeWidth: props.strokeWidth,
      fill: props.fill,
      fillOpacity: props.fillOpacity,
      dot: props.dot,
      connectNulls: props.connectNulls,
    }),
  hasLegendSlot: () => !!slots.legend,
})
</script>

<template>
  <ChartCartesianFrame
    v-model:hidden="hidden"
    data-slot="area-chart"
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
