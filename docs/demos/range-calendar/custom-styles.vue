<script setup lang="ts">
import { RangeCalendar } from '@hareui/vue'
import { parseDate } from '@internationalized/date'

const cellButtonClass = [
  'rounded-md',
  'data-[outside-view]:text-muted data-[outside-view]:opacity-50',
  'hover:not-data-[selected]:bg-default',
  'data-[today]:bg-success-soft data-[today]:text-success-soft-foreground',
  'data-[today]:hover:not-data-[selected]:bg-success-soft-hover',
  'data-[selected=true]:rounded-none data-[selected=true]:bg-success-soft',
  'data-[outside-view]:data-[selected=true]:bg-default/20',
  'data-[selection-start=true]:rounded-tl-md data-[selection-start=true]:rounded-bl-md',
  'data-[selection-end=true]:rounded-tr-md data-[selection-end=true]:rounded-br-md',
  'data-[selection-start=true]:bg-success data-[selection-start=true]:text-success-foreground',
  'data-[selection-start=true]:active:bg-success-hover',
  'data-[selection-end=true]:bg-success data-[selection-end=true]:text-success-foreground',
  'data-[selection-end=true]:active:bg-success-hover',
].join(' ')
</script>

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
      cell: 'rounded-md',
      cellButton: cellButtonClass,
    }"
  />
</template>
