<template>
  <ChartLayer v-if="!hide" name="axis">
    <g data-slot="chart-polar-radius-axis" :class="chart.classes('axis', props.class)">
      <line
        v-if="axisLine"
        data-slot="chart-polar-radius-axis-line"
        v-bind="line"
        :class="chart.classes('radiusAxisLine')"
      />
      <template v-if="tick">
        <g
          v-for="item in ticks"
          :key="item.key"
          data-slot="chart-polar-radius-axis-tick"
          :transform="item.transform"
        >
          <slot
            name="tick"
            :x="item.x"
            :y="item.y"
            :value="item.value"
            :index="item.index"
            :text="item.text"
            :text-anchor="textAnchor"
          >
            <text
              :x="item.x"
              :y="item.y"
              :text-anchor="textAnchor"
              :class="chart.classes('radiusTick')"
              >{{ item.text }}</text
            >
          </slot>
        </g>
      </template>
    </g>
  </ChartLayer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import ChartLayer from './ChartLayer.vue'
import type {
  ChartPolarRadiusAxisProps,
  ChartPolarRadiusAxisSlots,
} from './ChartPolarRadiusAxis.types'
import { useChartContext } from './context'
import { polarToCartesian, usePolarContext } from './polar'

const props = withDefaults(defineProps<ChartPolarRadiusAxisProps>(), {
  angle: 0,
  allowDecimals: true,
  allowDataOverflow: false,
  reversed: false,
  tick: true,
  axisLine: true,
  orientation: 'right',
  hide: false,
})

defineSlots<ChartPolarRadiusAxisSlots>()

const chart = useChartContext('ChartPolarRadiusAxis')
const polar = usePolarContext('ChartPolarRadiusAxis')

polar.registerRadiusAxis(() => ({
  dataKey: props.dataKey,
  type: props.type,
  domain: props.domain,
  tickCount: props.tickCount,
  allowDecimals: props.allowDecimals,
  allowDataOverflow: props.allowDataOverflow,
  ticks: props.ticks,
  reversed: props.reversed,
}))

const line = computed(() => {
  const [r0, r1] = polar.radiusAxis.value.range
  const from = polarToCartesian(polar.cx.value, polar.cy.value, r0, props.angle)
  const to = polarToCartesian(polar.cx.value, polar.cy.value, r1, props.angle)

  return { x1: from.x, y1: from.y, x2: to.x, y2: to.y }
})

const textAnchor = computed(() =>
  props.orientation === 'left' ? 'end' : props.orientation === 'right' ? 'start' : 'middle',
)

const ticks = computed(() =>
  polar.radiusAxis.value.ticks.map((tick) => {
    const point = polarToCartesian(polar.cx.value, polar.cy.value, tick.coordinate, props.angle)
    return {
      key: `${tick.index}-${tick.value}`,
      index: tick.index,
      value: tick.value,
      text: props.tickFormatter ? props.tickFormatter(tick.value, tick.index) : String(tick.value),
      x: point.x,
      y: point.y,
      // Labels run along the axis line.
      transform: `rotate(${90 - props.angle}, ${point.x}, ${point.y})`,
    }
  }),
)
</script>
