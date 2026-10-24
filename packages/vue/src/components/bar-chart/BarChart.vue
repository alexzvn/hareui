<template>
  <ChartCartesianFrame
    v-model:hidden="hidden"
    data-slot="bar-chart"
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
import type { ComponentSlots } from '../../types/tv'
import type { CartesianRootProps, CartesianRootSlots } from '../chart/cartesian-root'
import type { ChartBarSeries } from '../chart/series-config'
import type { ChartRadius } from '../chart/shapes'
import theme from './theme'

type BarChartTheme = typeof theme

export interface BarChartProps<
  T extends object = Record<string, unknown>,
> extends CartesianRootProps<T, ChartBarSeries> {
  /**
   * Bar direction. Use `'vertical'` for horizontal bars: the category axis becomes the y-axis.
   * @defaultValue 'horizontal'
   */
  layout?: 'horizontal' | 'vertical'
  /**
   * Gap between neighbouring categories, as a percentage of the band or in pixels.
   * @defaultValue '10%'
   */
  barCategoryGap?: number | string
  /**
   * Gap between bars of the same category, in pixels or as a percentage.
   * @defaultValue 4
   */
  barGap?: number | string
  /** Default bar thickness, in px or percent of the band. A `ChartBar` with its own `barSize` overrides it. */
  barSize?: number | string
  /** Maximum bar thickness, in px. */
  maxBarSize?: number
  /**
   * Stacks every bar on one stack. A series' own `stack` wins.
   * @defaultValue false
   */
  stacked?: boolean
  /**
   * Corner radius of the bar ends: only the outer end of a bar, or of the top bar of a stack, is rounded.
   * @defaultValue 4
   */
  radius?: ChartRadius
  /** Per-slot class overrides. */
  ui?: ComponentSlots<BarChartTheme>
}

export interface BarChartSlots extends CartesianRootSlots {}
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

const props = withDefaults(defineProps<BarChartProps<T>>(), {
  ...cartesianRootDefaults,
  layout: 'horizontal',
  barCategoryGap: '10%',
  barGap: 4,
  stacked: undefined,
})
defineSlots<BarChartSlots>()
const hidden = defineModel<string[]>('hidden', { default: () => [] })
const slots = useSlots()
// Every slot is forwarded to the frame, which places it.
const slotNames = () => Object.keys(slots) as Array<keyof BarChartSlots>

const ui = useComponentUI('barChart', theme, () => ({}))
const chart = useChartRoot({
  data: () => props.data as ChartDatum[],
  margin: () => rootMargin(props),
  layout: () => props.layout,
  cursor: 'band',
  ui,
  uiProps: () => props.ui,
})
useCartesianChart(chart, {
  barCategoryGap: () => props.barCategoryGap,
  barGap: () => props.barGap,
  barSize: () => props.barSize,
  maxBarSize: () => props.maxBarSize,
})
const root = useCartesianRoot<T, ChartBarSeries>({
  chart,
  props,
  hidden,
  kind: () => 'bar',
  stacked: () => props.stacked,
  layout: () => props.layout,
  rootDefaults: () => definedProps({ radius: props.radius }),
  hasLegendSlot: () => !!slots.legend,
})
</script>
