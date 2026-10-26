<template>
  <!-- Same foreignObject + Teleport hop as ChartTooltip: parts mount inside the <svg>. -->
  <foreignObject v-if="chart.overlay.value" width="0" height="0">
    <Teleport :to="chart.overlay.value">
      <div data-slot="chart-center" :class="chart.classes('center')" :style="style">
        <slot />
      </div>
    </Teleport>
  </foreignObject>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { useChartContext } from './context'
import { usePolarContext } from './polar-context'

// Internal: the `#center` slot of PieChart and RadialChart. HTML content centered on the polar center (which
// moves with `cx`/`cy` and the margins), placed in the chart's HTML overlay next to the tooltip.

const chart = useChartContext('ChartPolarCenter')
const polar = usePolarContext('ChartPolarCenter')

const style = computed(() => ({ left: `${polar.cx.value}px`, top: `${polar.cy.value}px` }))
</script>
