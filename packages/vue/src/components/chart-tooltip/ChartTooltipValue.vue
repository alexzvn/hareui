<template>
  <span
    data-slot="chart-tooltip-value"
    :class="classes.value({ class: [ui()?.value, props.class] })"
  >
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { ChartTooltipValueProps, ChartTooltipValueSlots } from './ChartTooltipValue.types'
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipValueProps>()
defineSlots<ChartTooltipValueSlots>()

const { classes, ui } = useChartTooltipContext('Value')
</script>
