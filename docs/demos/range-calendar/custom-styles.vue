<template>
  <RangeCalendar
    aria-label="Hotel stay"
    class="w-63 rounded-xl border border-border/80 bg-surface p-3 shadow-sm ring-1 ring-success/10"
    :default-value="{ start: parseDate('2025-02-08'), end: parseDate('2025-02-14') }"
    first-day-of-week="mon"
    :ui="{
      header: 'px-0.5 pb-4',
      heading: 'text-sm font-medium text-foreground',
      navButton: 'rounded-md text-success hover:bg-success-soft active:scale-95',
      headerCell: 'pb-2 text-xs font-medium text-muted',
      cell: cellClass,
      cellButton: cellButtonClass,
    }"
  />
</template>

<script setup lang="ts">
import { RangeCalendar } from '@hareui/vue'
import { parseDate } from '@internationalized/date'

// The cell is the range band: square inside the range, rounded at its ends and at row edges
const cellClass = [
  'rounded-none data-[selected]:bg-success-soft',
  'data-[outside-view]:data-[selected]:bg-default/20',
  'data-[selected]:in-[td:first-child]:rounded-s-md data-[selected]:in-[td:last-child]:rounded-e-md',
  'data-[selection-start]:rounded-s-md data-[selection-end]:rounded-e-md',
].join(' ')

// The pill inside it: solid at the range ends
const cellButtonClass = [
  'rounded-md',
  'in-data-[outside-view]:text-muted in-data-[outside-view]:opacity-50',
  'in-data-[today]:text-success',
  'in-data-[selection-start]:bg-success in-data-[selection-start]:text-success-foreground',
  'in-data-[selection-end]:bg-success in-data-[selection-end]:text-success-foreground',
].join(' ')
</script>
