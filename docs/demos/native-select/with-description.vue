<template>
  <div class="w-[220px]">
    <NativeSelect
      full-width
      label="Email digest"
      name="digest"
      default-value="weekly"
      description="A summary of activity in your projects"
      :items="items"
    />
  </div>
</template>

<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'

const items = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'never', label: 'Never' },
]
</script>
