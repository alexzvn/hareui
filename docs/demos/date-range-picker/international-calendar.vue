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

<script setup lang="ts">
import { DateRangePicker } from '@hareui/vue'
import { getLocalTimeZone, today } from '@internationalized/date'

const start = today(getLocalTimeZone())
</script>
