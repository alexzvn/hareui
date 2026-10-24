<template>
  <ChartLayer name="grid">
    <g
      data-slot="chart-polar-grid"
      :class="chart.classes('polarGrid', props.class)"
      :style="stroke ? { stroke } : undefined"
      :stroke-dasharray="strokeDasharray"
    >
      <template v-for="ring in rings" :key="ring.radius">
        <circle
          v-if="gridType === 'circle'"
          data-slot="chart-polar-grid-ring"
          :cx="polar.cx.value"
          :cy="polar.cy.value"
          :r="ring.radius"
        />
        <path v-else data-slot="chart-polar-grid-ring" :d="ring.d" />
      </template>
      <line
        v-for="(spoke, index) in spokes"
        :key="index"
        data-slot="chart-polar-grid-spoke"
        v-bind="spoke"
      />
    </g>
  </ChartLayer>
</template>

<script lang="ts">
import type { ClassValue } from '@/utils/tv'

export type ChartPolarGridProps = {
  /**
   * Shape of the rings: polygons through the angle axis ticks, or circles.
   * @defaultValue 'polygon'
   */
  gridType?: 'polygon' | 'circle'
  /**
   * Draws the spokes from the center to every angle axis tick.
   * @defaultValue true
   */
  radialLines?: boolean
  /** Angles of the spokes, in degrees. Defaults to the angle axis ticks. */
  polarAngles?: number[]
  /** Radii of the rings, in px. Defaults to the radius axis ticks. */
  polarRadius?: number[]
  /** Line color. Defaults to the theme's muted color. */
  stroke?: string
  /** Dash pattern of the lines, e.g. `'3 3'`. */
  strokeDasharray?: string
  /** Additional classes merged into the grid group. */
  class?: ClassValue
}
</script>

<script setup lang="ts">
import { computed } from 'vue'

import ChartLayer from './ChartLayer.vue'
import { useChartContext } from './context'
import { polarToCartesian, polygonPath, usePolarContext } from './polar'

const props = withDefaults(defineProps<ChartPolarGridProps>(), {
  gridType: 'polygon',
  radialLines: true,
})

const chart = useChartContext('ChartPolarGrid')
const polar = usePolarContext('ChartPolarGrid')

const angles = computed(
  () => props.polarAngles ?? polar.angleAxis.value.ticks.map((tick) => tick.coordinate),
)
const radii = computed(
  () => props.polarRadius ?? polar.radiusAxis.value.ticks.map((tick) => tick.coordinate),
)

const spokes = computed(() => {
  if (!props.radialLines) return []
  const cx = polar.cx.value
  const cy = polar.cy.value
  return angles.value.map((angle) => {
    const from = polarToCartesian(cx, cy, polar.innerRadius.value, angle)
    const to = polarToCartesian(cx, cy, polar.outerRadius.value, angle)
    return { x1: from.x, y1: from.y, x2: to.x, y2: to.y }
  })
})

const rings = computed(() => {
  const cx = polar.cx.value
  const cy = polar.cy.value
  return radii.value.map((radius) =>
    props.gridType === 'circle'
      ? { radius, d: '' }
      : {
          radius,
          d: polygonPath(angles.value.map((angle) => polarToCartesian(cx, cy, radius, angle))),
        },
  )
})
</script>
