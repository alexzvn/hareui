<script setup lang="ts">
import type { DateRangeValue } from '@hareui/vue'
import { CalendarDate, CalendarDateTime, getLocalTimeZone, isWeekend, today } from '@internationalized/date'
import { DateRangePicker } from '@hareui/vue'
import { shallowRef } from 'vue'

const value = shallowRef<DateRangeValue | null>({ start: new CalendarDate(2024, 3, 15), end: new CalendarDate(2024, 3, 20) })
const todayDate = today(getLocalTimeZone())
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      DateRangePicker
    </h1>
    <section class="flex flex-wrap items-start gap-6">
      <DateRangePicker v-model="value" data-test="controlled" class="w-80" full-width label="Trip dates" calendar-label="Trip dates" description="Pick a range" />
      <p data-test="value">
        {{ value ? `${value.start} -> ${value.end}` : '(empty)' }}
      </p>
    </section>
    <section class="flex flex-wrap items-start gap-6">
      <DateRangePicker class="w-80" full-width label="Primary" calendar-label="Dates" />
      <DateRangePicker class="w-80" full-width label="Secondary" variant="secondary" calendar-label="Dates" :default-value="{ start: new CalendarDate(2024, 6, 1), end: new CalendarDate(2024, 6, 7) }" />
      <DateRangePicker class="w-80" full-width label="Required" required calendar-label="Dates" />
      <DateRangePicker class="w-80" full-width label="Disabled" disabled calendar-label="Dates" :default-value="{ start: new CalendarDate(2024, 3, 15), end: new CalendarDate(2024, 3, 20) }" />
      <DateRangePicker class="w-80" full-width label="Read only" readonly calendar-label="Dates" :default-value="{ start: new CalendarDate(2024, 3, 15), end: new CalendarDate(2024, 3, 20) }" />
      <DateRangePicker class="w-80" full-width label="Invalid" invalid calendar-label="Dates" error-message="Select a valid range" :default-value="{ start: new CalendarDate(2024, 3, 15), end: new CalendarDate(2024, 3, 20) }" />
      <DateRangePicker class="w-80" full-width label="Min today, no weekends" calendar-label="Dates" :min-value="todayDate" :is-date-unavailable="(d) => isWeekend(d, 'en-US')" validation-behavior="aria" />
    </section>
    <section class="flex flex-wrap items-start gap-6">
      <DateRangePicker
        class="w-full max-w-2xs min-w-80"
        label="Input container, seconds"
        calendar-label="Dates"
        input-container
        granularity="second"
        :hour-cycle="12"
        :default-value="{ start: new CalendarDateTime(2026, 2, 3, 8, 45), end: new CalendarDateTime(2026, 2, 10, 18, 45) }"
      />
      <DateRangePicker class="w-80" full-width label="Custom separator and :ui" calendar-label="Dates" :ui="{ group: 'rounded-xl', rangeSeparator: 'text-accent' }">
        <template #separator>
          →
        </template>
      </DateRangePicker>
    </section>
    <section class="w-[480px]">
      <DateRangePicker label="Full width" full-width calendar-label="Dates" :default-value="{ start: new CalendarDate(2024, 3, 15), end: new CalendarDate(2024, 3, 20) }" />
    </section>
  </div>
</template>
