<template>
  <RangeCalendarCell :date="date" :aria-selected="selected || undefined">
    <RangeCalendarCellTrigger
      :day="date"
      :month="month"
      :data-selected="selected || undefined"
      :data-selection-start="selectionStart || undefined"
      :data-selection-end="selectionEnd || undefined"
      :data-invalid="invalid ? '' : undefined"
      :aria-invalid="invalid || undefined"
      data-slot="range-calendar-cell"
      :class="ctx.cellClass.value"
      v-slot="{ dayValue, today, disabled, unavailable, outsideView }"
      @pointerdown="onPointerDown"
      @pointerup="onPointerUp"
      @mouseenter="onMouseEnter"
    >
      <span data-slot="range-calendar-cell-button" :class="ctx.cellButtonClass.value">
        <CellOutlet
          :date="date"
          :today="today"
          :selected="selected"
          :disabled="disabled"
          :unavailable="unavailable"
          :outsideView="outsideView"
          :selectionStart="selectionStart"
          :selectionEnd="selectionEnd"
          >{{ dayValue }}</CellOutlet
        >
        <span
          v-if="ctx.indicator()?.(date)"
          data-slot="range-calendar-cell-indicator"
          aria-hidden="true"
          :class="ctx.indicatorClass.value"
        />
      </span>
    </RangeCalendarCellTrigger>
  </RangeCalendarCell>
</template>

<script lang="ts">
import type { DateValue } from '@internationalized/date'
import type { Component, ComputedRef, InjectionKey } from 'vue'

export interface RangeCalendarCellState {
  selected: boolean
  selectionStart: boolean
  selectionEnd: boolean
  invalid: boolean
}

/** What RangeCalendar shares with each day, so a day (not the whole grid) tracks range state. */
export interface RangeCalendarDayContext {
  cellState: (date: DateValue, month: DateValue) => RangeCalendarCellState
  onPointerDown: (event: PointerEvent, date: DateValue) => void
  onPointerUp: (event: PointerEvent, date: DateValue) => void
  onMouseEnter: (event: MouseEvent, date: DateValue) => void
  cellClass: ComputedRef<string>
  cellButtonClass: ComputedRef<string>
  indicatorClass: ComputedRef<string>
  indicator: () => ((date: DateValue) => boolean) | undefined
  CellOutlet: Component
}

export const rangeCalendarDayKey: InjectionKey<RangeCalendarDayContext> = Symbol('rangeCalendarDay')
</script>

<script setup lang="ts">
import { RangeCalendarCell, RangeCalendarCellTrigger } from 'reka-ui'
import { computed, inject } from 'vue'

const props = defineProps<{ date: DateValue; month: DateValue }>()
const ctx = inject(rangeCalendarDayKey)!

// Boolean computeds only notify when their value flips, so a hover preview re-renders just the days entering/leaving it
const state = computed(() => ctx.cellState(props.date, props.month))
const selected = computed(() => state.value.selected)
const selectionStart = computed(() => state.value.selectionStart)
const selectionEnd = computed(() => state.value.selectionEnd)
const invalid = computed(() => state.value.invalid)

const onPointerDown = (event: PointerEvent) => ctx.onPointerDown(event, props.date)
const onPointerUp = (event: PointerEvent) => ctx.onPointerUp(event, props.date)
const onMouseEnter = (event: MouseEvent) => ctx.onMouseEnter(event, props.date)

// Renders the consumer's `#cell` through the root's outlet instead of a forwarded `<slot>`, which would force-update
// every day. Outlet attrs become the slot props, so the template passes camelCase keys.
const CellOutlet = ctx.CellOutlet
</script>
