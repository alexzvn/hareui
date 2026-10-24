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
import type { ChartBarSeries } from '@/components/chart/series-config'
import type { ChartDatum } from '@/components/chart/types'
import { useComponentUI } from '@/composables/useComponentUI'

import type { BarChartProps, BarChartSlots } from './BarChart.types'
import theme from './theme'

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
