<template>
  <span
    data-slot="chart-tooltip-label"
    :class="classes.label({ class: [ui()?.label, props.class] })"
  >
    <slot />
  </span>
</template>

<script lang="ts">
export type ChartTooltipLabelProps = {
  /** Additional classes merged into the element. */
  class?: any
}

export type ChartTooltipLabelSlots = {
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
