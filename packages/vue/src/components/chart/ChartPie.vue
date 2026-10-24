<template>
  <ChartLayer name="series">
    <g v-if="!hide" data-slot="chart-pie" :class="chart.classes('series', props.class)">
      <path
        v-for="sector in sectors"
        :key="sector.index"
        data-slot="chart-pie-sector"
        :data-index="sector.index"
        :data-active="
          chart.active.seriesId === id && chart.active.index === sector.index ? 'true' : undefined
        "
        :d="sector.d"
        :transform="`translate(${sector.cx}, ${sector.cy})`"
        :fill="sector.fill"
        :fill-opacity="sector.cell?.fillOpacity"
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
import { computed, watchEffect } from 'vue'

import type { ChartTweenStep } from './animation'
import { lerp, useChartTween } from './animation'
import { provideChartCells } from './cells'
import ChartLayer from './ChartLayer.vue'
import type { ChartPieProps, ChartPieSlots } from './ChartPie.types'
import { useChartContext } from './context'
import type { ChartLabelItem } from './label'
import { provideChartLabels } from './label'
import { usePolarContext } from './polar-context'
import { sectorPath } from './polar-paths'
import type { PieSector } from './polar-pie'
import { computePieSectors } from './polar-pie'
import { DEFAULT_SERIES_COLOR } from './series'
import type { ChartDatum } from './types'
import type { ChartSeries, ChartTooltipPayloadEntry } from './types'

const props = withDefaults(defineProps<ChartPieProps>(), {
  nameKey: 'name',
  cx: '50%',
  cy: '50%',
  innerRadius: 0,
  outerRadius: '80%',
  startAngle: 0,
  endAngle: 360,
  paddingAngle: 0,
  minAngle: 0,
  cornerRadius: 0,
  hide: false,
  isAnimationActive: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
})

defineSlots<ChartPieSlots>()

const chart = useChartContext('ChartPie')
const polar = usePolarContext('ChartPie')
const id = useId(undefined, 'hareui-chart-pie')
const cells = provideChartCells()

const data = computed(() => (props.data ?? chart.data.value) as ChartDatum[])

const sliceFill = (index: number): string => {
  const datum = data.value[index]
  const own = typeof datum?.fill === 'string' ? datum.fill : undefined

  return cells.value[index]?.fill ?? own ?? props.fill ?? DEFAULT_SERIES_COLOR
}

const sliceName = (index: number): string => {
  const value = data.value[index]?.[props.nameKey]
  return value !== undefined && value !== '' ? String(value) : (props.name ?? String(index))
}

// The polar context resolves the geometry, and a pie chart's center (`#center`, centered `ChartLabel`) reads it back
// from `registerItems`, so the two always agree.
const geometry = computed(() =>
  polar.resolveGeometry({
    cx: props.cx,
    cy: props.cy,
    innerRadius: props.innerRadius,
    outerRadius: props.outerRadius,
  }),
)

const target = computed<PieSector[]>(() => {
  if (props.hide) return []

  return computePieSectors(
    data.value.map((datum) => Number(datum[props.dataKey])),
    {
      ...geometry.value,
      startAngle: props.startAngle,
      endAngle: props.endAngle,
      paddingAngle: props.paddingAngle,
      minAngle: props.minAngle,
    },
  )
})

// Mount: the slices fan open from `startAngle`. Data change: each slice moves from the slice at the same relative
// position in the previous drawing, so adding or removing rows doesn't make every slice jump.
const interpolate = ({ from, to, t }: ChartTweenStep<PieSector[]>): PieSector[] => {
  return to.map((sector, index) => {
    const previous = from?.length ? from[Math.floor((index * from.length) / to.length)] : undefined
    return {
      ...sector,
      startAngle: lerp([previous?.startAngle ?? props.startAngle, sector.startAngle], t),
      endAngle: lerp([previous?.endAngle ?? props.startAngle, sector.endAngle], t),
    }
  })
}

const tween = useChartTween({
  target: () => target.value,
  interpolate,
  key: () => [
    data.value,
    props.dataKey,
    props.startAngle,
    props.endAngle,
    props.paddingAngle,
    props.minAngle,
    props.hide,
  ],
  animation: () => props,
})

const sectors = computed(() =>
  tween.value.value.map((sector) => ({
    ...sector,
    d: sectorPath({ ...sector, cornerRadius: props.cornerRadius }),
    fill: sliceFill(sector.index),
    cell: cells.value[sector.index],
  })),
)

const entries = (index: number): ChartTooltipPayloadEntry[] => {
  const datum = data.value[index]
  const value = datum?.[props.dataKey]
  if (!datum || value === undefined || value === null) return []
  const fill = sliceFill(index)

  return [
    { dataKey: props.dataKey, name: sliceName(index), value, color: fill, fill, payload: datum },
  ]
}

chart.registerSeries((): ChartSeries => ({
  id,
  kind: 'pie',
  dataKey: props.dataKey,
  name: props.name,
  color: props.fill ?? DEFAULT_SERIES_COLOR,
  fill: props.fill,
  stroke: props.stroke,
  hide: props.hide,
  tooltip: props.tooltipType !== 'none',
  entries,
}))

polar.registerItems(id, () => ({
  sectors: target.value,
  startAngle: props.startAngle,
  endAngle: props.endAngle,
  geometry: geometry.value,
}))

// Labels read the tweened angles so they move with their slices.
provideChartLabels(
  () =>
    tween.value.value.map((sector): ChartLabelItem => ({
      index: sector.index,
      value: data.value[sector.index]?.[props.dataKey],
      datum: data.value[sector.index] ?? {},
      viewBox: {
        cx: sector.cx,
        cy: sector.cy,
        innerRadius: sector.innerRadius,
        outerRadius: sector.outerRadius,
        startAngle: sector.startAngle,
        endAngle: sector.endAngle,
      },
    })),
  'inside',
)

// A hidden or emptied pie must not keep the tooltip open.
watchEffect(() => {
  if (
    chart.active.seriesId === id &&
    chart.active.index !== null &&
    !target.value[chart.active.index]
  )
    chart.setActive(null)
})
</script>
