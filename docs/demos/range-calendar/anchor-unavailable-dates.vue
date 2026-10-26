<template>
  <div class="flex flex-col items-center gap-4">
    <RangeCalendar
      aria-label="Trip dates"
      :is-date-unavailable="isDateUnavailable"
      :min-value="now"
    />
    <Description class="text-center">
      After selecting a start date, only dates within 7 days are available
    </Description>
  </div>
</template>

<script setup lang="ts">
import { Description, RangeCalendar } from '@hareui/vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, today } from '@internationalized/date'

const now = today(getLocalTimeZone())

const isDateUnavailable = (date: DateValue, anchorDate: DateValue | null) => {
  return anchorDate != null && Math.abs(date.compare(anchorDate)) > 7
}
</script>
