<template>
  <ChartFrame
    v-model:hidden="hidden"
    data-slot="radar-chart"
    :width="width"
    :height="height"
    :config="config"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <template v-for="name in frameSlotNames(slots)" #[name]="scope">
      <slot :name="name" v-bind="scope as any" />
    </template>
    <template #parts>
      <ChartPolarGrid v-if="grid" v-bind="grid" />
      <ChartPolarAngleAxis v-if="angleAxis" v-bind="angleAxis">
        <template v-if="slots['angle-tick']" #tick="tick">
          <slot name="angle-tick" v-bind="tick" />
        </template>
      </ChartPolarAngleAxis>
      <ChartPolarRadiusAxis v-if="radiusAxis" v-bind="radiusAxis" />
      <!-- Hidden radars stay mounted with `hide`, so colors are stable and toggling animates. -->
      <ChartRadar
        v-for="series in resolved"
        :key="series.key"
        :data-key="series.key"
        :name="series.name"
        :stroke="series.color"
        :fill="series.color"
        :fill-opacity="series.fillOpacity"
        :stroke-width="series.strokeWidth"
        :stroke-dasharray="series.strokeDasharray"
        :dot="series.dot"
        :active-dot="series.activeDot"
        :hide="series.hidden"
        :tooltip-type="series.tooltip === false ? 'none' : undefined"
      />
    </template>
    <template #default>
      <slot />
    </template>
  </ChartFrame>
</template>

<script setup lang="ts" generic="T extends object">
import { computed } from 'vue'

import { definedProps } from '@/components/chart/cartesian-root'
import ChartFrame from '@/components/chart/ChartFrame.vue'
import type { ChartPolarAngleAxisProps } from '@/components/chart/ChartPolarAngleAxis.types'
import ChartPolarAngleAxis from '@/components/chart/ChartPolarAngleAxis.vue'
import type { ChartPolarGridProps } from '@/components/chart/ChartPolarGrid.types'
import ChartPolarGrid from '@/components/chart/ChartPolarGrid.vue'
import type { ChartPolarRadiusAxisProps } from '@/components/chart/ChartPolarRadiusAxis.types'
import ChartPolarRadiusAxis from '@/components/chart/ChartPolarRadiusAxis.vue'
import ChartRadar from '@/components/chart/ChartRadar.vue'
import { useChartRoot } from '@/components/chart/context'
import { frameSlotNames } from '@/components/chart/frame'
import { usePolarChart } from '@/components/chart/polar'
import { usePolarRoot } from '@/components/chart/polar-root'
import type { ChartRadarSeries } from '@/components/chart/series-config'
import {
  chartDefaults,
  isChartGenerated,
  resolveChartPart,
  resolveSeries,
  seriesLegendItems,
  seriesValueFormatter,
} from '@/components/chart/series-config'
import type { ChartDatum } from '@/components/chart/types'
import { useComponentUI } from '@/composables/useComponentUI'

import type { RadarChartProps, RadarChartSlots } from './RadarChart.types'
import theme from './theme'

const props = withDefaults(defineProps<RadarChartProps<T>>(), {
  height: 300,
  width: '100%',
  margin: () => ({ top: 5, right: 5, bottom: 5, left: 5 }),
  cx: '50%',
  cy: '50%',
  innerRadius: 0,
  outerRadius: '80%',
  startAngle: 90,
  endAngle: -270,
  dot: undefined,
  grid: undefined,
  angleAxis: undefined,
  radiusAxis: undefined,
  tooltip: undefined,
  legend: undefined,
})

const slots = defineSlots<RadarChartSlots>()
const hidden = defineModel<string[]>('hidden', { default: () => [] })

const generated = computed(() => isChartGenerated(props))
const resolved = computed(() => {
  if (!generated.value) return []
  const own = { fillOpacity: props.fillOpacity, strokeWidth: props.strokeWidth, dot: props.dot }
  const defined = Object.fromEntries(Object.entries(own).filter(([, value]) => value !== undefined))

  return resolveSeries<T, ChartRadarSeries>({
    data: props.data,
    index: props.index,
    series: props.series,
    colors: props.colors,
    hidden: hidden.value,
    defaults: { ...chartDefaults.radar, ...defined },
  })
})

const grid = computed(() =>
  generated.value ? resolveChartPart<Partial<ChartPolarGridProps>>(props.grid, {}) : null,
)

const angleAxis = computed(() =>
  generated.value
    ? resolveChartPart<Partial<ChartPolarAngleAxisProps>>(
        props.angleAxis,
        definedProps({
          dataKey: props.index as string | undefined,
          tickFormatter: props.indexFormatter,
        }),
      )
    : null,
)

const radiusAxis = computed(() =>
  generated.value
    ? resolveChartPart<Partial<ChartPolarRadiusAxisProps>>(props.radiusAxis, {}, false)
    : null,
)

const config = usePolarRoot({
  props,
  generated: () => generated.value,
  legendItems: () => seriesLegendItems(resolved.value),
  tooltip: () =>
    definedProps({
      valueFormatter: seriesValueFormatter(resolved.value, props.valueFormatter),
      labelFormatter: props.indexFormatter,
    }),
  hasLegendSlot: () => !!slots.legend,
})

const ui = useComponentUI('radarChart', theme, () => ({}))
const chart = useChartRoot({
  data: () => props.data as ChartDatum[],
  margin: () => props.margin,
  layout: () => 'centric',
  ui,
  uiProps: () => props.ui,
})

usePolarChart(chart, {
  kind: 'radar',
  cx: () => props.cx,
  cy: () => props.cy,
  innerRadius: () => props.innerRadius,
  outerRadius: () => props.outerRadius,
  startAngle: () => props.startAngle,
  endAngle: () => props.endAngle,
})
</script>
