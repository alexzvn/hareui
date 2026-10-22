<script lang="ts">
import type { ClassValue } from 'tailwind-variants'
import type { ChartAxisDomain } from './types'

export interface ChartPolarRadiusAxisProps {
  /**
   * Direction of the axis line, in degrees. 0 is at 3 o'clock; 90 points up.
   * @defaultValue 0
   */
  angle?: number
  /** Radial charts: key of the ring names. */
  dataKey?: string
  /**
   * `number` maps values from the center outwards; `category` gives each row a ring.
   * Defaults to `number` in radar charts and `category` in radial charts.
   */
  type?: 'category' | 'number'
  /** Number axes: `[min, max]` from the center to the outer ring. */
  domain?: ChartAxisDomain
  /**
   * Number axes: number of ticks (and grid rings).
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
   * Runs the axis from the outer ring to the center.
   * @defaultValue false
   */
  reversed?: boolean
  /**
   * Shows the tick labels.
   * @defaultValue true
   */
  tick?: boolean
  /** Formats a tick label. */
  tickFormatter?: (value: any, index: number) => string
  /**
   * Draws the axis line.
   * @defaultValue true
   */
  axisLine?: boolean
  /**
   * Side of the axis line the labels sit on.
   * @defaultValue 'right'
   */
  orientation?: 'left' | 'right' | 'middle'
  /**
   * Hides the axis. The data still uses it.
   * @defaultValue false
   */
  hide?: boolean
  /** Additional classes merged into the axis group. */
  class?: ClassValue
}

export interface ChartPolarRadiusAxisSlots {
  /** Replaces a tick label. Render SVG (`<text>`, `<g>`). */
  tick?: (props: { x: number, y: number, value: number | string, index: number, text: string, textAnchor: 'start' | 'middle' | 'end' }) => any
}
</script>

<script setup lang="ts">
import { computed } from 'vue'
import ChartLayer from './ChartLayer.vue'
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

const textAnchor = computed(() => (props.orientation === 'left' ? 'end' : props.orientation === 'right' ? 'start' : 'middle'))

const ticks = computed(() => polar.radiusAxis.value.ticks.map((tick) => {
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
}))
</script>

<template>
  <ChartLayer v-if="!hide" name="axis">
    <g data-slot="chart-polar-radius-axis" :class="chart.classes('axis', props.class)">
      <line v-if="axisLine" data-slot="chart-polar-radius-axis-line" v-bind="line" :class="chart.classes('radiusAxisLine')" />
      <template v-if="tick">
        <g v-for="item in ticks" :key="item.key" data-slot="chart-polar-radius-axis-tick" :transform="item.transform">
          <slot name="tick" :x="item.x" :y="item.y" :value="item.value" :index="item.index" :text="item.text" :text-anchor="textAnchor">
            <text :x="item.x" :y="item.y" :text-anchor="textAnchor" :class="chart.classes('radiusTick')">{{ item.text }}</text>
          </slot>
        </g>
      </template>
    </g>
  </ChartLayer>
</template>
