<template>
  <ChartSurface :width="width" :height="height" :legend="config.legend?.position">
    <template v-if="config.legend" #legend>
      <slot name="legend" :items="config.legendItems" :toggle="toggle">
        <!-- Centering goes before the root's `ui.legend` classes, so an override wins. -->
        <ChartLegend
          v-model:hidden="hidden"
          :items="config.legendItems"
          toggleable
          :orientation="stackedLegend ? 'horizontal' : 'vertical'"
          v-bind="config.legend.props"
          :class="[stackedLegend && 'justify-center', chart.classes('legend')]"
        >
          <template v-if="$slots['legend-item']" #item="item">
            <slot name="legend-item" v-bind="item" />
          </template>
        </ChartLegend>
      </slot>
    </template>
    <slot name="parts" />
    <ChartTooltip v-if="config.tooltip" v-bind="config.tooltip">
      <template v-if="$slots.tooltip" #content="content">
        <slot name="tooltip" v-bind="content" />
      </template>
      <template v-if="$slots['tooltip-footer']" #footer="footer">
        <slot name="tooltip-footer" v-bind="footer" />
      </template>
    </ChartTooltip>
    <slot />
  </ChartSurface>
</template>

<script setup lang="ts">
import type { VNode } from 'vue'
import { computed } from 'vue'

import ChartLegend from '@/components/chart-legend/ChartLegend.vue'

import ChartSurface from './ChartSurface.vue'
import ChartTooltip from './ChartTooltip.vue'
import { useChartContext } from './context'
import type { ChartFrameConfig, ChartFrameSlots } from './frame'
import { toggleHiddenKey } from './series-config'

// Internal: what every chart root renders (cartesian and polar). The surface, the in-chart legend (clicking an item
// toggles its key in `hidden`), the root's generated `#parts`, the tooltip drawn from props over them, then the
// default slot. Root attributes fall through to the surface.

const props = defineProps<{
  width: number | `${number}%`
  height: number
  config: ChartFrameConfig
}>()

defineSlots<
  ChartFrameSlots & {
    /** Parts the root draws from props, under the tooltip. */
    parts?: () => VNode[]
    /** The root's own default slot, and anything it draws over the tooltip. */
    default?: () => VNode[]
  }
>()

const hidden = defineModel<string[]>('hidden', { required: true })

const chart = useChartContext('ChartFrame')

const toggle = (key: string) => {
  hidden.value = toggleHiddenKey(hidden.value, key)
}

const stackedLegend = computed(
  () => props.config.legend?.position === 'top' || props.config.legend?.position === 'bottom',
)
</script>
