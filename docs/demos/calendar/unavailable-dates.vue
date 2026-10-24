<script setup lang="ts">
import { Calendar, Description } from '@hareui/vue'
import type { DateValue } from '@internationalized/date'
import { isWeekend } from '@internationalized/date'

function isDateUnavailable(date: DateValue) {
  return isWeekend(date, 'en-US')
}
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar aria-label="Appointment date" :is-date-unavailable="isDateUnavailable" />
    <Description class="text-center"> Weekends are unavailable </Description>
  </div>
</template>
