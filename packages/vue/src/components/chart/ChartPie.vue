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

<script lang="ts">
import type { ClassValue } from 'tailwind-variants'

import type { ChartAnimationProps } from './animation'
import type { ChartDatum } from './types'

export type ChartPieProps = {
  /** Slices of the pie. Defaults to the chart's `data`. Rows may leave keys out, e.g. a `fill` set on some rows only. */
  data?: object[]
  /** Key of the slice values. */
  dataKey: string
  /**
   * Key of the slice names shown in the tooltip.
   * @defaultValue 'name'
   */
  nameKey?: string
  /** Name used when a slice has no `nameKey` value. Defaults to the slice index. */
  name?: string
  /**
   * Horizontal center, in px or as a percentage of the chart width.
   * @defaultValue '50%'
   */
  cx?: number | string
  /**
   * Vertical center, in px or as a percentage of the chart height.
   * @defaultValue '50%'
   */
  cy?: number | string
  /**
   * Inner radius, in px or as a percentage of half the shorter chart side. Set it to draw a donut.
   * @defaultValue 0
   */
  innerRadius?: number | string
  /**
   * Outer radius, in px or as a percentage of half the shorter chart side.
   * @defaultValue '80%'
   */
  outerRadius?: number | string
  /**
   * Angle of the first slice edge, in degrees. 0 is at 3 o'clock; angles grow counter-clockwise.
   * @defaultValue 0
   */
  startAngle?: number
  /**
   * Angle of the last slice edge, in degrees. Use `startAngle: 180, endAngle: 0` for a half pie.
   * @defaultValue 360
   */
  endAngle?: number
  /**
   * Gap between slices, in degrees. Negative values overlap the slices, which pairs well with `cornerRadius`.
   * @defaultValue 0
   */
  paddingAngle?: number
  /**
   * Smallest angle of a non-zero slice, in degrees.
   * @defaultValue 0
   */
  minAngle?: number
  /**
   * Corner radius of each slice, in px. Capped at half the ring thickness.
   * @defaultValue 0
   */
  cornerRadius?: number
  /**
   * Fill of the slices without a `ChartCell`.
   * @defaultValue 'var(--chart-3)'
   */
  fill?: string
  /** Outline color of the slices. No outline by default. */
  stroke?: string
  /** Outline width of the slices, in px. */
  strokeWidth?: number
  /**
   * Hides the pie.
   * @defaultValue false
   */
  hide?: boolean
  /** `'none'` leaves the pie out of the tooltip. */
  tooltipType?: 'none'
  /** Additional classes merged into the pie group. */
  class?: ClassValue
} & ChartAnimationProps

export type ChartPieSlots = {
  /** `ChartCell` per slice (in data order) and `ChartLabel`. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { useId } from 'reka-ui'
import { computed, watchEffect } from 'vue'

import { lerp, useChartTween } from './animation'
import { provideChartCells } from './cells'
import ChartLayer from './ChartLayer.vue'
import { useChartContext } from './context'
import type { ChartLabelItem } from './label'
import { provideChartLabels } from './label'
import type { PieSector } from './polar'
import { computePieSectors, sectorPath, usePolarContext } from './polar'
import { DEFAULT_SERIES_COLOR } from './series'
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

function sliceFill(index: number): string {
  const datum = data.value[index]
  const own = typeof datum?.fill === 'string' ? datum.fill : undefined
  return cells.value[index]?.fill ?? own ?? props.fill ?? DEFAULT_SERIES_COLOR
}

function sliceName(index: number): string {
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
function interpolate(from: PieSector[] | null, to: PieSector[], t: number): PieSector[] {
  return to.map((sector, index) => {
    const previous = from?.length ? from[Math.floor((index * from.length) / to.length)] : undefined
    return {
      ...sector,
      startAngle: lerp(previous?.startAngle ?? props.startAngle, sector.startAngle, t),
      endAngle: lerp(previous?.endAngle ?? props.startAngle, sector.endAngle, t),
    }
  })
}

const tween = useChartTween(
  () => target.value,
  interpolate,
  () => [
    data.value,
    props.dataKey,
    props.startAngle,
    props.endAngle,
    props.paddingAngle,
    props.minAngle,
    props.hide,
  ],
  () => props,
)

const sectors = computed(() =>
  tween.value.value.map((sector) => ({
    ...sector,
    d: sectorPath({ ...sector, cornerRadius: props.cornerRadius }),
    fill: sliceFill(sector.index),
    cell: cells.value[sector.index],
  })),
)

function entries(index: number): ChartTooltipPayloadEntry[] {
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
