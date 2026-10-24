<script setup lang="ts">
import type { DateRange } from '@hareui/vue'
import { Button, RangeCalendar } from '@hareui/vue'
import type { DateValue } from '@internationalized/date'
import { getLocalTimeZone, isWeekend, today } from '@internationalized/date'
import { computed, shallowRef } from 'vue'

const selectedRange = shallowRef<DateRange | undefined>()
const blockedDates = [5, 6, 12, 13, 14, 20]

function isDateUnavailable(date: DateValue) {
  return isWeekend(date, 'en-US') || blockedDates.includes(date.day)
}

function indicator(date: DateValue) {
  return !isWeekend(date, 'en-US') && blockedDates.includes(date.day)
}

const minValue = computed(() => today(getLocalTimeZone()))
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <RangeCalendar
      aria-label="Booking range"
      v-model="selectedRange"
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
      <Button v-if="selectedRange?.start && selectedRange?.end" size="sm" variant="primary">
        Book {{ selectedRange.start.toString() }} -&gt; {{ selectedRange.end.toString() }}
      </Button>
    </div>
  </div>
</template>
