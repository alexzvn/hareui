<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'

const items = [
  { value: 'low', label: 'Low (96 kbps)' },
  { value: 'normal', label: 'Normal (160 kbps)' },
  { value: 'high', label: 'High (320 kbps)' },
  { value: 'lossless', label: 'Lossless' },
]
</script>

<template>
  <div class="w-[220px]">
    <NativeSelect full-width label="Streaming quality" name="quality" default-value="high" :items="items" />
  </div>
</template>
