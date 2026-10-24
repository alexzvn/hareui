<template>
  <!-- Renders nothing: the series draws the shape. -->
</template>

<script setup lang="ts">
import { useChartCellRegistry } from './cells'
import type { ChartCellProps } from './ChartCell.types'

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
