<template>
  <div class="flex w-[276px] flex-col gap-2 rounded-2xl bg-surface p-3 shadow-sm">
    <span class="px-1 text-sm font-medium">Bakery alerts</span>
    <CellSwitch label="Order ready" variant="secondary" :default-value="true" />
    <CellSwitch label="Low stock" variant="secondary" :default-value="true" />
    <CellSwitch label="Daily sales summary" variant="secondary" />
  </div>
</template>

<script setup lang="ts">
import { CellSwitch } from '@hareui/vue'
</script>
