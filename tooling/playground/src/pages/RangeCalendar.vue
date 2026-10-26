<script setup lang="ts">
import type { DateRange } from '@hareui/vue'
import type { DateValue } from '@internationalized/date'
import { CalendarDate, isWeekend, parseDate } from '@internationalized/date'
import { RangeCalendar } from '@hareui/vue'
import { ref } from 'vue'

const focused = parseDate('2025-01-15')
const controlledValue = ref<DateRange | undefined>({ start: parseDate('2025-01-10'), end: parseDate('2025-01-15') })
const controlledPlaceholder = ref<DateValue>(focused)
</script>

<template>
  <div class="flex flex-col gap-10">
    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Basic
      </h2>
      <RangeCalendar aria-label="Event dates" :default-placeholder="focused" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Default Value
      </h2>
      <RangeCalendar aria-label="Event dates" :default-placeholder="focused" :default-value="{ start: parseDate('2025-01-10'), end: parseDate('2025-01-15') }" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Disabled / Read Only
      </h2>
      <div class="flex gap-10">
        <RangeCalendar aria-label="Event dates" :default-placeholder="focused" disabled />
        <RangeCalendar aria-label="Event dates" :default-placeholder="focused" :default-value="{ start: parseDate('2025-01-10'), end: parseDate('2025-01-15') }" readonly />
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Min / Max Dates
      </h2>
      <RangeCalendar aria-label="Event dates" :default-placeholder="focused" :min-value="new CalendarDate(2025, 1, 5)" :max-value="new CalendarDate(2025, 1, 25)" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Unavailable Dates
      </h2>
      <RangeCalendar aria-label="Event dates" :default-placeholder="focused" :is-date-unavailable="(date: DateValue) => isWeekend(date, 'en-US')" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Allow Non-Contiguous Ranges
      </h2>
      <RangeCalendar aria-label="Event dates" :default-placeholder="focused" :is-date-unavailable="(date: DateValue) => isWeekend(date, 'en-US')" allow-non-contiguous-ranges />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Maximum Days
      </h2>
      <RangeCalendar aria-label="Event dates" :default-placeholder="focused" :maximum-days="5" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Weeks in Month (fixed 6 weeks)
      </h2>
      <RangeCalendar aria-label="Event dates" :default-placeholder="focused" fixed-weeks />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Year Picker
      </h2>
      <RangeCalendar aria-label="Event dates" :default-placeholder="focused" year-picker />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Controlled
      </h2>
      <RangeCalendar aria-label="Event dates" v-model="controlledValue" v-model:placeholder="controlledPlaceholder" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Cell Indicators
      </h2>
      <RangeCalendar aria-label="Event dates" :default-placeholder="focused" :default-value="{ start: parseDate('2025-01-10'), end: parseDate('2025-01-15') }" :indicator="(date: DateValue) => [3, 15, 22].includes(date.day)" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Custom Navigation Icons
      </h2>
      <RangeCalendar aria-label="Event dates" :default-placeholder="focused">
        <template #navIcon="{ direction }">
          <span class="text-xs font-bold">{{ direction === 'previous' ? '<' : '>' }}</span>
        </template>
      </RangeCalendar>
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        International Calendar (Indian)
      </h2>
      <RangeCalendar aria-label="Event dates" locale="en-US-u-ca-indian" :default-placeholder="focused" />
    </section>
  </div>
</template>
