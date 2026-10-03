<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import type { DateRangeValue } from '@hareui/vue'
import { getLocalTimeZone, parseZonedDateTime, Time } from '@internationalized/date'
import { DateRangePicker, Label, RangeCalendar, TimeField } from '@hareui/vue'

const localTimeZone = getLocalTimeZone()
const defaultValue: DateRangeValue = {
  start: parseZonedDateTime(`2026-02-03T08:45:00[${localTimeZone}]`),
  end: parseZonedDateTime(`2026-02-10T18:45:00[${localTimeZone}]`),
}

type WithTime = DateValue & { hour: number, minute: number, second: number, set: (fields: object) => DateValue }
const timeOf = (v: DateValue) => new Time((v as WithTime).hour, (v as WithTime).minute, (v as WithTime).second)
const withDate = (picked: DateValue, current: DateValue | undefined) => current ? (current as WithTime).set({ year: picked.year, month: picked.month, day: picked.day }) : picked
const withTime = (time: Time, current: DateValue) => (current as WithTime).set({ hour: time.hour, minute: time.minute, second: time.second })
</script>

<template>
  <DateRangePicker
    class="w-full max-w-2xs min-w-80"
    input-container
    granularity="second"
    :hour-cycle="12"
    :default-value="defaultValue"
    label="Date range"
    :ui="{ popover: 'flex w-fit flex-col gap-3' }"
  >
    <template #calendar="{ value: range, onSelect, onChange }">
      <RangeCalendar
        aria-label="Trip dates"
        year-picker
        :model-value="range ?? undefined"
        @update:model-value="(r) => r?.start && r.end && onSelect({ start: withDate(r.start, range?.start), end: withDate(r.end, range?.end) })"
      />
      <div v-if="range" class="flex flex-col gap-3">
        <div class="flex items-center justify-between">
          <Label>Start Time</Label>
          <TimeField
            aria-label="Start Time"
            variant="secondary"
            granularity="second"
            :hour-cycle="12"
            :model-value="timeOf(range.start)"
            @update:model-value="(t) => t && onChange({ start: withTime(t as Time, range.start), end: range.end })"
          />
        </div>
        <div class="flex items-center justify-between">
          <Label>End Time</Label>
          <TimeField
            aria-label="End Time"
            variant="secondary"
            granularity="second"
            :hour-cycle="12"
            :model-value="timeOf(range.end)"
            @update:model-value="(t) => t && onChange({ start: range.start, end: withTime(t as Time, range.end) })"
          />
        </div>
      </div>
    </template>
  </DateRangePicker>
</template>
