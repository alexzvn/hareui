<script setup lang="ts">
import type { CalendarDate, DateValue } from '@internationalized/date'
import { Description, RangeCalendar } from 'herouse'
import { getLocalTimeZone, today } from '@internationalized/date'

const now = today(getLocalTimeZone())

function isDateUnavailable(date: DateValue, anchorDate: CalendarDate | null) {
  return anchorDate != null && Math.abs(date.compare(anchorDate)) > 7
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <RangeCalendar aria-label="Trip dates" :is-date-unavailable="isDateUnavailable" :min-value="now" />
    <Description class="text-center">
      After selecting a start date, only dates within 7 days are available
    </Description>
  </div>
</template>
