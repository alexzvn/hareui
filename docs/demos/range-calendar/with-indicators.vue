<script setup lang="ts">
import { RangeCalendar } from '@hareui/vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, isToday } from '@internationalized/date'

const datesWithEvents = [3, 7, 12, 15, 21, 28]

function indicator(date: DateValue) {
  return isToday(date, getLocalTimeZone()) || datesWithEvents.includes(date.day)
}
</script>

<template>
  <RangeCalendar aria-label="Trip dates" :indicator="indicator" />
</template>
