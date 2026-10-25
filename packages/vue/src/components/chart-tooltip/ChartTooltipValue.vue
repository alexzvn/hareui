<template>
  <span data-slot="chart-tooltip-value" :class="classes.value({ override: props.class })">
    <slot />
  </span>
</template>

<script setup lang="ts">
import type { ChartTooltipValueProps, ChartTooltipValueSlots } from './ChartTooltipValue.types'
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipValueProps>()
defineSlots<ChartTooltipValueSlots>()

const { classes } = useChartTooltipContext('Value')
</script>
