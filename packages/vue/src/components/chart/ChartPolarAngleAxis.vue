<template>
  <ChartLayer v-if="!hide" name="axis">
    <g data-slot="chart-polar-angle-axis" :class="chart.classes('axis', props.class)">
      <template v-if="axisLine">
        <circle
          v-if="axisLineType === 'circle'"
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
          v-if="tickLine"
          data-slot="chart-polar-angle-axis-tick-line"
          v-bind="item.line"
          :class="chart.classes('tickLine')"
        />
        <template v-if="tick">
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

<script lang="ts">
import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

import type { ChartAxisDomain } from './types'

export type ChartPolarAngleAxisProps = {
  /** Key of the category shown around the chart. */
  dataKey?: string
  /**
   * `category` spreads the data evenly around the circle; `number` maps values onto the sweep.
   * Defaults to `category` in radar charts and `number` in radial charts.
   */
  type?: 'category' | 'number'
  /** Number axes: `[min, max]` of the sweep. In radial charts, a fixed max turns bars into progress gauges. */
  domain?: ChartAxisDomain
  /**
   * Number axes: number of ticks.
   * @defaultValue 5
   */
  tickCount?: number
  /**
   * Number axes: allows decimal ticks.
   * @defaultValue true
   */
  allowDecimals?: boolean
  /**
   * Number axes: keeps a fixed `domain` even when data falls outside it.
   * @defaultValue false
   */
  allowDataOverflow?: boolean
  /** Number axes: explicit tick values. */
  ticks?: number[]
  /**
   * Runs the axis in the opposite direction.
   * @defaultValue false
   */
  reversed?: boolean
  /**
   * Shows the tick labels.
   * @defaultValue true
   */
  tick?: boolean
  /** Formats a tick label. */
  tickFormatter?: (value: number | string, index: number) => string
  /**
   * Distance between the outer ring and the labels, in px.
   * @defaultValue 8
   */
  tickSize?: number
  /**
   * Draws the tick marks. They are transparent by default; give `ui.tickLine` a stroke to show them.
   * @defaultValue true
   */
  tickLine?: boolean
  /**
   * Draws the outer ring. It is transparent by default; give `ui.axisLine` a stroke to show it.
   * @defaultValue true
   */
  axisLine?: boolean
  /**
   * Shape of the outer ring.
   * @defaultValue 'polygon'
   */
  axisLineType?: 'polygon' | 'circle'
  /**
   * Places the labels outside or inside the outer ring.
   * @defaultValue 'outer'
   */
  orientation?: 'outer' | 'inner'
  /**
   * Hides the axis. The data still uses it.
   * @defaultValue false
   */
  hide?: boolean
  /** Additional classes merged into the axis group. */
  class?: ClassValue
}

export type ChartPolarAngleAxisSlots = {
  /** Replaces a tick label. Render SVG (`<text>`, `<g>`). */
  tick?: (props: {
    x: number
    y: number
    value: number | string
    index: number
    text: string
    textAnchor: 'start' | 'middle' | 'end'
    dy: string
  }) => VNode[]
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import ChartLayer from './ChartLayer.vue'
import { useChartContext } from './context'
import { angleTickAnchor, polarToCartesian, polygonPath, usePolarContext } from './polar'

const props = withDefaults(defineProps<ChartPolarAngleAxisProps>(), {
  allowDecimals: true,
  allowDataOverflow: false,
  reversed: false,
  tick: true,
  tickSize: 8,
  tickLine: true,
  axisLine: true,
  axisLineType: 'polygon',
  orientation: 'outer',
  hide: false,
})
defineSlots<ChartPolarAngleAxisSlots>()

const chart = useChartContext('ChartPolarAngleAxis')
const polar = usePolarContext('ChartPolarAngleAxis')

polar.registerAngleAxis(() => ({
  dataKey: props.dataKey,
  type: props.type,
  domain: props.domain,
  tickCount: props.tickCount,
  allowDecimals: props.allowDecimals,
  allowDataOverflow: props.allowDataOverflow,
  ticks: props.ticks,
  reversed: props.reversed,
}))

const axisPath = computed(() => {
  const cx = polar.cx.value
  const cy = polar.cy.value
  const radius = polar.outerRadius.value
  if (props.axisLineType === 'circle') return ''
  return polygonPath(
    polar.angleAxis.value.ticks.map((tick) => polarToCartesian(cx, cy, radius, tick.coordinate)),
  )
})

const ticks = computed(() => {
  const cx = polar.cx.value
  const cy = polar.cy.value
  const radius = polar.outerRadius.value
  const sign = props.orientation === 'outer' ? 1 : -1
  return polar.angleAxis.value.ticks.map((tick) => {
    const start = polarToCartesian(cx, cy, radius, tick.coordinate)
    const end = polarToCartesian(cx, cy, radius + sign * props.tickSize, tick.coordinate)
    const value = tick.value
    return {
      key: `${tick.index}-${value}`,
      index: tick.index,
      value,
      text: props.tickFormatter ? props.tickFormatter(value, tick.index) : String(value),
      line: { x1: start.x, y1: start.y, x2: end.x, y2: end.y },
      x: end.x,
      y: end.y,
      ...angleTickAnchor(tick.coordinate, props.orientation),
    }
  })
})
</script>
