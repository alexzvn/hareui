<script setup lang="ts">
import { NativeSelect } from '@hareui/vue'
import { ref } from 'vue'

const timezone = ref('cet')
const items = [
  { value: 'utc', label: 'UTC' },
  { value: 'cet', label: 'Central European' },
  { value: 'est', label: 'US Eastern' },
  { value: 'pst', label: 'US Pacific' },
  { value: 'jst', label: 'Japan' },
]
</script>

<template>
  <div class="w-[220px] space-y-2">
    <NativeSelect
      v-model="timezone"
      full-width
      label="Time zone"
      name="timezone"
      placeholder="Pick a time zone"
      :items="items"
    />
    <p class="text-sm text-muted">
      Meetings shown in: {{ items.find((item) => item.value === timezone)?.label ?? 'not set' }}
    </p>
  </div>
</template>
