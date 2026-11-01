<template>
  <Metric class="w-full max-w-80" :value="5.75">
    <template #title>Avg. Session <span class="text-muted/70">· Web app</span></template>
    <template #value="{ formatted }">
      {{ formatted }} <span class="text-sm font-medium text-muted">min</span>
    </template>
    <template #trend>
      <TrendChip trend="up" label="+0.4">
        <template #suffix>vs last week</template>
      </TrendChip>
    </template>
  </Metric>
</template>

<script setup lang="ts">
import { Metric, TrendChip } from '@hareui/vue'
</script>
