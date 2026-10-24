<template>
  <div data-slot="chart-tooltip-item" :class="classes.item({ class: [ui()?.item, props.class] })">
    <slot />
  </div>
</template>

<script lang="ts">
import type { VNode } from 'vue'

import type { ClassValue } from '@/utils/tv'

export type ChartTooltipItemProps = {
  /** Additional classes merged into the element. */
  class?: ClassValue
}

export type ChartTooltipItemSlots = {
  /** Row content: an indicator, a label and a value. */
  default?: () => VNode[]
}
</script>

<script setup lang="ts">
import { useChartTooltipContext } from './context'

const props = defineProps<ChartTooltipItemProps>()
defineSlots<ChartTooltipItemSlots>()

const { classes, ui } = useChartTooltipContext('Item')
</script>
