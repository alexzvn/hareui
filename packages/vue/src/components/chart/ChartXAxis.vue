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

<script lang="ts">
import type { ChartAxisProps, ChartAxisSlots } from './axis'

export type ChartXAxisProps = {
  /**
   * Id that series reference with `xAxisId` when a chart has several x axes.
   * @defaultValue 0
   */
  xAxisId?: string | number
  /**
   * Side of the plot the axis sits on.
   * @defaultValue 'bottom'
   */
  orientation?: 'top' | 'bottom'
  /**
   * Height reserved for the axis, in px.
   * @defaultValue 30
   */
  height?: number
  /** Space before the first and after the last category, in px. */
  padding?: { left?: number; right?: number }
} & ChartAxisProps

export type ChartXAxisSlots = ChartAxisSlots
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { useCartesianContext } from './cartesian'
import ChartCartesianAxis from './ChartCartesianAxis.vue'
import { useChartConfig, useChartContext } from './context'

const props = withDefaults(defineProps<ChartXAxisProps>(), {
  xAxisId: 0,
  orientation: 'bottom',
  height: 30,
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

defineSlots<ChartXAxisSlots>()

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
  tickCount: props.tickCount,
  allowDecimals: props.allowDecimals,
  allowDataOverflow: props.allowDataOverflow,
  hide: props.hide,
  size: props.height,
  orientation: props.orientation,
  padding: [props.padding?.left ?? 0, props.padding?.right ?? 0],
  reversed: props.reversed,
  interval: props.interval,
  minTickGap: props.minTickGap,
  tickFormatter: props.tickFormatter,
  unit: props.unit,
}))

const axis = computed(() => cartesian.xAxis(props.xAxisId))
</script>
