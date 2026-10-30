<template>
  <div class="w-72">
    <CellSelect default-value="2" :items="tabSizes" label="Tab size" />
  </div>
</template>

<script setup lang="ts">
import { CellSelect } from '@hareui/vue'

const tabSizes = [
  { value: '2', label: '2 spaces' },
  { value: '4', label: '4 spaces' },
  { value: '8', label: '8 spaces' },
]
</script>
