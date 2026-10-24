<script setup lang="ts">
import { CellSwitch } from '@hareui/vue'
</script>

<template>
  <div class="grid w-[260px] gap-1.5">
    <CellSwitch label="Heart rate alerts" :default-value="true" disabled />
    <CellSwitch label="Sleep tracking" disabled />
    <p class="mt-1 text-xs text-muted">Pair a watch to change these.</p>
  </div>
</template>
