<script setup lang="ts">
import { computed } from 'vue'

import { useChartContext } from './context'
import type { ChartLayerName } from './types'

// Internal: renders its slot into one z-layer `<g>` of the chart's SVG, so parts stack in a fixed order
// (grid, series, axes, cursor, labels) whatever their order in the template.

const props = defineProps<{ name: ChartLayerName }>()

const chart = useChartContext('ChartLayer')
const target = computed(() => chart.layers[props.name])
</script>

<template>
  <Teleport v-if="target" :to="target">
    <slot />
  </Teleport>
</template>
