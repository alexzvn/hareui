import type { DateValue } from '@internationalized/date'
import type { Component, ComputedRef, InjectionKey } from 'vue'

/** The range state of one day cell. */
type RangeCalendarCellState = {
  selected: boolean
  selectionStart: boolean
  selectionEnd: boolean
  invalid: boolean
}

/** What RangeCalendar shares with each day, so a day (not the whole grid) tracks range state. */
export type RangeCalendarDayContext = {
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

/** Provided by RangeCalendar, injected by every RangeCalendarDay. */
export const rangeCalendarDayKey: InjectionKey<RangeCalendarDayContext> = Symbol('rangeCalendarDay')
