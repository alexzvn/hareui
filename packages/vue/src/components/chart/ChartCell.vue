<template>
  <!-- Renders nothing: the series draws the shape. -->
</template>

<script lang="ts">
import type { ClassValue } from '@/utils/tv'

export type ChartCellProps = {
  /** Fill of this row's shape. */
  fill?: string
  /** Opacity of the fill. */
  fillOpacity?: number
  /** Outline color. */
  stroke?: string
  /** Outline width, in px. */
  strokeWidth?: number
  /** Additional classes merged into the shape. */
  class?: ClassValue
}
</script>

<script setup lang="ts">
import { useChartCellRegistry } from './cells'

// Renders nothing: the enclosing series reads the style of its n-th cell for its n-th datum.
const props = defineProps<ChartCellProps>()

const registry = useChartCellRegistry()
if (!registry) throw new Error('ChartCell must be used inside ChartBar or ChartPie.')

registry.register(() => ({
  fill: props.fill,
  fillOpacity: props.fillOpacity,
  stroke: props.stroke,
  strokeWidth: props.strokeWidth,
  class: props.class,
}))
</script>
