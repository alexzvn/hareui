<template>
  <ChartLayer name="series">
    <g v-if="!hide" data-slot="chart-radar" :class="chart.classes('series', props.class)">
      <path
        data-slot="chart-radar-polygon"
        :d="path"
        :fill="fillColor"
        :fill-opacity="fillOpacity"
        :stroke="strokeColor"
        :stroke-width="strokeWidth"
        :stroke-dasharray="strokeDasharray"
        :class="chart.classes('radar')"
      />
      <g v-if="dotStyle" data-slot="chart-radar-dots">
        <circle
          v-for="point in tween.value.value"
          :key="point.index"
          data-slot="chart-dot"
          :cx="point.x"
          :cy="point.y"
          :r="dotStyle.r"
          :fill="dotStyle.fill"
          :fill-opacity="fillOpacity"
          :stroke="dotStyle.stroke"
          :stroke-width="dotStyle.strokeWidth"
          :class="chart.classes('dot', dotStyle.class)"
        />
      </g>
    </g>
  </ChartLayer>
  <ChartLayer v-if="activePoint && activeDotStyle" name="active-dot">
    <circle
      data-slot="chart-active-dot"
      :cx="activePoint.x"
      :cy="activePoint.y"
      :r="activeDotStyle.r"
      :fill="activeDotStyle.fill"
      :stroke="activeDotStyle.stroke"
      :stroke-width="activeDotStyle.strokeWidth"
      :class="chart.classes('activeDot', activeDotStyle.class)"
    />
  </ChartLayer>
  <slot />
</template>

<script setup lang="ts">
import { useId } from 'reka-ui'
import { computed } from 'vue'

import { lerp, useChartTween } from './animation'
import ChartLayer from './ChartLayer.vue'
import type { ChartRadarProps, ChartRadarSlots } from './ChartRadar.types'
import { useChartContext } from './context'
import type { ChartLabelItem } from './label'
import { provideChartLabels } from './label'
import { polarToCartesian } from './label'
import { usePolarContext } from './polar-context'
import { polygonPath } from './polar-paths'
import { dotAttrs, seriesColor } from './series'
import type { ChartPoint, ChartSeries } from './types'

type RadarPoint = {
  index: number
  angle: number
  radius: number
  value: number | string | undefined
} & ChartPoint

const props = withDefaults(defineProps<ChartRadarProps>(), {
  dot: false,
  activeDot: true,
  strokeWidth: 1,
  hide: false,
  isAnimationActive: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
})

defineSlots<ChartRadarSlots>()

const chart = useChartContext('ChartRadar')
const polar = usePolarContext('ChartRadar')
const id = useId(undefined, 'hareui-chart-radar')

const color = computed(() => seriesColor(props.stroke, props.fill))
const fillColor = computed(() => props.fill ?? color.value)
const strokeColor = computed(() => props.stroke ?? color.value)

chart.registerSeries((): ChartSeries => ({
  id,
  kind: 'radar',
  dataKey: props.dataKey,
  name: props.name,
  color: color.value,
  stroke: props.stroke,
  fill: props.fill,
  hide: props.hide,
  tooltip: props.tooltipType !== 'none',
}))

const target = computed<RadarPoint[]>(() => {
  if (props.hide) return []
  const cx = polar.cx.value
  const cy = polar.cy.value
  const angleAxis = polar.angleAxis.value
  const radiusAxis = polar.radiusAxis.value

  return chart.data.value.flatMap((datum, index) => {
    const raw = datum[props.dataKey]
    const value = Number(raw)
    if (raw === undefined || raw === '' || !Number.isFinite(value)) return []
    const angle = angleAxis.at(index)
    const radius = radiusAxis.scale(value)

    return [{ index, angle, radius, value: raw, ...polarToCartesian(cx, cy, radius, angle) }]
  })
})

// Mount: the radar grows out of the center. Data change: every point moves from its previous radius.
const interpolate = (from: RadarPoint[] | null, to: RadarPoint[], t: number): RadarPoint[] => {
  const cx = polar.cx.value
  const cy = polar.cy.value

  return to.map((point) => {
    const previous = from?.find((item) => item.index === point.index)
    const radius = lerp(previous?.radius ?? 0, point.radius, t)

    return { ...point, radius, ...polarToCartesian(cx, cy, radius, point.angle) }
  })
}

const tween = useChartTween(
  () => target.value,
  interpolate,
  () => [chart.data.value, props.dataKey, props.hide],
  () => props,
)

const path = computed(() => polygonPath(tween.value.value))

const dotStyle = computed(() =>
  dotAttrs(props.dot, {
    r: 3,
    fill: fillColor.value,
    stroke: strokeColor.value,
    strokeWidth: props.strokeWidth ?? 1,
  }),
)

const activeDotStyle = computed(() =>
  dotAttrs(props.activeDot, { r: 4, fill: color.value, stroke: 'var(--surface)', strokeWidth: 2 }),
)

const activePoint = computed(() => {
  const index = chart.active.index
  if (
    index === null ||
    props.hide ||
    chart.tooltipEnabled.value === 0 ||
    chart.interaction.value?.trigger !== 'axis'
  )
    return null

  return target.value.find((point) => point.index === index) ?? null
})

// Each label sits past its point along the spoke, anchored away from the center. Labels follow the tween.
provideChartLabels(
  () =>
    tween.value.value.map((point): ChartLabelItem => ({
      index: point.index,
      value: point.value,
      datum: chart.data.value[point.index] ?? {},
      viewBox: {
        cx: polar.cx.value,
        cy: polar.cy.value,
        innerRadius: point.radius,
        outerRadius: point.radius,
        startAngle: point.angle,
        endAngle: point.angle,
      },
    })),
  'outside',
)
</script>
