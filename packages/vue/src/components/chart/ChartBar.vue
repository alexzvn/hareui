<template>
  <ChartLayer v-if="!hidden" name="bar">
    <g data-slot="chart-bar" :data-key="dataKey" :class="chart.classes('series', props.class)">
      <path
        v-for="bar in bars"
        :key="bar.rect.index"
        data-slot="chart-bar-rectangle"
        :data-index="bar.rect.index"
        :d="bar.d"
        :fill="bar.fill"
        :fill-opacity="bar.fillOpacity"
        :stroke="bar.stroke"
        :stroke-width="bar.strokeWidth"
        :class="bar.class"
      />
    </g>
  </ChartLayer>
  <slot />
</template>

<script lang="ts">
import type { ChartSeriesProps } from './series'
import type { ChartRadius } from './shapes'

export interface ChartBarProps extends ChartSeriesProps {
  /**
   * Bar color or `url(#gradient-id)`.
   * @defaultValue 'var(--chart-3)'
   */
  fill?: string
  /** Opacity of the fill. */
  fillOpacity?: number
  /** Outline color. */
  stroke?: string
  /** Outline width, in px. */
  strokeWidth?: number
  /** Bars with the same `stackId` stack on top of each other. */
  stackId?: string | number
  /** Bar thickness, in px or percent of the band. Defaults to an even share of the band. */
  barSize?: number | string
  /** Maximum bar thickness, in px. */
  maxBarSize?: number
  /**
   * Corner radius: one value, or `[topLeft, topRight, bottomRight, bottomLeft]`.
   * @defaultValue 0
   */
  radius?: ChartRadius
}

export interface ChartBarSlots {
  /** `ChartCell` per bar to override its fill, and `ChartLabel` to label every bar. */
  default?: () => unknown
}
</script>

<script setup lang="ts">
import { useId } from 'reka-ui'
import { cx } from 'tailwind-variants'
import { computed } from 'vue'

import { lerp, useChartTween } from './animation'
import { useCartesianContext } from './cartesian'
import { provideChartCells } from './cells'
import ChartLayer from './ChartLayer.vue'
import { useChartContext } from './context'
import type { ChartLabelItem } from './label'
import { provideChartLabels } from './label'
import { DEFAULT_SERIES_COLOR, useRootSeries } from './series'
import { rectanglePath } from './shapes'
import type { ChartTooltipPayloadEntry } from './types'

interface BarRect {
  index: number
  x: number
  y: number
  width: number
  height: number
  value: number | string | undefined
}

const props = withDefaults(defineProps<ChartBarProps>(), {
  radius: 0,
  hide: false,
  isAnimationActive: true,
  animationBegin: 0,
  animationDuration: 1500,
  animationEasing: 'ease',
  xAxisId: 0,
  yAxisId: 0,
})
defineSlots<ChartBarSlots>()

const chart = useChartContext('ChartBar')
const cartesian = useCartesianContext('ChartBar')
const id = useId(undefined, 'hareui-chart-bar')
const cells = provideChartCells()
// Name, color and visibility default from the root's `series` config of this key.
const rootSeries = useRootSeries(chart, () => props.dataKey)
const fill = computed(() => props.fill ?? rootSeries.value?.color ?? DEFAULT_SERIES_COLOR)
const hidden = computed(() => props.hide || !!rootSeries.value?.hidden)
const name = computed(() => props.name ?? rootSeries.value?.name)

chart.registerSeries(() => ({
  id,
  kind: 'bar',
  dataKey: props.dataKey,
  name: name.value,
  color: fill.value,
  fill: fill.value,
  stroke: props.stroke,
  hide: hidden.value,
  tooltip: props.tooltipType !== 'none',
  stackId: props.stackId,
  xAxisId: props.xAxisId,
  yAxisId: props.yAxisId,
  barSize: props.barSize,
  maxBarSize: props.maxBarSize,
  // A `ChartCell` fill colors the tooltip indicator of its bar.
  entries: (index): ChartTooltipPayloadEntry[] => {
    const datum = chart.data.value[index]
    const value = datum?.[props.dataKey]
    if (!datum || value === undefined || value === null) return []
    const color = cells.value[index]?.fill ?? fill.value
    return [
      {
        dataKey: props.dataKey,
        name: name.value ?? props.dataKey,
        value,
        color,
        fill: color,
        stroke: props.stroke,
        payload: datum,
      },
    ]
  },
}))

const horizontal = cartesian.horizontal

const target = computed<(BarRect | null)[]>(() => {
  const position = cartesian.barPosition(id)
  if (hidden.value || !position) return []
  const category = cartesian.categoryAxis.value
  const valueAxis = horizontal.value
    ? cartesian.yAxis(props.yAxisId)
    : cartesian.xAxis(props.xAxisId)
  const data = chart.data.value
  return cartesian.seriesValues(id).map((pair, index) => {
    if (!pair) return null
    const start = category.scale(index) + position.offset
    const value = data[index]?.[props.dataKey]
    if (horizontal.value) {
      const y = valueAxis.scale(pair[1])
      return {
        index,
        x: start,
        width: position.size,
        y,
        height: valueAxis.scale(pair[0]) - y,
        value,
      }
    }
    const x = valueAxis.scale(pair[0])
    return { index, y: start, height: position.size, x, width: valueAxis.scale(pair[1]) - x, value }
  })
})

const tween = useChartTween(
  () => target.value,
  (from, to, t) =>
    to.map((rect, index) => {
      if (!rect) return null
      // When the number of bars changes, each bar starts from the old bar at the same relative position.
      const previous = from?.length
        ? from[Math.min(Math.floor((index * from.length) / to.length), from.length - 1)]
        : null
      if (previous)
        return {
          ...rect,
          x: lerp(previous.x, rect.x, t),
          y: lerp(previous.y, rect.y, t),
          width: lerp(previous.width, rect.width, t),
          height: lerp(previous.height, rect.height, t),
        }
      // Bars grow out of their baseline.
      if (horizontal.value) {
        const height = rect.height * t
        return { ...rect, y: rect.y + rect.height - height, height }
      }
      return { ...rect, width: rect.width * t }
    }),
  () => [chart.data.value, props.dataKey, props.stackId, hidden.value],
  () => props,
)

const bars = computed(() =>
  tween.value.value.flatMap((rect) => {
    if (!rect) return []
    const cell = cells.value[rect.index]
    return [
      {
        rect,
        d: rectanglePath(rect.x, rect.y, rect.width, rect.height, props.radius),
        fill: cell?.fill ?? fill.value,
        fillOpacity: cell?.fillOpacity ?? props.fillOpacity,
        stroke: cell?.stroke ?? props.stroke,
        strokeWidth: cell?.strokeWidth ?? props.strokeWidth,
        class: cx(cell?.class),
      },
    ]
  }),
)

// Labels appear once the bars have finished animating.
provideChartLabels(
  () =>
    (tween.progress.value < 1 ? [] : target.value).flatMap((rect): ChartLabelItem[] =>
      rect
        ? [
            {
              index: rect.index,
              value: rect.value,
              datum: chart.data.value[rect.index] ?? {},
              viewBox: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
            },
          ]
        : [],
    ),
  'center',
)
</script>
