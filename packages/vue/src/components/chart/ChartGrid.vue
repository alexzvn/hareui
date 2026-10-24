<template>
  <ChartLayer name="grid">
    <g data-slot="chart-grid" :class="chart.classes('grid', props.class)">
      <line
        v-for="(line, index) in horizontalLines"
        :key="`h-${index}`"
        data-slot="chart-grid-line"
        data-direction="horizontal"
        v-bind="line"
        fill="none"
        :stroke-dasharray="strokeDasharray"
      />
      <line
        v-for="(line, index) in verticalLines"
        :key="`v-${index}`"
        data-slot="chart-grid-line"
        data-direction="vertical"
        v-bind="line"
        fill="none"
        :stroke-dasharray="strokeDasharray"
      />
    </g>
  </ChartLayer>
</template>

<script lang="ts">
import type { ClassValue } from 'tailwind-variants'

export type ChartGridProps = {
  /**
   * Draws horizontal lines at the y axis ticks.
   * @defaultValue true
   */
  horizontal?: boolean
  /**
   * Draws vertical lines at the x axis ticks.
   * @defaultValue true
   */
  vertical?: boolean
  /** Dash pattern of the lines, e.g. `'3 3'`. */
  strokeDasharray?: string
  /** Exact y positions (px) of the horizontal lines, instead of the y axis ticks. */
  horizontalPoints?: number[]
  /** Exact x positions (px) of the vertical lines, instead of the x axis ticks. */
  verticalPoints?: number[]
  /**
   * Draws lines only at the axis ticks. Off, lines are also drawn along the plot edges.
   * @defaultValue false
   */
  syncWithTicks?: boolean
  /**
   * X axis whose ticks place the vertical lines.
   * @defaultValue 0
   */
  xAxisId?: string | number
  /**
   * Y axis whose ticks place the horizontal lines.
   * @defaultValue 0
   */
  yAxisId?: string | number
  /** Additional classes merged into the grid group. */
  class?: ClassValue
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import { useCartesianContext } from './cartesian'
import ChartLayer from './ChartLayer.vue'
import { useChartContext } from './context'

const props = withDefaults(defineProps<ChartGridProps>(), {
  horizontal: true,
  vertical: true,
  xAxisId: 0,
  yAxisId: 0,
})

const chart = useChartContext('ChartGrid')
const cartesian = useCartesianContext('ChartGrid')

// Tick positions of the axis with this exact id; an unknown id gives none, leaving only the edge lines.
const tickCoordinates = (axis: 'x' | 'y', id: string | number) => {
  const resolved = cartesian.axes.value.find(
    (entry) => entry.axis === axis && String(entry.id ?? 0) === String(id),
  )
  return resolved?.allTicks.map((tick) => tick.coordinate) ?? []
}

const withEdges = (coordinates: number[], start: number, end: number) => {
  if (props.syncWithTicks) return coordinates
  return [...coordinates, ...[start, end].filter((edge) => !coordinates.includes(edge))]
}

const horizontalLines = computed(() => {
  if (!props.horizontal) return []
  const plot = cartesian.offset.value
  const points =
    props.horizontalPoints ??
    withEdges(tickCoordinates('y', props.yAxisId), plot.top, plot.top + plot.height)
  return points.map((y) => ({ x1: plot.left, x2: plot.left + plot.width, y1: y, y2: y }))
})

const verticalLines = computed(() => {
  if (!props.vertical) return []
  const plot = cartesian.offset.value
  const points =
    props.verticalPoints ??
    withEdges(tickCoordinates('x', props.xAxisId), plot.left, plot.left + plot.width)
  return points.map((x) => ({ x1: x, x2: x, y1: plot.top, y2: plot.top + plot.height }))
})
</script>
