<script setup lang="ts">
import type { CalendarDateTime, DateValue, ZonedDateTime } from '@internationalized/date'
import type { DateRangeValue, ListBoxItem } from '@hareui/vue'
import type { TimeValue } from 'reka-ui'
import { DateFormatter, getLocalTimeZone, parseDate, parseZonedDateTime, Time } from '@internationalized/date'
import { DateRangePicker, Label, RangeCalendar, Select, Separator, Switch, TimeField } from '@hareui/vue'
import { computed, ref, shallowRef } from 'vue'

type Granularity = 'day' | 'hour' | 'minute' | 'second'
type HourCycle = 12 | 24

const granularityOptions: ListBoxItem[] = [
  { label: 'Day', value: 'day' },
  { label: 'Hour', value: 'hour' },
  { label: 'Minute', value: 'minute' },
  { label: 'Second', value: 'second' },
]
const hourCycleOptions: ListBoxItem[] = [
  { label: '12-hour', value: 12 },
  { label: '24-hour', value: 24 },
]

const granularity = ref<Granularity>('minute')
const hourCycle = ref<HourCycle>(12)
const hideTimeZone = ref(false)
const timeGranularity = computed(() => (granularity.value === 'day' ? undefined : granularity.value))

function defaultValueFor(g: Granularity): DateRangeValue {
  const tz = getLocalTimeZone()
  if (g === 'day')
    return { start: parseDate('2025-02-03'), end: parseDate('2025-02-10') }
  return { start: parseZonedDateTime(`2026-02-03T08:45:00[${tz}]`), end: parseZonedDateTime(`2026-02-10T18:45:00[${tz}]`) }
}
const value = shallowRef<DateRangeValue | null>(defaultValueFor(granularity.value))

function onGranularityChange(next: string | number) {
  granularity.value = next as Granularity
  value.value = defaultValueFor(granularity.value)
}

const dateFormatter = new DateFormatter('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
function formatRange(range: DateRangeValue) {
  const tz = getLocalTimeZone()
  return dateFormatter.formatRange(range.start.toDate(tz), range.end.toDate(tz))
}

type WithTime = CalendarDateTime | ZonedDateTime
function hasTime(v: DateValue | undefined): v is WithTime {
  return !!v && 'hour' in v
}
function timeOf(v: DateValue | undefined) {
  return hasTime(v) ? new Time(v.hour, v.minute, v.second) : undefined
}
// The calendar only edits the date and the time fields only edit the time; each merges onto the other.
function withDate(picked: DateValue, current: DateValue | undefined): DateValue {
  return hasTime(current) ? current.set({ year: picked.year, month: picked.month, day: picked.day }) : picked
}
function withTime(time: TimeValue, current: DateValue): DateValue {
  return hasTime(current) ? current.set({ hour: time.hour, minute: time.minute, second: time.second }) : current
}
</script>

<template>
  <div class="flex w-full flex-col gap-4">
    <DateRangePicker
      :key="granularity"
      v-model="value"
      class="w-max min-w-80"
      input-container
      :granularity="granularity"
      :hour-cycle="hourCycle"
      :hide-time-zone="hideTimeZone"
      start-name="startDate"
      end-name="endDate"
      label="Date range"
      :ui="{ popover: 'flex w-63 max-w-63 flex-col gap-3' }"
    >
      <template #calendar="{ value: range, onSelect, onChange }">
        <RangeCalendar
          aria-label="Trip dates"
          class="w-full"
          year-picker
          :model-value="range ?? undefined"
          @update:model-value="(r) => r?.start && r.end && onSelect({ start: withDate(r.start, range?.start), end: withDate(r.end, range?.end) })"
        />
        <div v-if="timeGranularity && range" class="flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <Label>Start Time</Label>
            <TimeField
              aria-label="Start Time"
              name="startTime"
              variant="secondary"
              :granularity="timeGranularity"
              :hour-cycle="hourCycle"
              :hide-time-zone="hideTimeZone"
              :model-value="timeOf(range.start)"
              @update:model-value="(t) => t && onChange({ start: withTime(t, range.start), end: range.end })"
            />
          </div>
          <div class="flex items-center justify-between">
            <Label>End Time</Label>
            <TimeField
              aria-label="End Time"
              name="endTime"
              variant="secondary"
              :granularity="timeGranularity"
              :hour-cycle="hourCycle"
              :hide-time-zone="hideTimeZone"
              :model-value="timeOf(range.end)"
              @update:model-value="(t) => t && onChange({ start: range.start, end: withTime(t, range.end) })"
            />
          </div>
        </div>
        <span class="mt-1 text-xs text-muted">
          Selected: {{ range ? formatRange(range) : 'No date selected' }}
        </span>
      </template>
    </DateRangePicker>

    <Separator class="my-5" />

    <Label class="text-xs font-medium text-muted">
      Format Options
    </Label>

    <div class="flex flex-wrap gap-4">
      <Select class="w-[120px]" label="Granularity" name="granularity" variant="secondary" :items="granularityOptions" :model-value="granularity" @update:model-value="(v) => onGranularityChange(v as string)" />
      <Select class="w-[120px]" label="Hour cycle" variant="secondary" :items="hourCycleOptions" :model-value="hourCycle" @update:model-value="(v) => (hourCycle = Number(v) as HourCycle)" />
    </div>

    <div class="flex min-w-[529px] flex-col gap-2">
      <Switch v-model="hideTimeZone" label="Hide timezone" />
    </div>
  </div>
</template>
