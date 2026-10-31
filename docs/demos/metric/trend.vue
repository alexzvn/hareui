<template>
  <div class="grid w-full max-w-[900px] grid-cols-1 gap-3 sm:grid-cols-3">
    <Metric
      title="Gross Sales"
      :value="48210"
      :format="{ format: 'currency', currency: 'USD', maximumFractionDigits: 0 }"
      :trend="{ value: '+8.1%', trend: 'up' }"
    />
    <Metric
      title="Conversion Rate"
      :value="0.034"
      :format="{ format: 'percent', maximumFractionDigits: 1 }"
      :trend="{ value: '-0.6%', trend: 'down' }"
    />
    <Metric title="Items per Order" :value="3.2" :trend="{ value: '0.0%', trend: 'neutral' }" />
  </div>
</template>

<script setup lang="ts">
import { Metric } from '@hareui/vue'
</script>
