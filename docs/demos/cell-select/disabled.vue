<script setup lang="ts">
import { CellSelect } from '@hareui/vue'

const intervals = [
  { value: '15m', label: 'Every 15 min' },
  { value: '1h', label: 'Every hour' },
  { value: 'manual', label: 'Manually' },
]
</script>

<template>
  <div class="w-72">
    <CellSelect default-value="1h" disabled :items="intervals" label="Auto sync" />
  </div>
</template>
