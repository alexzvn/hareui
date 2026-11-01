<template>
  <div class="flex flex-wrap items-baseline gap-6 text-xl font-semibold">
    <NumberValue :value="21.5" format="unit" unit="celsius" />
    <NumberValue :value="6.2" format="unit" unit="kilometer" />
    <NumberValue :value="740" format="unit" unit="megabyte" />
    <NumberValue
      :value="95"
      format="unit"
      unit="kilometer-per-hour"
      :options="{ unitDisplay: 'long' }"
    />
  </div>
</template>

<script setup lang="ts">
import { NumberValue } from '@hareui/vue'
</script>
