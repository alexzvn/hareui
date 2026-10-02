<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import { DateRangePicker } from 'herouse'

const start = today(getLocalTimeZone())
</script>

<template>
  <DateRangePicker
    disabled
    class="w-80"
    full-width
    start-name="startDate"
    end-name="endDate"
    label="Trip dates"
    calendar-label="Trip dates"
    :model-value="{ start, end: start.add({ days: 4 }) }"
    description="This date range picker is disabled."
  />
</template>
