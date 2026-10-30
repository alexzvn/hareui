import type { CalendarDate, DateValue } from '@internationalized/date'

import type { PageBehavior, VisibleDuration } from './useCalendarDurationView'

/** A range value whose ends may still be unset. */
export type DurationRange = { start: DateValue | undefined; end: DateValue | undefined }

/** Single: a date; multiple: an array; range: `{ start, end }`. */
export type CalendarDurationValue = DateValue | DateValue[] | DurationRange

/** Props of the `#cell` slot. */
export type CalendarDurationCellSlotProps = {
  date: CalendarDate
  today: boolean
  selected: boolean
  disabled: boolean
  unavailable: boolean
  outsideView: boolean
  /** Range kind only. */
  selectionStart?: boolean
  /** Range kind only. */
  selectionEnd?: boolean
}

/**
 * Internal: the `visibleDuration={{ weeks }}` / `{{ days }}` grid shared by `Calendar` and `RangeCalendar`
 * (decision #11). Reka's calendar roots always build full month grids, so these views use their own state
 * (`useCalendarDurationView`) and mirror the month view's DOM,
 * `data-slot`s and Reka-style data attributes so the same theme applies.
 */
export type CalendarDurationViewProps = {
  kind: 'calendar' | 'range'
  /** The parent's slot class functions (resolved for the `view` variant, its `ui` and `class` props layered in). */
  ui: Record<string, () => string>
  ariaLabel?: string
  duration: VisibleDuration
  pageBehavior: PageBehavior
  focused: { value: DateValue }
  value: CalendarDurationValue | null | undefined
  selectionMode?: 'single' | 'multiple'
  minValue: DateValue
  maxValue: DateValue
  isDateUnavailable?: (date: DateValue, anchorDate: DateValue | null) => boolean
  allowNonContiguousRanges?: boolean
  disabled: boolean
  readonly: boolean
  invalid: boolean
  locale?: string
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  indicator?: (date: DateValue) => boolean
  dir?: 'ltr' | 'rtl'
}
