<template>
  <div class="flex flex-col gap-3">
    <div v-for="value in values" :key="value" class="flex items-baseline gap-4">
      <span class="w-28 text-xs text-muted">{{ value.toLocaleString('en-US') }}</span>
      <NumberValue class="text-2xl font-semibold" :value="value" notation="compact" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NumberValue } from '@hareui/vue'

const values = [870, 5_310, 64_900, 2_480_000, 7_150_000_000]
</script>
