<template>
  <div class="flex flex-col items-center gap-4">
    <RangeCalendar
      aria-label="Trip dates"
      :default-value="{ start: now.add({ days: 6 }), end: now.add({ days: 9 }) }"
      first-day-of-week="mon"
      :is-date-unavailable="isDateUnavailable"
    />
    <Description class="text-center"> Some days are unavailable </Description>
  </div>
</template>

<script setup lang="ts">
import { Description, RangeCalendar } from '@hareui/vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'

const now = today(getLocalTimeZone())
const blockedRanges = [
  [now.add({ days: 2 }), now.add({ days: 5 })],
  [now.add({ days: 12 }), now.add({ days: 13 })],
] as const

function isDateUnavailable(date: DateValue) {
  return blockedRanges.some(([start, end]) => date.compare(start) >= 0 && date.compare(end) <= 0)
}
</script>
