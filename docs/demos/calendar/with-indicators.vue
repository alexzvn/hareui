<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, isToday } from '@internationalized/date'
import { Calendar } from '@hareui/vue'

const datesWithEvents = [3, 7, 12, 15, 21, 28]

function indicator(date: DateValue) {
  return isToday(date, getLocalTimeZone()) || datesWithEvents.includes(date.day)
}
</script>

<template>
  <Calendar aria-label="Event date" :indicator="indicator" />
</template>
