<template>
  <ChartFrame v-model:hidden="hidden" :width="width" :height="height" :config="config">
    <template v-for="name in frameSlotNames(slots)" #[name]="scope">
      <slot :name="name" v-bind="scope as any" />
    </template>
    <template v-if="config.generated" #parts>
      <ChartGrid v-if="config.grid" v-bind="config.grid" />
      <ChartXAxis v-if="config.xAxis" v-bind="config.xAxis">
        <template v-if="$slots['x-tick']" #tick="tick">
          <slot name="x-tick" v-bind="tick" />
        </template>
      </ChartXAxis>
      <ChartYAxis v-if="config.yAxis" v-bind="config.yAxis">
        <template v-if="$slots['y-tick']" #tick="tick">
          <slot name="y-tick" v-bind="tick" />
        </template>
      </ChartYAxis>
      <ChartYAxis v-if="config.yAxisRight" v-bind="config.yAxisRight">
        <template v-if="$slots['y-tick']" #tick="tick">
          <slot name="y-tick" v-bind="tick" />
        </template>
      </ChartYAxis>
      <template v-for="series in config.series" :key="series.key">
        <ChartArea v-if="series.kind === 'area'" v-bind="series.props as any" />
        <ChartBar v-else-if="series.kind === 'bar'" v-bind="series.props as any" />
        <ChartLine v-else v-bind="series.props as any" />
      </template>
    </template>
    <template #default>
      <slot />
    </template>
  </ChartFrame>
</template>

<script setup lang="ts">
import { useSlots } from 'vue'

import type { CartesianAutoConfig, CartesianRootSlots } from './cartesian-root'
import ChartArea from './ChartArea.vue'
import ChartBar from './ChartBar.vue'
import ChartFrame from './ChartFrame.vue'
import ChartGrid from './ChartGrid.vue'
import ChartLine from './ChartLine.vue'
import ChartXAxis from './ChartXAxis.vue'
import ChartYAxis from './ChartYAxis.vue'
import { frameSlotNames } from './frame'

// Internal: what every cartesian root renders. `ChartFrame` (surface, legend, tooltip) around, when the root is drawn
// from props, its grid, axes and series, followed by the root's default slot. Root attributes fall through to the
// surface.

defineProps<{
  width: number | `${number}%`
  height: number
  config: CartesianAutoConfig
}>()

defineSlots<CartesianRootSlots>()
const slots = useSlots()

const hidden = defineModel<string[]>('hidden', { required: true })
</script>
