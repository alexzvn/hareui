<template>
  <component
    :is="reka.Grid"
    :data-slot="`${prefix}-grid`"
    role="grid"
    :aria-label="label"
    :aria-multiselectable="multiselectable || undefined"
    :class="ui.grid()"
  >
    <component :is="reka.GridHead" :data-slot="`${prefix}-grid-header`" :class="ui.gridHeader()">
      <component :is="reka.GridRow" :class="ui.gridRow()">
        <CalendarHeadCell
          v-for="(day, i) in weekDays"
          :key="`weekday-${i}`"
          :data-slot="`${prefix}-header-cell`"
          :class="ui.headerCell()"
        >
          {{ day }}
        </CalendarHeadCell>
      </component>
    </component>
    <component :is="reka.GridBody" :data-slot="`${prefix}-grid-body`" :class="ui.gridBody()">
      <component
        :is="reka.GridRow"
        v-for="(weekDates, index) in rows"
        :key="`week-${index}`"
        :class="ui.gridRow()"
      >
        <template v-for="weekDate in weekDates" :key="weekDate.toString()">
          <slot name="cell" :date="weekDate" :month="month" />
        </template>
      </component>
    </component>
  </component>
</template>

<script setup lang="ts">
import type { DateValue } from '@internationalized/date'
import { CalendarHeadCell } from 'reka-ui'

import type { CalendarKind, CalendarShellUI } from './CalendarMonthShell.types'
import { REKA_PARTS, SLOT_PREFIXES } from './calendarRekaParts'

const props = defineProps<{
  kind: CalendarKind
  ui: CalendarShellUI
  /** The grid's accessible name. */
  label: string
  multiselectable: boolean
  /** The weekday names, in display order. */
  weekDays: string[]
  /** The month's weeks, each a row of dates. */
  rows: DateValue[][]
  /** The month the grid shows. */
  month: DateValue
}>()

defineSlots<{
  /** One day of the grid, inside its week row. */
  cell: (props: { date: DateValue; month: DateValue }) => unknown
}>()

// A shell never changes kind
const reka = REKA_PARTS[props.kind]
const prefix = SLOT_PREFIXES[props.kind]
</script>
