<script setup lang="ts">
import { getLocalTimeZone, today } from '@internationalized/date'
import { DateRangePicker } from 'herouse'

const start = today(getLocalTimeZone())
</script>

<template>
  <DateRangePicker
    class="w-80"
    full-width
    locale="hi-IN-u-ca-indian"
    start-name="startDate"
    end-name="endDate"
    label="Trip dates"
    calendar-label="Trip dates"
    :default-value="{ start, end: start.add({ days: 7 }) }"
  />
</template>
