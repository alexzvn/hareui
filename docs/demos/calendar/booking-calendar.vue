<template>
  <div class="flex flex-col items-center gap-4">
    <Calendar
      aria-label="Booking date"
      v-model="selectedDate"
      :is-date-unavailable="isDateUnavailable"
      :min-value="minValue"
      :indicator="indicator"
    />

    <div class="flex flex-col gap-2 text-center">
      <div class="flex items-center justify-center gap-4 text-xs text-muted">
        <span class="flex items-center gap-1">
          <span class="size-2 rounded-full bg-muted" /> Has bookings
        </span>
        <span class="flex items-center gap-1">
          <span class="size-2 rounded-full bg-default" /> Weekend/Unavailable
        </span>
      </div>
      <Button v-if="selectedDate" size="sm" variant="primary">
        Book {{ selectedDate.toString() }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button, Calendar } from '@hareui/vue'
import type { CalendarDate, DateValue } from '@internationalized/date'
import { getLocalTimeZone, isWeekend, today } from '@internationalized/date'
import { computed, shallowRef } from 'vue'

const selectedDate = shallowRef<CalendarDate | null>(null)
const bookedDates = [5, 6, 12, 13, 14, 20]

const isDateUnavailable = (date: DateValue) => {
  return isWeekend(date, 'en-US') || bookedDates.includes(date.day)
}

const indicator = (date: DateValue) => {
  return !isWeekend(date, 'en-US') && bookedDates.includes(date.day)
}

const minValue = computed(() => today(getLocalTimeZone()))
</script>
