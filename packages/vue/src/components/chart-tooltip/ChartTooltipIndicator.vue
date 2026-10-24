<template>
  <span
    data-slot="chart-tooltip-indicator"
    aria-hidden="true"
    :class="classes.indicator({ class: [ui()?.indicator, props.class] })"
    :style="color ? { backgroundColor: color } : undefined"
  />
</template>

<script setup lang="ts">
import type { ChartTooltipIndicatorProps } from './ChartTooltipIndicator.types'
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipIndicatorProps>()

const { classes, ui } = useChartTooltipContext('Indicator')
</script>
