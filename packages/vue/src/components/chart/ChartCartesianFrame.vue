<script setup lang="ts">
import type { CartesianAutoConfig, CartesianRootSlots } from './cartesian-root'
import ChartLegend from '../chart-legend/ChartLegend.vue'
import ChartArea from './ChartArea.vue'
import ChartBar from './ChartBar.vue'
import ChartGrid from './ChartGrid.vue'
import ChartLine from './ChartLine.vue'
import ChartSurface from './ChartSurface.vue'
import ChartTooltip from './ChartTooltip.vue'
import ChartXAxis from './ChartXAxis.vue'
import ChartYAxis from './ChartYAxis.vue'
import { useChartContext } from './context'
import { toggleHiddenKey } from './series-config'

// Internal: what every cartesian root renders. The surface, the in-chart legend, and (when the root is drawn from
// props) its grid, axes, series and tooltip, followed by the root's default slot. Root attributes fall through to the
// surface.

const props = defineProps<{
  width: number | `${number}%`
  height: number
  config: CartesianAutoConfig
}>()

defineSlots<CartesianRootSlots>()

const hidden = defineModel<string[]>('hidden', { required: true })

const chart = useChartContext('ChartCartesianFrame')

function toggle(key: string) {
  hidden.value = toggleHiddenKey(hidden.value, key)
}

const stackedLegend = () => props.config.legend?.position === 'top' || props.config.legend?.position === 'bottom'
</script>

<template>
  <ChartSurface :width="width" :height="height" :legend="config.legend?.position">
    <template v-if="config.legend" #legend>
      <slot name="legend" :items="config.legendItems" :toggle="toggle">
        <ChartLegend
          v-model:hidden="hidden"
          :items="config.legendItems"
          toggleable
          :orientation="stackedLegend() ? 'horizontal' : 'vertical'"
          v-bind="config.legend.props"
          :class="chart.classes('legend', stackedLegend() && 'justify-center')"
        >
          <template v-if="$slots['legend-item']" #item="item">
            <slot name="legend-item" v-bind="item" />
          </template>
        </ChartLegend>
      </slot>
    </template>
    <template v-if="config.generated">
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
      <ChartTooltip v-if="config.tooltip" v-bind="config.tooltip">
        <template v-if="$slots.tooltip" #content="content">
          <slot name="tooltip" v-bind="content" />
        </template>
        <template v-if="$slots['tooltip-footer']" #footer="footer">
          <slot name="tooltip-footer" v-bind="footer" />
        </template>
      </ChartTooltip>
    </template>
    <slot />
  </ChartSurface>
</template>
