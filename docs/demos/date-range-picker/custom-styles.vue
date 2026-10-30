<template>
  <!--
    The field parts are styled through
    `:ui`, and the `#calendar` slot replaces the embedded RangeCalendar; bind `value` and call `onSelect`
    to keep it wired to the picker.
  -->
  <DateRangePicker
    class="w-80"
    full-width
    variant="secondary"
    start-name="checkin"
    end-name="checkout"
    label="Stay dates"
    :ui="{
      group: 'rounded-xl border border-border/80 bg-default shadow-sm',
      rangeSeparator: 'text-muted',
      trigger: 'text-muted',
      popover: 'border border-border/80 shadow-sm',
    }"
  >
    <template #calendar="{ value, onSelect }">
      <RangeCalendar
        aria-label="Stay dates"
        class="rounded-2xl bg-surface p-2"
        :ui="{
          heading: 'font-medium text-foreground',
          navButton: 'text-muted hover:bg-default',
          headerCell: 'text-xs text-muted',
        }"
        :model-value="value ?? undefined"
        @update:model-value="
          (range) => range?.start && range.end && onSelect({ start: range.start, end: range.end })
        "
      />
    </template>
  </DateRangePicker>
</template>

<script setup lang="ts">
import { DateRangePicker, RangeCalendar } from '@hareui/vue'
</script>
