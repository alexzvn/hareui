<template>
  <ChartFrame
    v-model:hidden="hidden"
    data-slot="radial-chart"
    :width="width"
    :height="height"
    :config="config"
    :class="ui.base()"
  >
    <template v-for="name in frameSlotNames(slots)" #[name]="scope">
      <slot :name="name" v-bind="scope as any" />
    </template>
    <template v-if="slices && valueKey" #parts>
      <ChartPolarAngleAxis
        type="number"
        :domain="[0, domainMax]"
        :tick="{ label: false }"
        :axis-line="{ show: false }"
      />
      <ChartRadialBar
        :data-key="valueKey"
        :name-key="props.index"
        :background="props.background ?? chartDefaults.radial.background"
        :corner-radius="props.cornerRadius ?? chartDefaults.radial.cornerRadius"
      >
        <ChartCell v-for="slice in visibleSlices" :key="slice.key" :fill="slice.color" />
      </ChartRadialBar>
    </template>
    <template #default>
      <slot />
      <ChartPolarCenter v-if="slots.center">
        <slot name="center" v-bind="polar.center.value" />
      </ChartPolarCenter>
    </template>
  </ChartFrame>
</template>

<script setup lang="ts" generic="T extends object">
import { defu } from 'defu'
import { computed } from 'vue'

import ChartCell from '@/components/chart/ChartCell.vue'
import ChartFrame from '@/components/chart/ChartFrame.vue'
import ChartPolarAngleAxis from '@/components/chart/ChartPolarAngleAxis.vue'
import ChartPolarCenter from '@/components/chart/ChartPolarCenter.vue'
import ChartRadialBar from '@/components/chart/ChartRadialBar.vue'
import { useChartRoot } from '@/components/chart/context'
import { frameSlotNames } from '@/components/chart/frame'
import { usePolarChart } from '@/components/chart/polar'
import { providePolarCenterLabel, useSliceRoot } from '@/components/chart/polar-root'
import { chartDefaults } from '@/components/chart/series-config'
import type { ChartBarSizing, ChartDatum } from '@/components/chart/types'
import { useComponentUI } from '@/composables/useComponentUI'

import type { RadialChartProps, RadialChartSlots } from './RadialChart.types'
import theme from './theme'

const props = withDefaults(defineProps<RadialChartProps<T>>(), {
  height: 300,
  width: '100%',
  margin: () => ({ top: 5, right: 5, bottom: 5, left: 5 }),
  cx: '50%',
  cy: '50%',
  innerRadius: '30%',
  outerRadius: '80%',
  gauge: false,
  background: undefined,
  tooltip: undefined,
  legend: undefined,
})

// Gaps default in the bar layout, shared with `BarChart`.
const BAR_DEFAULTS: ChartBarSizing = { size: 10 }

const slots = defineSlots<RadialChartSlots>()
const hidden = defineModel<string[]>('hidden', { default: () => [] })

const { valueKey, slices, visibleSlices, config } = useSliceRoot({
  props,
  hidden,
  hasLegendSlot: () => !!slots.legend,
})

// Full bar: `max`, or the largest value of every ring (hidden ones too, so toggling a ring keeps the scale).
const domainMax = computed(
  () => props.max ?? Math.max(0, ...(slices.value ?? []).map((slice) => slice.value)),
)

const bar = computed(() => defu(props.bar, BAR_DEFAULTS))

const startAngle = computed(
  () => props.startAngle ?? (props.gauge ? chartDefaults.gauge.startAngle : 90),
)

const endAngle = computed(
  () => props.endAngle ?? (props.gauge ? chartDefaults.gauge.endAngle : -270),
)

const ui = useComponentUI('radialChart', { theme: theme, variantProps: () => ({}), props })
const chart = useChartRoot({
  // Generated mode: only the visible rings reach the chart, so the active index points into them.
  data: () =>
    (slices.value ? visibleSlices.value.map((slice) => slice.row) : props.data) as ChartDatum[],
  margin: () => props.margin,
  layout: () => 'radial',
  ui,
})

const polar = usePolarChart(chart, {
  kind: 'radialBar',
  cx: () => props.cx,
  cy: () => props.cy,
  innerRadius: () => props.innerRadius,
  outerRadius: () => props.outerRadius,
  startAngle: () => startAngle.value,
  endAngle: () => endAngle.value,
  bar: () => bar.value,
  slices: () => slices.value,
})

// The hole inside the innermost ring.
providePolarCenterLabel({ chart, polar, radius: () => polar.innerRadius.value })
</script>
