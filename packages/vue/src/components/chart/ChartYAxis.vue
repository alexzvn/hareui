<template>
  <ChartCartesianAxis
    :axis="axis"
    :tick-size="tickSize"
    :tick-margin="tickMargin"
    :tick="tick"
    :tick-line="tickLine"
    :axis-line="axisLine"
    :class="props.class"
  >
    <template v-if="$slots.tick" #tick="slotProps">
      <slot name="tick" v-bind="slotProps" />
    </template>
  </ChartCartesianAxis>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useCartesianContext } from './cartesian'
import ChartCartesianAxis from './ChartCartesianAxis.vue'
import type { ChartYAxisProps, ChartYAxisSlots } from './ChartYAxis.types'
import { useChartConfig, useChartContext } from './context'

const props = withDefaults(defineProps<ChartYAxisProps>(), {
  yAxisId: 0,
  orientation: 'left',
  width: 60,
  type: 'number',
  hide: false,
  tick: true,
  tickMargin: 2,
  tickSize: 6,
  tickLine: true,
  axisLine: true,
  allowDecimals: true,
  allowDataOverflow: false,
  reversed: false,
  tickCount: 5,
  minTickGap: 5,
  interval: 'preserveEnd',
})

defineSlots<ChartYAxisSlots>()

const cartesian = useCartesianContext('ChartYAxis')
const config = useChartConfig(useChartContext('ChartYAxis'))
cartesian.registerAxis(() => ({
  axis: 'y',
  id: props.yAxisId,
  type: props.type,
  // A category axis (bar charts with `layout="vertical"`) defaults to the root's `index`.
  dataKey: props.dataKey ?? (props.type === 'category' ? config.index() : undefined),
  domain: props.domain,
  ticks: props.ticks,
  tickCount: props.tickCount,
  allowDecimals: props.allowDecimals,
  allowDataOverflow: props.allowDataOverflow,
  hide: props.hide,
  size: props.width,
  tickSpace: props.tickSize + props.tickMargin,
  orientation: props.orientation,
  padding: [props.padding?.top ?? 0, props.padding?.bottom ?? 0],
  reversed: props.reversed,
  interval: props.interval,
  minTickGap: props.minTickGap,
  tickFormatter: props.tickFormatter,
  unit: props.unit,
}))

const axis = computed(() => cartesian.yAxis(props.yAxisId))
</script>
