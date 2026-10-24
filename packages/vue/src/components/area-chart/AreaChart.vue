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
import type { ChartAreaSeries } from '@/components/chart/series-config'
import type { ChartDatum } from '@/components/chart/types'
import { useComponentUI } from '@/composables/useComponentUI'

import type { AreaChartProps, AreaChartSlots } from './AreaChart.types'
import theme from './theme'

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

const ui = useComponentUI('areaChart', { theme: theme, variantProps: () => ({}) })
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
