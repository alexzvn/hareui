<script lang="ts">
export interface ChartTooltipItemProps {
  /** Additional classes merged into the element. */
  class?: any
}

export interface ChartTooltipItemSlots {
  /** Row content: an indicator, a label and a value. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipItemProps>()
defineSlots<ChartTooltipItemSlots>()

const { classes, ui } = useChartTooltipContext('Item')
</script>

<template>
  <div data-slot="chart-tooltip-item" :class="classes.item({ class: [ui()?.item, props.class] })">
    <slot />
  </div>
</template>
