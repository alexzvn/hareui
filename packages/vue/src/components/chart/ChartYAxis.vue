<template>
  <ChartCartesianAxis :axis="axis" :tick="tickOptions" :axis-line="axisLine" :class="props.class">
    <template v-if="$slots.tick" #tick="slotProps">
      <slot name="tick" v-bind="slotProps" />
    </template>
  </ChartCartesianAxis>
</template>

<script setup lang="ts">
import { defu } from 'defu'
import { computed } from 'vue'

import { CHART_AXIS_TICK_DEFAULTS } from './axis'
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
  axisLine: true,
  allowDecimals: true,
  allowDataOverflow: false,
  reversed: false,
  minTickGap: 5,
  interval: 'preserveEnd',
})

defineSlots<ChartYAxisSlots>()

const tickOptions = computed(() => defu(props.tick, CHART_AXIS_TICK_DEFAULTS))

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
  tick: {
    count: tickOptions.value.count,
    formatter: tickOptions.value.formatter,
    space: tickOptions.value.size + tickOptions.value.margin,
  },
  allowDecimals: props.allowDecimals,
  allowDataOverflow: props.allowDataOverflow,
  hide: props.hide,
  size: props.width,
  orientation: props.orientation,
  padding: [props.padding?.top ?? 0, props.padding?.bottom ?? 0],
  reversed: props.reversed,
  interval: props.interval,
  minTickGap: props.minTickGap,
  unit: props.unit,
}))

const axis = computed(() => cartesian.yAxis(props.yAxisId))
</script>
