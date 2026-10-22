<script lang="ts">
export interface ChartTooltipLabelProps {
  /** Additional classes merged into the element. */
  class?: any
}

export interface ChartTooltipLabelSlots {
  /** Series name. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipLabelProps>()
defineSlots<ChartTooltipLabelSlots>()

const { classes, ui } = useChartTooltipContext('Label')
</script>

<template>
  <span data-slot="chart-tooltip-label" :class="classes.label({ class: [ui()?.label, props.class] })">
    <slot />
  </span>
</template>
