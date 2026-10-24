<template>
  <ChartLayer v-if="!series.hidden.value" name="area">
    <g
      data-slot="chart-area"
      :data-key="dataKey"
      :class="chart.classes('series', props.class)"
      :clip-path="series.reveal.value < 1 ? `url(#${clipId})` : undefined"
    >
      <defs v-if="series.reveal.value < 1 || areaFill.gradient">
        <clipPath v-if="series.reveal.value < 1" :id="clipId">
          <rect v-bind="clip" />
        </clipPath>
        <linearGradient
          v-if="areaFill.gradient"
          :id="areaFill.gradient.id"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            :stop-color="areaFill.gradient.color"
            :stop-opacity="areaFill.gradient.from"
          />
          <stop
            offset="100%"
            :stop-color="areaFill.gradient.color"
            :stop-opacity="areaFill.gradient.to"
          />
        </linearGradient>
      </defs>
      <path
        data-slot="chart-area-fill"
        :d="areaPath"
        :fill="areaFill.fill"
        :fill-opacity="areaFill.fillOpacity"
        stroke="none"
      />
      <path
        v-if="stroke !== 'none'"
        data-slot="chart-area-curve"
        :d="curvePath"
        fill="none"
        :stroke="stroke"
        :stroke-width="strokeWidth"
        :stroke-dasharray="strokeDasharray"
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

<script setup lang="ts">
import { area as d3Area, line as d3Line } from 'd3-shape'
import { computed } from 'vue'

import type { ChartAreaProps, ChartAreaSlots } from './ChartArea.types'
import ChartLayer from './ChartLayer.vue'
import { useChartContext } from './context'
import { curveFactory } from './curve'
import type { ChartSeriesPoint } from './series'
import { DEFAULT_SERIES_COLOR, dotAttrs, usePointSeries, useRootSeries } from './series'
import { chartDefaults, resolveAreaFill } from './series-config'

const props = withDefaults(defineProps<ChartAreaProps>(), {
  type: 'linear',
  strokeWidth: 1,
  dot: false,
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

defineSlots<ChartAreaSlots>()

const rootSeries = useRootSeries(useChartContext('ChartArea'), () => props.dataKey)
const stroke = computed(() => props.stroke ?? rootSeries.value?.color ?? DEFAULT_SERIES_COLOR)
const color = computed(() =>
  stroke.value === 'none' ? (rootSeries.value?.color ?? DEFAULT_SERIES_COLOR) : stroke.value,
)

const areaFill = computed(() => {
  if (props.fill === 'gradient') {
    const fillOpacity = props.fillOpacity ?? chartDefaults.area.fillOpacity
    return resolveAreaFill(
      { key: props.dataKey, color: color.value, fill: 'gradient', fillOpacity },
      series.chart.id,
    )
  }

  const opacity = props.fillOpacity ?? 0.6

  return {
    fill: props.fill ?? color.value,
    fillOpacity: typeof opacity === 'number' ? opacity : opacity[0],
    gradient: undefined,
  }
})

// The tooltip and active dot use the series color, not a gradient url.
const fill = computed(() => (props.fill === 'gradient' ? color.value : areaFill.value.fill))

const series = usePointSeries({
  kind: 'area',
  props,
  colors: () => ({ stroke: stroke.value, fill: fill.value }),
})

const { chart, cartesian, horizontal } = series
const clipId = `${series.id}-clip`

const segments = computed(() => {
  const points = series.points.value
  return props.connectNulls
    ? points.filter((point): point is ChartSeriesPoint => point !== null)
    : points
})

const areaPath = computed(() => {
  const curve = curveFactory(props.type, chart.layout.value)

  const generator = horizontal.value
    ? d3Area<ChartSeriesPoint | null>()
        .x((point) => point!.x)
        .y0((point) => point!.baseY)
        .y1((point) => point!.y)
    : d3Area<ChartSeriesPoint | null>()
        .y((point) => point!.y)
        .x0((point) => point!.baseX)
        .x1((point) => point!.x)

  return generator.defined((point) => point !== null).curve(curve)(segments.value) ?? ''
})

const curvePath = computed(() => {
  const curve = curveFactory(props.type, chart.layout.value)
  return (
    d3Line<ChartSeriesPoint | null>()
      .x((point) => point!.x)
      .y((point) => point!.y)
      .defined((point) => point !== null)
      .curve(curve)(segments.value) ?? ''
  )
})

// Mount animation: the series is revealed along the category axis.
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

  if (!attrs || series.isAnimating.value) return []

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
    fill: custom.fill ?? (stroke.value === 'none' ? fill.value : stroke.value),
    style: { stroke: custom.stroke, strokeWidth: custom.strokeWidth },
    class: custom.class,
  }
})
</script>
