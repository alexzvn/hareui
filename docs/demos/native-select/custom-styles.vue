<template>
  <div class="w-[220px]">
    <NativeSelect
      full-width
      label="Appearance"
      default-value="system"
      :items="items"
      :ui="{ select: 'rounded-full ps-4 font-medium', indicator: 'end-3 text-accent' }"
    />
  </div>
</template>

<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'

const items = [
  { value: 'system', label: 'Match system' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
]
</script>
