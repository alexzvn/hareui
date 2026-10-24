<template>
  <span
    data-slot="chart-tooltip-label"
    :class="classes.label({ class: [ui()?.label, props.class] })"
  >
    <slot />
  </span>
</template>

<script lang="ts">
import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

export type ChartTooltipLabelProps = {
  /** Additional classes merged into the element. */
  class?: ClassValue
}

export type ChartTooltipLabelSlots = {
  /** Series name. */
  default?: () => VNode[]
}
</script>

<script setup lang="ts">
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipLabelProps>()
defineSlots<ChartTooltipLabelSlots>()

const { classes, ui } = useChartTooltipContext('Label')
</script>
