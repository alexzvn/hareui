<template>
  <DatePicker
    class="w-72"
    name="date"
    label="Date"
    calendar-label="Event date"
    description="Replace the default calendar icon by passing a custom indicator."
  >
    <template #indicator>
      <Icon class="size-4" icon="gravity-ui:chevron-down" />
    </template>
  </DatePicker>
</template>

<script setup lang="ts">
import { DatePicker } from '@hareui/vue'
import { Icon } from '@iconify/vue'
</script>
