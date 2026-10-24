<template>
  <ChartLayer v-if="tracks.length" name="bar-background">
    <g data-slot="chart-radial-bar-background">
      <path
        v-for="track in tracks"
        :key="track.index"
        data-slot="chart-radial-bar-track"
        :d="track.d"
        :transform="`translate(${polar.cx.value}, ${polar.cy.value})`"
        :style="backgroundStyle.fill ? { fill: backgroundStyle.fill } : undefined"
        :class="chart.classes('radialBarBackground', backgroundStyle.class)"
      />
    </g>
  </ChartLayer>
  <ChartLayer name="series">
    <g v-if="!hide" data-slot="chart-radial-bar" :class="chart.classes('series', props.class)">
      <path
        v-for="sector in sectors"
        :key="sector.index"
        data-slot="chart-radial-bar-sector"
        :data-index="sector.index"
        :data-active="chart.active.index === sector.index ? 'true' : undefined"
        :d="sector.d"
        :transform="`translate(${sector.cx}, ${sector.cy})`"
        :fill="sector.fill"
        :fill-opacity="sector.cell?.fillOpacity ?? fillOpacity"
        :stroke="sector.cell?.stroke ?? stroke"
        :stroke-width="sector.cell?.strokeWidth ?? strokeWidth"
        :class="chart.classes('sector', sector.cell?.class)"
      />
    </g>
  </ChartLayer>
  <slot />
</template>

<script setup lang="ts">
import { useId } from 'reka-ui'
import { computed } from 'vue'

import type { ChartTweenStep } from './animation'
import { lerp, useChartTween } from './animation'
import { provideChartCells } from './cells'
import ChartLayer from './ChartLayer.vue'
import type { ChartRadialBarProps, ChartRadialBarSlots } from './ChartRadialBar.types'
import { useChartContext } from './context'
import type { ChartLabelItem, ChartPolarViewBox } from './label'
import { provideChartLabels } from './label'
import { usePolarContext } from './polar-context'
import { deltaAngle } from './polar-geometry'
import { sectorPath } from './polar-paths'
import { DEFAULT_SERIES_COLOR } from './series'
import type { ChartSeries, ChartTooltipPayloadEntry } from './types'

type RadialBarSector = {
  index: number
  value: number | string | undefined
} & ChartPolarViewBox

const props = withDefaults(defineProps<ChartRadialBarProps>(), {
  nameKey: 'name',
  cornerRadius: 0,
  background: false,
  minPointSize: 0,
  hide: false,
  isAnimationActive: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
})

defineSlots<ChartRadialBarSlots>()

const chart = useChartContext('ChartRadialBar')
const polar = usePolarContext('ChartRadialBar')
const id = useId(undefined, 'hareui-chart-radial-bar')
const cells = provideChartCells()

const ringFill = (index: number): string => {
  const own = chart.data.value[index]?.fill
  return (
    cells.value[index]?.fill ??
    (typeof own === 'string' ? own : undefined) ??
    props.fill ??
    DEFAULT_SERIES_COLOR
  )
}

const ringName = (index: number): string => {
  const value = chart.data.value[index]?.[props.nameKey]
  return value !== undefined && value !== '' ? String(value) : (props.name ?? props.dataKey)
}

const entries = (index: number): ChartTooltipPayloadEntry[] => {
  const datum = chart.data.value[index]
  const value = datum?.[props.dataKey]
  if (!datum || value === undefined || value === null || value === '') return []
  const fill = ringFill(index)

  return [
    { dataKey: props.dataKey, name: ringName(index), value, color: fill, fill, payload: datum },
  ]
}

chart.registerSeries((): ChartSeries => ({
  id,
  kind: 'radialBar',
  dataKey: props.dataKey,
  name: props.name,
  color: props.fill ?? DEFAULT_SERIES_COLOR,
  fill: props.fill,
  stroke: props.stroke,
  hide: props.hide,
  tooltip: props.tooltipType !== 'none',
  barSize: props.barSize,
  maxBarSize: props.maxBarSize,
  entries,
}))

/** Ring bounds of every datum: the bar's slot inside its band of the radius axis. */
const rings = computed(() => {
  const axis = polar.radiusAxis.value
  const { offset, size } = polar.radialBarPosition(id)

  return chart.data.value.map((_, index) => {
    const innerRadius = axis.at(index) + offset
    return { innerRadius, outerRadius: innerRadius + size }
  })
})

const target = computed<RadialBarSector[]>(() => {
  if (props.hide) return []
  const cx = polar.cx.value
  const cy = polar.cy.value
  const startAngle = polar.startAngle.value
  const sweepSign = Math.sign(deltaAngle(startAngle, polar.endAngle.value)) || 1
  const angleAxis = polar.angleAxis.value

  return chart.data.value.flatMap((datum, index) => {
    const raw = datum[props.dataKey]
    const value = Number(raw)
    if (raw === undefined || raw === '' || !Number.isFinite(value)) return []
    let endAngle = angleAxis.scale(value)
    if (props.minPointSize > 0 && Math.abs(endAngle - startAngle) < props.minPointSize)
      endAngle = startAngle + sweepSign * props.minPointSize

    return [{ index, value: raw, cx, cy, ...rings.value[index]!, startAngle, endAngle }]
  })
})

const tracks = computed(() => {
  if (!props.background || props.hide) return []
  const startAngle = polar.startAngle.value
  const endAngle = startAngle + deltaAngle(startAngle, polar.endAngle.value)

  return rings.value.map((ring, index) => ({
    index,
    d: sectorPath({ ...ring, startAngle, endAngle, cornerRadius: props.cornerRadius }),
  }))
})

const backgroundStyle = computed(() =>
  typeof props.background === 'object' ? props.background : {},
)

// Mount: bars sweep out from the start angle. Data change: each bar moves from its previous end angle.
const interpolate = ({ from, to, t }: ChartTweenStep<RadialBarSector[]>): RadialBarSector[] => {
  return to.map((sector) => {
    const previous = from?.find((item) => item.index === sector.index)
    return {
      ...sector,
      endAngle: lerp([previous?.endAngle ?? sector.startAngle, sector.endAngle], t),
    }
  })
}

const tween = useChartTween({
  target: () => target.value,
  interpolate,
  key: () => [chart.data.value, props.dataKey, props.hide],
  animation: () => props,
})

const sectors = computed(() =>
  tween.value.value.map((sector) => ({
    ...sector,
    d: sectorPath({ ...sector, cornerRadius: props.cornerRadius }),
    fill: ringFill(sector.index),
    cell: cells.value[sector.index],
  })),
)

provideChartLabels(
  () =>
    target.value.map((sector): ChartLabelItem => ({
      index: sector.index,
      value: sector.value,
      datum: chart.data.value[sector.index] ?? {},
      viewBox: {
        cx: sector.cx,
        cy: sector.cy,
        innerRadius: sector.innerRadius,
        outerRadius: sector.outerRadius,
        startAngle: sector.startAngle,
        endAngle: sector.endAngle,
      },
    })),
  'insideStart',
)
</script>
