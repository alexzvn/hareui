<template>
  <div class="flex flex-col gap-4">
    <DatePicker
      :key="granularity"
      v-model="value"
      class="w-fit min-w-72"
      :granularity="granularity"
      :hour-cycle="hourCycle"
      :hide-time-zone="shouldHideTimeZone"
      name="date"
      label="Date and time"
      calendar-label="Event date"
    >
      <template v-if="timeGranularity" #calendar="{ value: calendarValue, onSelect }">
        <div class="flex flex-col gap-3">
          <Calendar
            :model-value="calendarValue"
            year-picker
            @update:model-value="
              (picked) => onSelect(mergeDate(picked as DateValue, calendarValue))
            "
          />
          <div class="flex items-center justify-between">
            <Label>Time</Label>
            <TimeField
              :model-value="
                hasTime(calendarValue)
                  ? new Time(calendarValue.hour, calendarValue.minute, calendarValue.second)
                  : undefined
              "
              :granularity="timeGranularity"
              :hour-cycle="hourCycle"
              :hide-time-zone="shouldHideTimeZone"
              aria-label="Time"
              @update:model-value="
                (time) => time && onSelect(mergeTime(time, calendarValue) as DateValue)
              "
            />
          </div>
        </div>
      </template>
    </DatePicker>

    <div class="flex flex-wrap gap-4">
      <Select
        class="w-[120px]"
        :model-value="granularity"
        placeholder="Select granularity"
        variant="secondary"
        :items="granularityOptions"
        @update:model-value="onGranularityChange"
      />
      <Select
        class="w-[120px]"
        :model-value="hourCycle"
        placeholder="Select hour cycle"
        variant="secondary"
        :items="hourCycleOptions"
        @update:model-value="(v) => (hourCycle = v as HourCycle)"
      />
    </div>

    <div class="flex min-w-80 flex-col gap-2">
      <Switch v-model="shouldHideTimeZone" label="Hide timezone" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ListBoxItem, SelectValue } from '@hareui/vue'
import { Calendar, DatePicker, Label, Select, Switch, TimeField } from '@hareui/vue'
import type { CalendarDateTime, DateValue, ZonedDateTime } from '@internationalized/date'
import { parseDate, parseZonedDateTime, Time } from '@internationalized/date'
import type { TimeValue } from 'reka-ui'
import { computed, ref, shallowRef } from 'vue'

type Granularity = 'day' | 'hour' | 'minute' | 'second'
type HourCycle = 12 | 24

const granularityOptions: ListBoxItem[] = [
  { value: 'day', label: 'Day' },
  { value: 'hour', label: 'Hour' },
  { value: 'minute', label: 'Minute' },
  { value: 'second', label: 'Second' },
]

const hourCycleOptions: ListBoxItem[] = [
  { value: 12, label: '12-hour' },
  { value: 24, label: '24-hour' },
]

const granularity = ref<Granularity>('minute')
const hourCycle = ref<HourCycle>(12)
const shouldHideTimeZone = ref(false)

const timeGranularity = computed(() =>
  granularity.value === 'day' ? undefined : granularity.value,
)

const defaultValueFor = (g: Granularity): DateValue => {
  return g === 'day'
    ? parseDate('2026-02-03')
    : parseZonedDateTime('2026-02-03T08:45:00[America/Los_Angeles]')
}

const value = shallowRef<DateValue | null>(defaultValueFor(granularity.value))

const hasTime = (v: DateValue | null | undefined): v is CalendarDateTime | ZonedDateTime => {
  return !!v && 'hour' in v
}

// Reka's embedded Calendar only edits date fields and the TimeField below only edits time fields;
// each merges onto the other's current value instead of replacing it outright.
const mergeDate = (picked: DateValue, current: DateValue | null | undefined): DateValue => {
  return hasTime(current)
    ? current.set({ year: picked.year, month: picked.month, day: picked.day })
    : picked
}

const mergeTime = (time: TimeValue, current: DateValue | null | undefined): DateValue | null => {
  return hasTime(current)
    ? current.set({ hour: time.hour, minute: time.minute, second: time.second })
    : (current ?? null)
}

const onGranularityChange = (next: SelectValue | undefined) => {
  if (typeof next !== 'string') return
  granularity.value = next as Granularity
  value.value = defaultValueFor(granularity.value)
}
</script>
