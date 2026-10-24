<script lang="ts">
export interface ChartTooltipHeaderProps {
  /** Additional classes merged into the element. */
  class?: any
}

export interface ChartTooltipHeaderSlots {
  /** Header text, usually the x-axis label of the hovered point. */
  default?: () => any
}
</script>

<script setup lang="ts">
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipHeaderProps>()
defineSlots<ChartTooltipHeaderSlots>()

const { classes, ui } = useChartTooltipContext('Header')
</script>

<template>
  <div data-slot="chart-tooltip-header" :class="classes.header({ class: [ui()?.header, props.class] })">
    <slot />
  </div>
</template>
