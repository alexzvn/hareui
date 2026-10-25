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
import type { ChartXAxisProps, ChartXAxisSlots } from './ChartXAxis.types'
import { useChartConfig, useChartContext } from './context'

const props = withDefaults(defineProps<ChartXAxisProps>(), {
  xAxisId: 0,
  orientation: 'bottom',
  height: 30,
  hide: false,
  axisLine: true,
  allowDecimals: true,
  allowDataOverflow: false,
  reversed: false,
  minTickGap: 5,
  interval: 'preserveEnd',
})

defineSlots<ChartXAxisSlots>()

const tickOptions = computed(() => defu(props.tick, CHART_AXIS_TICK_DEFAULTS))

const cartesian = useCartesianContext('ChartXAxis')
const config = useChartConfig(useChartContext('ChartXAxis'))
cartesian.registerAxis(() => ({
  axis: 'x',
  id: props.xAxisId,
  type: props.type,
  // A category axis defaults to the root's `index`.
  dataKey: props.dataKey ?? (props.type === 'number' ? undefined : config.index()),
  domain: props.domain,
  ticks: props.ticks,
  tick: { count: tickOptions.value.count, formatter: tickOptions.value.formatter },
  allowDecimals: props.allowDecimals,
  allowDataOverflow: props.allowDataOverflow,
  hide: props.hide,
  size: props.height,
  orientation: props.orientation,
  padding: [props.padding?.left ?? 0, props.padding?.right ?? 0],
  reversed: props.reversed,
  interval: props.interval,
  minTickGap: props.minTickGap,
  unit: props.unit,
}))

const axis = computed(() => cartesian.xAxis(props.xAxisId))
</script>
