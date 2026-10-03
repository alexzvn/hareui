<script setup lang="ts">
import { RangeCalendar, Select } from 'herouse'
import { ref } from 'vue'

const dayOptions = [
  { value: '1', label: '1 day' },
  { value: '5', label: '5 days' },
  { value: '7', label: '7 days' },
  { value: '8', label: '8 days' },
  { value: '10', label: '10 days' },
  { value: '14', label: '14 days' },
  { value: '21', label: '21 days' },
]

const days = ref(5)
</script>

<template>
  <div class="flex flex-col items-center gap-6">
    <Select
      class="w-40"
      label="Visible days"
      :items="dayOptions"
      :model-value="String(days)"
      @update:model-value="(value) => value && (days = Number(value))"
    />
    <RangeCalendar :key="days" aria-label="Trip dates" :visible-duration="{ days }" />
  </div>
</template>
