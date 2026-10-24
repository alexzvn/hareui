<template>
  <span
    data-slot="chart-tooltip-label"
    :class="classes.label({ class: [ui()?.label, props.class] })"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { ChartTooltipLabelProps, ChartTooltipLabelSlots } from './ChartTooltipLabel.types'
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipLabelProps>()
defineSlots<ChartTooltipLabelSlots>()

const { classes, ui } = useChartTooltipContext('Label')
</script>
