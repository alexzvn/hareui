<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import { DatePicker } from 'herouse'
import { ref } from 'vue'

const date = ref<DateValue | null>(new CalendarDate(2024, 3, 15))
const todayDate = today(getLocalTimeZone())
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      DatePicker
    </h1>
    <section class="flex flex-wrap items-start gap-6">
      <DatePicker v-model="date" data-test="controlled" label="Date" calendar-label="Event date" description="Pick a date" />
      <p data-test="value">
        {{ date?.toString() }}
      </p>
      <DatePicker label="Secondary" variant="secondary" calendar-label="Date" :default-value="new CalendarDate(2024, 6, 1)" />
      <DatePicker label="Granularity: hour" granularity="hour" calendar-label="Date" :default-value="todayDate" />
    </section>
    <section class="flex flex-wrap items-start gap-6">
      <DatePicker label="Required" required calendar-label="Date" />
      <DatePicker label="Disabled" disabled calendar-label="Date" :default-value="new CalendarDate(2024, 3, 15)" />
      <DatePicker label="Read only" readonly calendar-label="Date" :default-value="new CalendarDate(2024, 3, 15)" />
      <DatePicker label="Invalid" invalid calendar-label="Date" :default-value="new CalendarDate(2024, 3, 15)" error-message="Date must be in the future" />
      <DatePicker label="Min/Max" calendar-label="Date" :min-value="todayDate" :max-value="todayDate.add({ days: 30 })" />
    </section>
    <section class="w-[400px]">
      <DatePicker label="Full width" full-width calendar-label="Date" :default-value="new CalendarDate(2024, 3, 15)" />
    </section>
  </div>
</template>
