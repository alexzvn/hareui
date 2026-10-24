<template>
  <div
    data-slot="chart-tooltip-header"
    :class="classes.header({ class: [ui()?.header, props.class] })"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ChartTooltipHeaderProps, ChartTooltipHeaderSlots } from './ChartTooltipHeader.types'
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipHeaderProps>()
defineSlots<ChartTooltipHeaderSlots>()

const { classes, ui } = useChartTooltipContext('Header')
</script>
