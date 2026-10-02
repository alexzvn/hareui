<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date'
import { DateField } from 'herouse'
import { ref } from 'vue'

const date = ref<DateValue | null>(new CalendarDate(2024, 3, 15))
const todayDate = today(getLocalTimeZone())
</script>

<template>
  <div class="flex flex-col gap-8 p-8">
    <h1 class="text-2xl font-semibold">
      DateField
    </h1>
    <section class="flex flex-wrap items-start gap-6">
      <DateField v-model="date" data-test="controlled" label="Date" description="Enter your birth date" />
      <p data-test="value">
        {{ date?.toString() }}
      </p>
      <DateField label="Secondary" variant="secondary" :default-value="todayDate" />
      <DateField label="Granularity: second" granularity="second" :default-value="new CalendarDate(2024, 3, 15)" />
    </section>
    <section class="flex flex-wrap items-start gap-6">
      <DateField label="Required" required />
      <DateField label="Disabled" disabled :default-value="todayDate" />
      <DateField label="Read only" readonly :default-value="todayDate" />
      <DateField label="Invalid" invalid :default-value="todayDate" error-message="Date must be in the future" />
      <DateField label="Min/Max" :min-value="todayDate" :max-value="todayDate.add({ days: 30 })" />
    </section>
    <section class="w-[400px]">
      <DateField label="Full width" full-width :default-value="todayDate" />
    </section>
  </div>
</template>
