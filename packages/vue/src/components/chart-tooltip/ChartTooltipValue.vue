<script lang="ts">
export interface ChartTooltipValueProps {
  /** Additional classes merged into the element. */
  class?: any
}

export interface ChartTooltipValueSlots {
  /** Series value, already formatted. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipValueProps>()
defineSlots<ChartTooltipValueSlots>()

const { classes, ui } = useChartTooltipContext('Value')
</script>

<template>
  <span data-slot="chart-tooltip-value" :class="classes.value({ class: [ui()?.value, props.class] })">
    <slot />
  </span>
</template>
