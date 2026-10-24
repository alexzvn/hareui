<template>
  <span
    data-slot="chart-tooltip-indicator"
    aria-hidden="true"
    :class="classes.indicator({ class: [ui()?.indicator, props.class] })"
    :style="color ? { backgroundColor: color } : undefined"
  />
</template>

<script lang="ts">
export interface ChartTooltipIndicatorProps {
  /** CSS color of the marker, e.g. `var(--chart-1)`. */
  color?: string
  /** Additional classes merged into the element. */
  class?: any
}
</script>

<script setup lang="ts">
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipIndicatorProps>()

const { classes, ui } = useChartTooltipContext('Indicator')
</script>
