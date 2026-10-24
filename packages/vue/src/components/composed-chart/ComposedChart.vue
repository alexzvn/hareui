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
import type { ChartComposedSeries } from '@/components/chart/series-config'
import type { ChartDatum } from '@/components/chart/types'
import { useComponentUI } from '@/composables/useComponentUI'

import type { ComposedChartProps, ComposedChartSlots } from './ComposedChart.types'
import theme from './theme'

const props = withDefaults(defineProps<ComposedChartProps<T>>(), {
  ...cartesianRootDefaults,
  stacked: undefined,
})

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
  kind: (series) => series.type ?? 'line',
  stacked: () => props.stacked,
  rootDefaults: () =>
    definedProps({
      curve: props.curve,
      strokeWidth: props.strokeWidth,
      radius: props.radius,
    }) as Partial<ChartComposedSeries>,
  hasLegendSlot: () => !!slots.legend,
})
</script>
