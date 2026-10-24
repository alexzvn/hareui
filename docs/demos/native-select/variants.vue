<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'

const items = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
]
</script>

<template>
  <div class="grid w-[260px] gap-4">
    <NativeSelect full-width label="Priority (primary)" default-value="medium" :items="items" />
    <div class="rounded-2xl bg-surface p-4">
      <NativeSelect
        full-width
        variant="secondary"
        label="Priority (secondary, on a surface)"
        default-value="high"
        :items="items"
      />
    </div>
  </div>
</template>
