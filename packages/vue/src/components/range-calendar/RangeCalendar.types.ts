import type { DateValue } from '@internationalized/date'
import type { VNode } from 'vue'

import type { PageBehavior, VisibleDuration } from '@/components/calendar/useCalendarDurationView'
import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'

type RangeCalendar = typeof theme

export type DateRange = {
  start: DateValue | undefined
  end: DateValue | undefined
}

export type RangeCalendarProps = {
  /** Accessible label for the calendar. */
  ariaLabel?: string
  /** The selected date range. Use `v-model` to control it. */
  modelValue?: DateRange
  /** The selected date range when initially rendered (uncontrolled). */
  defaultValue?: DateRange
  /** The currently displayed month/year. Use `v-model:placeholder` to control it. */
  placeholder?: DateValue
  /** The date initially displayed, before navigation (uncontrolled). */
  defaultPlaceholder?: DateValue
  /**
   * The minimum selectable date.
   * @defaultValue 1900-01-01
   */
  minValue?: DateValue
  /**
   * The maximum selectable date.
   * @defaultValue 2099-12-31
   */
  maxValue?: DateValue
  /**
   * Callback returning whether a given date is unavailable for selection. During an
   * in-progress range selection, `anchorDate` is the already-picked start date (or `null`
   * before any date is picked), matching React Aria's `isDateUnavailable(date, anchorDate)`.
   */
  isDateUnavailable?: (date: DateValue, anchorDate: DateValue | null) => boolean
  /**
   * Whether the whole calendar is disabled.
   * @defaultValue false
   */
  disabled?: boolean
  /**
   * Whether the calendar is read-only (dates stay visible but cannot be changed).
   * @defaultValue false
   */
  readonly?: boolean
  /**
   * Whether non-contiguous ranges are allowed, skipping over unavailable dates in the middle
   * of the range instead of resetting the selection.
   * @defaultValue false
   */
  allowNonContiguousRanges?: boolean
  /** Restricts a range selection to a fixed number of days from the start date. */
  maximumDays?: number
  /** The locale used for formatting and week calculations. */
  locale?: string
  /** The day the week starts on. */
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  /**
   * Whether to always display 6 weeks, avoiding layout shift between months.
   * Reka UI only supports a fixed 6-week grid (HeroUI's React `weeksInMonth` accepts
   * any count up to 6; see reka-limitations in the RangeCalendar report).
   * @defaultValue false
   */
  fixedWeeks?: boolean
  /**
   * Replaces the plain month/year heading with a toggleable year grid.
   * @defaultValue false
   */
  yearPicker?: boolean
  /** Callback returning whether a small dot indicator should render under a date. */
  indicator?: (date: DateValue) => boolean
  /**
   * This property causes the previous/next buttons to navigate by the number of
   * months displayed at once rather than one month.
   * @defaultValue false
   */
  pagedNavigation?: boolean
  /**
   * Shows this many months side by side. Navigating with the prev/next buttons always pages
   * by the full visible width (Reka's `pagedNavigation`, forced on regardless of the
   * `pagedNavigation` prop, matching React Aria's default `pageBehavior: "visible"`).
   * Reka's heading only formats the combined range, so each panel renders its own
   * "<Month> <Year>" label derived from that panel's `Grid.value` (see reka-limitations in
   * the RangeCalendar report).
   * @defaultValue 1
   */
  numberOfMonths?: number
  /**
   * Marks the calendar as invalid for consumer-driven validation (e.g. a selected range that's
   * too long). Reka's own `isInvalid` is a read-only computed derived from `isDateUnavailable`/
   * `minValue`/`maxValue`, with no input prop to override it (see reka-limitations in the
   * RangeCalendar report), so this sets `aria-invalid`/`data-invalid` directly instead. HeroUI's
   * styles don't key off it either, so it has no visual effect by itself.
   * @defaultValue false
   */
  invalid?: boolean
  /** The reading direction of the calendar. */
  dir?: 'ltr' | 'rtl'
  /**
   * The visible time range. `{ weeks: n }` shows a week view and `{ days: n }` a day view (a rolling window of
   * consecutive days); anything else shows the month view (use `number-of-months` for several months).
   * Navigation advances by the visible range.
   * @defaultValue { months: 1 }
   */
  visibleDuration?: VisibleDuration
  /**
   * In week/day views, whether the prev/next buttons and page keys move by the whole visible range
   * (`'visible'`) or by one week/day (`'single'`).
   * @defaultValue 'visible'
   */
  pageBehavior?: PageBehavior
  /** Additional classes merged into the root element. */
  class?: ClassValue
  /** Per-slot class overrides. */
  ui?: ComponentSlots<RangeCalendar>
}

export type RangeCalendarSlots = {
  /** Replaces the chevron icon inside a nav button. */
  navIcon?: (props: { direction: 'previous' | 'next' }) => VNode[]
  /** Replaces a cell's default formatted-date content. */
  cell?: (props: {
    date: DateValue
    today: boolean
    selected: boolean
    disabled: boolean
    unavailable: boolean
    outsideView: boolean
    selectionStart: boolean
    selectionEnd: boolean
  }) => VNode[]
}

export type RangeCalendarEmits = {
  /** Emitted when the selected date range changes. */
  'update:modelValue': [value: DateRange | undefined]
  /** Emitted when the displayed month/year changes. */
  'update:placeholder': [value: DateValue]
}

/** Props of the `#cell` slot. */
export type RangeCalendarCellSlotProps = Parameters<NonNullable<RangeCalendarSlots['cell']>>[0]
