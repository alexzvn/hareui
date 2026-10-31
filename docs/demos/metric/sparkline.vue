<template>
  <Metric
    class="w-full max-w-96"
    title="Net Revenue"
    :value="91340"
    :format="{ format: 'currency', currency: 'EUR', maximumFractionDigits: 0 }"
    :trend="{ label: '+5.2%' }"
  >
    <template #chart>
      <AreaChart
        :data="data"
        index="day"
        :series="{ value: { name: 'Net revenue', color: 'var(--success)' } }"
        sparkline
        :tooltip="{ cursor: false, panel: false }"
        aria-label="Net revenue over the last 12 days"
        :height="80"
        :margin="{ top: 4, right: 0, bottom: 0, left: 0 }"
      />
    </template>
  </Metric>
</template>

<script setup lang="ts">
import { Metric } from '@hareui/vue'
import { AreaChart } from '@hareui/vue/charts'

const data = [5200, 6100, 5600, 6800, 7400, 6600, 7900, 8600, 8100, 9300, 9800, 10400].map(
  (value, index) => ({
    day: `Day ${index + 1}`,
    value,
  }),
)
</script>
