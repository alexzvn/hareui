<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarDate, isWeekend, parseDate } from '@internationalized/date'
import { Calendar } from '@hareui/vue'
import { ref } from 'vue'

const focused = parseDate('2025-01-15')
const controlledValue = ref<DateValue | null | undefined>(parseDate('2025-01-15'))
const controlledPlaceholder = ref<DateValue>(focused)
</script>

<template>
  <div class="flex flex-col gap-10">
    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Basic
      </h2>
      <Calendar aria-label="Event date" :default-placeholder="focused" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Default Value
      </h2>
      <Calendar aria-label="Event date" :default-placeholder="focused" :default-value="parseDate('2025-01-15')" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Disabled / Read Only
      </h2>
      <div class="flex gap-10">
        <Calendar aria-label="Event date" :default-placeholder="focused" disabled />
        <Calendar aria-label="Event date" :default-placeholder="focused" :default-value="parseDate('2025-01-15')" readonly />
      </div>
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Min / Max Dates
      </h2>
      <Calendar aria-label="Event date" :default-placeholder="focused" :min-value="new CalendarDate(2025, 1, 10)" :max-value="new CalendarDate(2025, 1, 20)" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Unavailable Dates
      </h2>
      <Calendar aria-label="Event date" :default-placeholder="focused" :is-date-unavailable="(date: DateValue) => isWeekend(date, 'en-US')" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Weeks in Month (fixed 6 weeks)
      </h2>
      <Calendar aria-label="Event date" :default-placeholder="focused" fixed-weeks />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Multiple Selection
      </h2>
      <Calendar aria-label="Event dates" :default-placeholder="focused" selection-mode="multiple" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Year Picker
      </h2>
      <Calendar aria-label="Event date" :default-placeholder="focused" year-picker />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Controlled
      </h2>
      <Calendar aria-label="Event date" v-model="controlledValue" v-model:placeholder="controlledPlaceholder" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Cell Indicators
      </h2>
      <Calendar aria-label="Event date" :default-placeholder="focused" :default-value="parseDate('2025-01-15')" :indicator="(date: DateValue) => [3, 15, 22].includes(date.day)" />
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        Custom Navigation Icons
      </h2>
      <Calendar aria-label="Event date" :default-placeholder="focused">
        <template #navIcon="{ direction }">
          <span class="text-xs font-bold">{{ direction === 'previous' ? '<' : '>' }}</span>
        </template>
      </Calendar>
    </section>

    <section>
      <h2 class="mb-3 text-sm font-semibold text-muted">
        International Calendar (Indian)
      </h2>
      <Calendar aria-label="Event date" locale="en-US-u-ca-indian" :default-placeholder="focused" />
    </section>
  </div>
</template>
