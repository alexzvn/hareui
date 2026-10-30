<template>
  <DateRangePicker
    class="w-80"
    full-width
    start-name="startDate"
    end-name="endDate"
    label="Trip dates"
    calendar-label="Trip dates"
    description="Replace the default calendar icon by passing custom children."
  >
    <template #indicator>
      <Icon class="size-4" icon="gravity-ui:chevron-down" />
    </template>
  </DateRangePicker>
</template>

<script setup lang="ts">
import { DateRangePicker } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
