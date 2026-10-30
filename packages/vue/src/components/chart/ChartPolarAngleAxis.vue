<template>
  <ChartLayer v-if="!hide" name="axis">
    <g data-slot="chart-polar-angle-axis" :class="chart.classes('axis', props.class)">
      <template v-if="axisLineOptions.show">
        <circle
          v-if="axisLineOptions.type === 'circle'"
          data-slot="chart-polar-angle-axis-line"
          :cx="polar.cx.value"
          :cy="polar.cy.value"
          :r="polar.outerRadius.value"
          fill="none"
          :class="chart.classes('axisLine')"
        />
        <path
          v-else
          data-slot="chart-polar-angle-axis-line"
          :d="axisPath"
          fill="none"
          :class="chart.classes('axisLine')"
        />
      </template>
      <g v-for="item in ticks" :key="item.key" data-slot="chart-polar-angle-axis-tick">
        <line
          v-if="tickOptions.line"
          data-slot="chart-polar-angle-axis-tick-line"
          v-bind="item.line"
          :class="chart.classes('tickLine')"
        />
        <template v-if="tickOptions.label">
          <slot
            name="tick"
            :x="item.x"
            :y="item.y"
            :value="item.value"
            :index="item.index"
            :text="item.text"
            :text-anchor="item.textAnchor"
            :dy="item.dy"
          >
            <text
              :x="item.x"
              :y="item.y"
              :dy="item.dy"
              :text-anchor="item.textAnchor"
              :class="chart.classes('angleTick')"
              >{{ item.text }}</text
            >
          </slot>
        </template>
      </g>
    </g>
  </ChartLayer>
</template>

<script setup lang="ts">
import { defu } from 'defu'
import { computed } from 'vue'

import ChartLayer from './ChartLayer.vue'
import type {
  ChartPolarAngleAxisLineOptions,
  ChartPolarAngleAxisProps,
  ChartPolarAngleAxisSlots,
  ChartPolarAngleAxisTickOptions,
} from './ChartPolarAngleAxis.types'
import { useChartContext } from './context'
import { polarToCartesian } from './label'
import { angleTickAnchor } from './polar-axis'
import { usePolarContext } from './polar-context'
import { polygonPath } from './polar-paths'

const props = withDefaults(defineProps<ChartPolarAngleAxisProps>(), {
  allowDecimals: true,
  allowDataOverflow: false,
  reversed: false,
  orientation: 'outer',
  hide: false,
})

defineSlots<ChartPolarAngleAxisSlots>()

const TICK_DEFAULTS: Readonly<Required<Omit<ChartPolarAngleAxisTickOptions, 'formatter'>>> = {
  label: true,
  count: 5,
  size: 8,
  line: true,
}

const AXIS_LINE_DEFAULTS: Readonly<Required<ChartPolarAngleAxisLineOptions>> = {
  show: true,
  type: 'polygon',
}

const tickOptions = computed(() => defu(props.tick, TICK_DEFAULTS))
const axisLineOptions = computed(() => defu(props.axisLine, AXIS_LINE_DEFAULTS))

const chart = useChartContext('ChartPolarAngleAxis')
const polar = usePolarContext('ChartPolarAngleAxis')

polar.registerAngleAxis(() => ({
  dataKey: props.dataKey,
  type: props.type,
  domain: props.domain,
  tickCount: tickOptions.value.count,
  allowDecimals: props.allowDecimals,
  allowDataOverflow: props.allowDataOverflow,
  ticks: props.ticks,
  reversed: props.reversed,
}))

const axisPath = computed(() => {
  const center = { cx: polar.cx.value, cy: polar.cy.value }
  const radius = polar.outerRadius.value
  if (axisLineOptions.value.type === 'circle') return ''

  return polygonPath(
    polar.angleAxis.value.ticks.map((tick) =>
      polarToCartesian(center, { radius, angle: tick.coordinate }),
    ),
  )
})

const ticks = computed(() => {
  const center = { cx: polar.cx.value, cy: polar.cy.value }
  const radius = polar.outerRadius.value
  const sign = props.orientation === 'outer' ? 1 : -1
  const { size, formatter } = tickOptions.value

  return polar.angleAxis.value.ticks.map((tick) => {
    const start = polarToCartesian(center, { radius, angle: tick.coordinate })

    const end = polarToCartesian(center, {
      radius: radius + sign * size,
      angle: tick.coordinate,
    })

    const value = tick.value

    return {
      key: `${tick.index}-${value}`,
      index: tick.index,
      value,
      text: formatter ? formatter(value, tick.index) : String(value),
      line: { x1: start.x, y1: start.y, x2: end.x, y2: end.y },
      x: end.x,
      y: end.y,
      ...angleTickAnchor(tick.coordinate, props.orientation),
    }
  })
})
</script>
