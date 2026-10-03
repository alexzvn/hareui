<script setup lang="ts">
import type { DateRangeValue } from '@hareui/vue'
import { getLocalTimeZone, today } from '@internationalized/date'
import { DateRangePicker } from '@hareui/vue'
import { computed, shallowRef } from 'vue'

const value = shallowRef<DateRangeValue | null>(null)
const currentDate = today(getLocalTimeZone())
const isInvalid = computed(() => value.value != null && (value.value.start.compare(currentDate) < 0 || value.value.end.compare(value.value.start) < 0))
</script>

<template>
  <DateRangePicker
    v-model="value"
    required
    class="w-80"
    full-width
    :invalid="isInvalid"
    :min-value="currentDate"
    start-name="startDate"
    end-name="endDate"
    label="Booking period"
    calendar-label="Booking period"
    error-message="Select a valid range starting today or later."
  />
</template>
