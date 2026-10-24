<template>
  <DatePicker
    disabled
    class="w-72"
    name="date"
    label="Date"
    calendar-label="Event date"
    :model-value="today(getLocalTimeZone())"
    description="This date picker is disabled."
  />
</template>

<script setup lang="ts">
import { DatePicker } from '@hareui/vue'
import { getLocalTimeZone, today } from '@internationalized/date'
</script>
