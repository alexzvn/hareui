<template>
  <span
    data-slot="chart-tooltip-value"
    :class="classes.value({ class: [ui()?.value, props.class] })"
  >
    <slot />
  </span>
</template>

<script lang="ts">
import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

export type ChartTooltipValueProps = {
  /** Additional classes merged into the element. */
  class?: ClassValue
}

export type ChartTooltipValueSlots = {
  /** Series value, already formatted. */
  default?: () => VNode[]
}
</script>

<script setup lang="ts">
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipValueProps>()
defineSlots<ChartTooltipValueSlots>()

const { classes, ui } = useChartTooltipContext('Value')
</script>
