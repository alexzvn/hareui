<template>
  <Widget class="w-full max-w-[900px]" title="This Quarter" description="vs last quarter">
    <MetricGroup class="bg-transparent shadow-none">
      <Metric title="Bookings" :value="1204" :trend="{ label: '+6.0%' }" />
      <Metric
        title="Revenue"
        :value="312900"
        :format="{ format: 'currency', currency: 'USD', notation: 'compact' }"
        :trend="{ label: '+3.8%' }"
      />
      <Metric
        title="Retention"
        :value="0.941"
        :format="{ format: 'percent', maximumFractionDigits: 1 }"
        :trend="{ label: '-0.3%', trend: 'down' }"
      />
    </MetricGroup>
  </Widget>
</template>

<script setup lang="ts">
import { Metric, MetricGroup, Widget } from '@hareui/vue'
</script>
