import type { DateValue } from '@internationalized/date'

import type { PageBehavior, VisibleDuration } from './useCalendarDurationView'

/** Which Reka root family a shell renders: Calendar or RangeCalendar. */
export type CalendarKind = 'calendar' | 'range'

/** The theme slots a shell renders. */
type CalendarShellSlot =
  | 'base'
  | 'panels'
  | 'panel'
  | 'header'
  | 'heading'
  | 'navButton'
  | 'navButtonIcon'
  | 'grid'
  | 'gridHeader'
  | 'gridBody'
  | 'gridRow'
  | 'headerCell'
  | 'yearPickerTrigger'
  | 'yearPickerTriggerHeading'
  | 'yearPickerTriggerIndicator'
  | 'yearPickerGrid'
  | 'yearPickerYearCell'

/** The root's resolved slot class functions, one per shell slot, with its `ui` and `class` props layered in. */
export type CalendarShellUI = Record<CalendarShellSlot, () => string>

/** How the calendar selects. The week/day view runs outside Reka, so it selects with these directly. */
type CalendarShellSelection<TValue> = {
  /** The controlled value; `undefined` leaves the week/day view's selection uncontrolled. */
  value?: TValue | null
  /** The week/day view's initial uncontrolled value. */
  defaultValue?: TValue
  mode?: 'single' | 'multiple'
  isDateUnavailable?: (date: DateValue, anchorDate: DateValue | null) => boolean
  allowNonContiguousRanges?: boolean
}

/** The Reka root props and listeners that differ between Calendar and RangeCalendar. */
type CalendarShellRoot = {
  bindings: Record<string, unknown>
}

/** The props a Calendar or RangeCalendar root passes to its shell. */
export type CalendarMonthShellProps<TValue> = {
  kind: CalendarKind
  /** The root's resolved slot class functions (already resolved for the `view` variant). */
  ui: CalendarShellUI
  root: CalendarShellRoot
  ariaLabel?: string
  /** The controlled displayed date. */
  placeholder?: DateValue
  /** The initially displayed date when `placeholder` isn't controlled; read once. */
  defaultPlaceholder?: DateValue
  /** The resolved bounds: the year picker's range, the week/day view's bounds and the month grid's by default. */
  minValue: DateValue
  maxValue: DateValue
  /** Narrower bounds for the month grid and its keys (RangeCalendar while a range is anchored). */
  monthBounds?: { minValue: DateValue; maxValue: DateValue }
  selection: CalendarShellSelection<TValue>
  disabled: boolean
  readonly: boolean
  invalid: boolean
  locale?: string
  firstDayOfWeek?: 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'
  fixedWeeks: boolean
  yearPicker: boolean
  pagedNavigation: boolean
  numberOfMonths: number
  dir?: 'ltr' | 'rtl'
  visibleDuration?: VisibleDuration
  pageBehavior: PageBehavior
  indicator?: (date: DateValue) => boolean
}

/** The events a shell emits to its root. */
export type CalendarMonthShellEmits<TValue> = {
  'update:placeholder': [value: DateValue]
  /** A week/day view pick. */
  select: [value: TValue]
}

/** The slots a root fills on its shell. */
export type CalendarMonthShellSlots = {
  navIcon?: (props: { direction: 'previous' | 'next' }) => unknown
  /** The root's public `#cell`, rendered by the week/day view. */
  cell?: (props: Record<string, unknown>) => unknown
  /** One day of a month grid, inside the grid row. */
  monthCell: (props: { date: DateValue; month: DateValue }) => unknown
}

/** What a root reads back from its shell: cell event handlers resolve dates against the displayed month. */
export type CalendarMonthShellExposed = {
  /** The Reka root's element; `undefined` in the week/day view. */
  readonly rootEl: HTMLElement | undefined
  /** The displayed (focused) date; assigning it moves the view. */
  placeholder: DateValue
}
