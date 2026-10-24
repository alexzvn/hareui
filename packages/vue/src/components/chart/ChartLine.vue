<template>
  <ChartLayer v-if="!series.hidden.value" name="line">
    <g
      data-slot="chart-line"
      :data-key="dataKey"
      :class="chart.classes('series', props.class)"
      :clip-path="clipping ? `url(#${clipId})` : undefined"
    >
      <defs v-if="clipping">
        <clipPath :id="clipId">
          <rect v-bind="clip" />
        </clipPath>
      </defs>
      <path
        ref="pathElement"
        data-slot="chart-line-curve"
        :d="path"
        fill="none"
        :stroke="stroke"
        :stroke-width="strokeWidth"
        :stroke-dasharray="dasharray"
      />
      <g v-if="dots.length" data-slot="chart-dots">
        <circle
          v-for="{ point, attrs } in dots"
          :key="point.index"
          data-slot="chart-dot"
          :cx="point.x"
          :cy="point.y"
          :r="attrs.r"
          :fill="attrs.fill"
          :stroke="attrs.stroke"
          :stroke-width="attrs.strokeWidth"
          :class="chart.classes('dot', attrs.class)"
        />
      </g>
    </g>
  </ChartLayer>
  <ChartLayer v-if="activeDot" name="active-dot">
    <circle
      data-slot="chart-active-dot"
      :cx="activeDot.point.x"
      :cy="activeDot.point.y"
      :r="activeDot.r"
      :fill="activeDot.fill"
      :style="activeDot.style"
      :class="chart.classes('activeDot', activeDot.class)"
    />
  </ChartLayer>
  <slot />
</template>

<script lang="ts">
import type { ChartCurveSeriesProps } from './series'

export type ChartLineProps = ChartCurveSeriesProps

export interface ChartLineSlots {
  /** `ChartLabel` to label every point. */
  default?: () => unknown
}
</script>

<script setup lang="ts">
import { line as d3Line } from 'd3-shape'
import { computed, shallowRef, watch } from 'vue'

import ChartLayer from './ChartLayer.vue'
import { useChartContext } from './context'
import { curveFactory } from './curve'
import type { ChartSeriesPoint } from './series'
import { DEFAULT_SERIES_COLOR, dotAttrs, usePointSeries, useRootSeries } from './series'

const props = withDefaults(defineProps<ChartLineProps>(), {
  type: 'linear',
  strokeWidth: 1,
  dot: true,
  activeDot: true,
  connectNulls: false,
  hide: false,
  isAnimationActive: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  xAxisId: 0,
  yAxisId: 0,
})
defineSlots<ChartLineSlots>()

const rootSeries = useRootSeries(useChartContext('ChartLine'), () => props.dataKey)
const stroke = computed(() => props.stroke ?? rootSeries.value?.color ?? DEFAULT_SERIES_COLOR)

const series = usePointSeries('line', props, () => ({ stroke: stroke.value }))
const { chart, cartesian, horizontal } = series
const clipId = `${series.id}-clip`

const path = computed(() => {
  const points = series.points.value
  const segments = props.connectNulls
    ? points.filter((point): point is ChartSeriesPoint => point !== null)
    : points
  return (
    d3Line<ChartSeriesPoint | null>()
      .x((point) => point!.x)
      .y((point) => point!.y)
      .defined((point) => point !== null)
      .curve(curveFactory(props.type, chart.layout.value))(segments) ?? ''
  )
})

// Mount animation: solid lines draw along their length; dashed lines are revealed with a clip.
const pathElement = shallowRef<SVGPathElement | null>(null)
const length = shallowRef(0)
const revealing = computed(() => series.reveal.value < 1)
// Measure only when the path mounts, the reveal starts/ends, or the geometry changes mid-reveal (e.g. a resize);
// `getTotalLength` forces layout, so it must not run every animation frame.
watch(
  [pathElement, revealing, () => (revealing.value ? path.value : null)],
  () => {
    const element = pathElement.value
    length.value =
      element && typeof element.getTotalLength === 'function' ? element.getTotalLength() : 0
  },
  { flush: 'post' },
)

const drawing = computed(
  () => series.reveal.value < 1 && !props.strokeDasharray && length.value > 0,
)
const clipping = computed(() => series.reveal.value < 1 && !drawing.value)

const dasharray = computed(() => {
  if (drawing.value) return `${length.value * series.reveal.value}px ${length.value}px`
  return props.strokeDasharray
})

const clip = computed(() => {
  const plot = cartesian.offset.value
  const reveal = series.reveal.value
  return horizontal.value
    ? { x: plot.left, y: 0, width: plot.width * reveal, height: chart.height.value }
    : { x: 0, y: plot.top, width: chart.width.value, height: plot.height * reveal }
})

const dots = computed(() => {
  const attrs = dotAttrs(props.dot, {
    r: 3,
    fill: 'var(--surface)',
    stroke: stroke.value,
    strokeWidth: 1,
  })
  if (!attrs || series.animating.value) return []
  return series.points.value.flatMap((point) => (point ? [{ point, attrs }] : []))
})

// Outline color and width come from the theme (`activeDot` slot); explicit `activeDot` props override them.
const activeDot = computed(() => {
  const point = series.activePoint.value
  if (!point || !props.activeDot) return null
  const custom = props.activeDot === true ? {} : props.activeDot
  return {
    point,
    r: custom.r ?? 4,
    fill: custom.fill ?? stroke.value,
    style: { stroke: custom.stroke, strokeWidth: custom.strokeWidth },
    class: custom.class,
  }
})
</script>
