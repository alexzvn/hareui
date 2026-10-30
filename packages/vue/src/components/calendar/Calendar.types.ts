import type { DateValue } from '@internationalized/date'
import type { VNode } from 'vue'

import type { ComponentSlots } from '@/types/tv'
import type { ClassValue } from '@/utils/tv'

import type theme from './theme'
import type { PageBehavior, VisibleDuration } from './useCalendarDurationView'

type Calendar = typeof theme

/** Props of `Calendar`: a month (or week/day) grid for picking one or several dates. */
export type CalendarProps = {
  /** Accessible label for the calendar. */
  ariaLabel?: string
  /** The selected date(s). Use `v-model` to control it. */
  modelValue?: DateValue | DateValue[] | null
  /**
   * The selected date(s) when initially rendered (uncontrolled).
   * In multiple-selection mode, cast an array of dates at the call site: the underlying prop type
   * only accepts a single `DateValue`.
   */
  defaultValue?: DateValue | DateValue[]
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
  /** Callback returning whether a given date is unavailable for selection. */
  isDateUnavailable?: (date: DateValue) => boolean
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
  /** The locale used for formatting and week calculations. */
  locale?: string
  /** The day the week starts on. */
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  /**
   * Whether to always display 6 weeks, avoiding layout shift between months.
   * @defaultValue false
   */
  fixedWeeks?: boolean
  /**
   * Whether one or multiple dates can be selected.
   * @defaultValue 'single'
   */
  selectionMode?: 'single' | 'multiple'
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
   * by the full visible width. Each panel shows its own "<Month> <Year>" label.
   * @defaultValue 1
   */
  numberOfMonths?: number
  /**
   * Marks the calendar as invalid for consumer-driven validation by setting `aria-invalid`/`data-invalid`.
   * The theme doesn't key off it, so it has no visual effect by itself.
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
  ui?: ComponentSlots<Calendar>
}

/** Slots of `Calendar`, for replacing the nav icons and the content of each day cell. */
export type CalendarSlots = {
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
  }) => VNode[]
}

/** Events emitted by `Calendar`. */
export type CalendarEmits = {
  /** Emitted when the selected date(s) change. */
  'update:modelValue': [value: DateValue | DateValue[] | undefined]
  /** Emitted when the displayed month/year changes. */
  'update:placeholder': [value: DateValue]
}

/** The props the `#cell` slot receives. */
export type CalendarCellSlotProps = Parameters<NonNullable<CalendarSlots['cell']>>[0]
