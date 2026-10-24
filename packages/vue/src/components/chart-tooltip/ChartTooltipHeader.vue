<template>
  <div
    data-slot="chart-tooltip-header"
    :class="classes.header({ class: [ui()?.header, props.class] })"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

export type ChartTooltipHeaderProps = {
  /** Additional classes merged into the element. */
  class?: ClassValue
}

export type ChartTooltipHeaderSlots = {
  /** Header text, usually the x-axis label of the hovered point. */
  default?: () => VNode[]
}
</script>

<script setup lang="ts">
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipHeaderProps>()
defineSlots<ChartTooltipHeaderSlots>()

const { classes, ui } = useChartTooltipContext('Header')
</script>
