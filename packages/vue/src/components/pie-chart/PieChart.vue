<template>
  <ChartFrame
    v-model:hidden="hidden"
    data-slot="pie-chart"
    :width="width"
    :height="height"
    :config="config"
    :class="ui.base({ class: [props.ui?.base, props.class] })"
  >
    <template v-for="name in frameSlotNames(slots)" #[name]="scope">
      <slot :name="name" v-bind="scope as any" />
    </template>
    <template #parts>
      <ChartPie v-if="slices && valueKey" :data-key="valueKey" :name-key="props.index" v-bind="pie">
        <ChartCell v-for="slice in visibleSlices" :key="slice.key" :fill="slice.color" />
      </ChartPie>
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
import { computed } from 'vue'

import ChartCell from '@/components/chart/ChartCell.vue'
import ChartFrame from '@/components/chart/ChartFrame.vue'
import ChartPie from '@/components/chart/ChartPie.vue'
import ChartPolarCenter from '@/components/chart/ChartPolarCenter.vue'
import { useChartRoot } from '@/components/chart/context'
import { frameSlotNames } from '@/components/chart/frame'
import { usePolarChart } from '@/components/chart/polar'
import { providePolarCenterLabel, useSliceRoot } from '@/components/chart/polar-root'
import { chartDefaults } from '@/components/chart/series-config'
import type { ChartDatum } from '@/components/chart/types'
import { useComponentUI } from '@/composables/useComponentUI'

import type { PieChartProps, PieChartSlots } from './PieChart.types'
import theme from './theme'

const props = withDefaults(defineProps<PieChartProps<T>>(), {
  height: 300,
  width: '100%',
  margin: () => ({ top: 5, right: 5, bottom: 5, left: 5 }),
  donut: false,
  tooltip: undefined,
  legend: undefined,
})

const slots = defineSlots<PieChartSlots>()
const hidden = defineModel<string[]>('hidden', { default: () => [] })

const { valueKey, slices, visibleSlices, config } = useSliceRoot({
  props,
  hidden,
  hasLegendSlot: () => !!slots.legend,
})

const pie = computed(() => {
  const own = {
    innerRadius: props.innerRadius,
    outerRadius: props.outerRadius,
    cornerRadius: props.cornerRadius,
    paddingAngle: props.paddingAngle,
    startAngle: props.startAngle,
    endAngle: props.endAngle,
  }

  const defined = Object.fromEntries(Object.entries(own).filter(([, value]) => value !== undefined))

  return { ...(props.donut ? chartDefaults.donut : {}), ...defined }
})

const ui = useComponentUI('pieChart', theme, () => ({}))
const chart = useChartRoot({
  // Generated mode: only the visible slices reach the pie, so the active index points into them.
  data: () =>
    (slices.value ? visibleSlices.value.map((slice) => slice.row) : props.data) as
      | ChartDatum[]
      | undefined,
  margin: () => props.margin,
  layout: () => 'centric',
  ui,
  uiProps: () => props.ui,
})

// The center follows the first pie drawn (see `usePolarChart`), so the root passes no geometry of its own.
const polar = usePolarChart(chart, { kind: 'pie', slices: () => slices.value })
providePolarCenterLabel(chart, polar, () => polar.outerRadius.value)
</script>
