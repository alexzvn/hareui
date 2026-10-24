<template>
  <div data-slot="chart-tooltip-item" :class="classes.item({ class: [ui()?.item, props.class] })">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { ChartTooltipItemProps, ChartTooltipItemSlots } from './ChartTooltipItem.types'
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipItemProps>()
defineSlots<ChartTooltipItemSlots>()

const { classes, ui } = useChartTooltipContext('Item')
</script>
