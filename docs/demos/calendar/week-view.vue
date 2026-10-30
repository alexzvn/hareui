<template>
  <div class="flex flex-col items-center gap-6">
    <Select
      class="w-40"
      label="Visible weeks"
      :items="weekOptions"
      :model-value="String(weeks)"
      @update:model-value="(value) => value && (weeks = Number(value))"
    />
    <Calendar aria-label="Week view" :visible-duration="{ weeks }" />
  </div>
</template>

<script setup lang="ts">
import type { ListBoxItem } from '@hareui/vue'
import { Calendar, Select } from '@hareui/vue'
import { ref } from 'vue'

const weekOptions: ListBoxItem[] = [
  { value: '1', label: '1 week' },
  { value: '2', label: '2 weeks' },
  { value: '3', label: '3 weeks' },
  { value: '4', label: '4 weeks' },
  { value: '5', label: '5 weeks' },
  { value: '6', label: '6 weeks' },
  { value: '8', label: '8 weeks' },
]

const weeks = ref(1)
</script>
