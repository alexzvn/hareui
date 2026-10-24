import type {
  CalendarDate,
  CalendarIdentifier,
  DateDuration,
  DateValue,
  DayOfWeek,
} from '@internationalized/date'
import {
  createCalendar,
  DateFormatter,
  getLocalTimeZone,
  isSameDay,
  isToday,
  maxDate,
  minDate,
  startOfWeek,
  toCalendar,
  toCalendarDate,
} from '@internationalized/date'
import { computed, nextTick, shallowRef, watch } from 'vue'
import type { ShallowRef } from 'vue'

/** React Aria's `visibleDuration`: `{ months }` is the (Reka) month view, `{ weeks }` / `{ days }` the custom views. */
export type VisibleDuration = {
  months?: number
  weeks?: number
  days?: number
}

export type PageBehavior = 'visible' | 'single'

/** Whether a duration selects the custom week/day grid (anything but a plain month view). */
export const isDurationView = (
  duration: VisibleDuration | undefined,
): duration is VisibleDuration => {
  return !!duration && (duration.weeks != null || duration.days != null)
}

// ---------------------------------------------------------------------------------------------
// Ported from react-stately `calendar/utils` (alignStart / alignEnd / alignCenter / constrainStart)
// ---------------------------------------------------------------------------------------------
type Bounds = { min?: DateValue; max?: DateValue }

type AlignOptions = Bounds & { duration: DateDuration; locale: string }

const alignStart = (date: CalendarDate, options: AlignOptions): CalendarDate => {
  const { duration, locale } = options
  const isWeekAligned = !!duration.weeks || (!!duration.days && duration.days > 7)
  const aligned = isWeekAligned ? startOfWeek(date, locale) : date

  return constrainStart({ date, aligned }, options)
}

// The offset from a range's start to its last unit: one day (or week) short of the duration
const toLastUnitOffset = (duration: DateDuration): DateDuration => {
  if (duration.days) return { ...duration, days: duration.days - 1 }
  if (duration.weeks) return { ...duration, weeks: duration.weeks - 1 }

  return { ...duration }
}

const alignEnd = (date: CalendarDate, options: AlignOptions): CalendarDate => {
  const { duration, locale } = options
  const aligned = alignStart(date, { duration, locale }).subtract(toLastUnitOffset(duration))

  return constrainStart({ date, aligned }, options)
}

const alignCenter = (date: CalendarDate, options: AlignOptions): CalendarDate => {
  const { duration, locale } = options
  const half: DateDuration = {}
  for (const key of Object.keys(duration) as (keyof DateDuration)[]) {
    const value = duration[key] ?? 0
    let h = Math.floor(value / 2)
    if (h > 0 && value % 2 === 0) h--
    half[key] = h
  }

  const aligned = alignStart(date, { duration, locale }).subtract(half)

  return constrainStart({ date, aligned }, options)
}

const constrainStart = (
  range: { date: CalendarDate; aligned: CalendarDate },
  options: AlignOptions,
): CalendarDate => {
  const { date } = range
  const { duration, locale, min, max } = options
  let { aligned } = range
  if (min && date.compare(min) >= 0)
    aligned =
      (maxDate(
        aligned,
        alignStart(toCalendarDate(min), { duration, locale }),
      ) as CalendarDate | null) ?? aligned

  if (max && date.compare(max) <= 0)
    aligned =
      (minDate(
        aligned,
        alignEnd(toCalendarDate(max), { duration, locale }),
      ) as CalendarDate | null) ?? aligned

  return aligned
}

const constrainValue = (date: CalendarDate, bounds: Bounds): CalendarDate => {
  const { min, max } = bounds
  let constrained = date
  if (min)
    constrained = (maxDate(constrained, toCalendarDate(min)) as CalendarDate | null) ?? constrained

  if (max)
    constrained = (minDate(constrained, toCalendarDate(max)) as CalendarDate | null) ?? constrained

  return constrained
}

const unitDuration = (duration: DateDuration): DateDuration => {
  const unit: DateDuration = {}
  for (const key of Object.keys(duration) as (keyof DateDuration)[]) unit[key] = 1

  return unit
}

const isOutOfRange = (date: DateValue, bounds: Bounds) => {
  const { min, max } = bounds

  return (min != null && date.compare(min) < 0) || (max != null && date.compare(max) > 0)
}

/** `onKeyDown`'s per-call options: the selection/cancel callbacks and the reading direction. */
export type DurationKeyDownOptions = {
  select: (date: CalendarDate) => void
  /** Escape: cancels an in-progress selection (omitted when there is none to cancel). */
  escape?: () => void
  dir?: 'ltr' | 'rtl'
}

type KeyAction = (event: KeyboardEvent, keyOptions: DurationKeyDownOptions) => void

export type UseCalendarDurationViewOptions = {
  duration: () => VisibleDuration | undefined
  locale: () => string
  firstDayOfWeek: () => DayOfWeek | undefined
  minValue: () => DateValue | undefined
  maxValue: () => DateValue | undefined
  pageBehavior: () => PageBehavior
  disabled: () => boolean
  /** The focused date (React Aria's `focusedValue`), backed by the component's placeholder model. */
  focused: { value: DateValue }
  /** react-stately's `selectionAlignment`, evaluated when the visible range is (re)aligned. */
  alignment: () => 'start' | 'center'
  /** The day grid element (the component's `useTemplateRef`); DOM focus follows the focused date inside it. */
  gridRef: Readonly<ShallowRef<HTMLElement | null>>
}

/**
 * React Aria's `useCalendarState` for `visibleDuration={{ weeks }}` / `{{ days }}`: Reka's calendar primitives
 * always build full month grids, so the week and day views compute their own visible range, rows, headings and
 * keyboard navigation here (decision #11), while the month view stays on Reka.
 */
export const useCalendarDurationView = (options: UseCalendarDurationViewOptions) => {
  const timeZone = getLocalTimeZone()

  const displayCalendar = computed(() =>
    createCalendar(
      new DateFormatter(options.locale()).resolvedOptions().calendar as CalendarIdentifier,
    ),
  )

  const duration = computed<DateDuration>(() => {
    const d = options.duration()
    return d?.days != null ? { days: d.days } : { weeks: d?.weeks ?? 1 }
  })

  const toDisplay = (value: DateValue) =>
    toCalendar(toCalendarDate(value), displayCalendar.value) as CalendarDate

  const bounds = (): Bounds => ({ min: options.minValue(), max: options.maxValue() })

  const alignOptions = (alignDuration: DateDuration = duration.value): AlignOptions => ({
    duration: alignDuration,
    locale: options.locale(),
    ...bounds(),
  })

  const focusedDate = computed<CalendarDate>({
    get: () => constrainValue(toDisplay(options.focused.value), bounds()),
    set: (value) => {
      options.focused.value = constrainValue(value, bounds())
    },
  })

  const initialStart = () => {
    const align = options.alignment() === 'start' ? alignStart : alignCenter

    return align(focusedDate.value, alignOptions())
  }

  const startDate = shallowRef<CalendarDate>(initialStart())
  const endDate = computed(() => {
    const d = duration.value

    return startDate.value.add({ ...d, days: d.days ? d.days - 1 : -1 })
  })

  // React Aria realigns when the duration or the display calendar changes, and pages the range to keep the
  // focused date visible.
  watch([() => JSON.stringify(duration.value), displayCalendar], () => {
    startDate.value = initialStart()
  })

  watch(
    focusedDate,
    (focused) => {
      if (focused.compare(startDate.value) < 0) {
        startDate.value = alignEnd(focused, alignOptions())
        return
      }

      if (focused.compare(endDate.value) > 0) startDate.value = alignStart(focused, alignOptions())
    },
    { flush: 'sync' },
  )

  const pageDuration = computed(() =>
    options.pageBehavior() === 'visible' ? duration.value : unitDuration(duration.value),
  )

  // Moves the visible range one page forward/back (realigned within min/max) and the focused date with it
  const page = (isForward: boolean) => {
    const step = pageDuration.value
    const focused = focusedDate.value
    const start = isForward ? startDate.value.add(step) : startDate.value.subtract(step)
    const constrained = constrainStart({ date: focused, aligned: start }, alignOptions(step))
    startDate.value = alignStart(constrained, { duration: step, locale: options.locale() })

    const nextFocused = isForward ? focused.add(step) : focused.subtract(step)
    focusedDate.value = constrainValue(nextFocused, bounds())
  }

  const nextPage = () => page(true)

  const prevPage = () => page(false)

  const isInvalid = (date: DateValue) => isOutOfRange(date, bounds())

  const isOutsideVisibleRange = (date: DateValue) =>
    date.compare(startDate.value) < 0 || date.compare(endDate.value) > 0

  const isCellDisabled = (date: DateValue) =>
    options.disabled() || isOutsideVisibleRange(date) || isInvalid(date)

  const isPrevDisabled = computed(
    () => options.disabled() || isInvalid(startDate.value.subtract({ days: 1 })),
  )

  const isNextDisabled = computed(
    () => options.disabled() || isInvalid(endDate.value.add({ days: 1 })),
  )

  const isTodayDate = (date: DateValue) => isToday(date, timeZone)

  const days = computed(() => duration.value.days)

  // RAC's week view and HeroUI's day view (>= 7 days) render week-aligned 7-column rows; RAC's short day view
  // (< 7 days) renders a single row starting at the visible start.
  const rows = computed<(CalendarDate | null)[][]>(() => {
    const locale = options.locale()
    const fdow = options.firstDayOfWeek()
    const d = days.value
    if (d != null && d < 7)
      return [Array.from({ length: d }, (_, i) => startDate.value.add({ days: i }))]

    if (d == null) {
      return Array.from({ length: duration.value.weeks ?? 1 }, (_, w) => {
        const first = startOfWeek(startDate.value.add({ weeks: w }), locale, fdow)
        return Array.from({ length: 7 }, (_, i) => first.add({ days: i }))
      })
    }

    // HeroUI `getDayViewGridRows`: leading dates before the start are shown (disabled), trailing ones are empty
    const result: (CalendarDate | null)[][] = []
    let rowStart = startOfWeek(startDate.value, locale, fdow)
    while (result.length === 0 || rowStart.compare(endDate.value) <= 0) {
      const row: (CalendarDate | null)[] = []
      for (let i = 0; i < 7; i++) {
        const date = rowStart.add({ days: i })
        row.push(date.compare(endDate.value) > 0 ? null : date)
      }

      result.push(row)
      rowStart = rowStart.add({ weeks: 1 })
    }

    return result
  })

  const weekDays = computed(() => {
    const formatter = new DateFormatter(options.locale(), { weekday: 'short', timeZone })
    const d = days.value
    const isShortDayView = d != null && d < 7
    const first = isShortDayView
      ? startDate.value
      : startOfWeek(startDate.value, options.locale(), options.firstDayOfWeek())

    return Array.from({ length: isShortDayView ? d : 7 }, (_, i) =>
      formatter.format(first.add({ days: i }).toDate(timeZone)),
    )
  })

  // `useCalendarHeading`: day/week durations format the visible range ("January 13 – 17, 2025")
  const heading = computed(() =>
    new DateFormatter(options.locale(), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      calendar: startDate.value.calendar.identifier,
      timeZone,
    }).formatRange(startDate.value.toDate(timeZone), endDate.value.toDate(timeZone)),
  )

  const rangeLabel = computed(() =>
    new DateFormatter(options.locale(), {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone,
    })
      .formatRange(startDate.value.toDate(timeZone), endDate.value.toDate(timeZone))
      .replace(/\s[–-]\s/, ' to '),
  )

  const formatDay = (date: CalendarDate) =>
    new DateFormatter(options.locale(), {
      day: 'numeric',
      calendar: date.calendar.identifier,
      timeZone,
    })
      .formatToParts(date.toDate(timeZone))
      .find((p) => p.type === 'day')?.value ?? String(date.day)

  const cellLabel = (date: CalendarDate) =>
    new DateFormatter(options.locale(), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone,
    }).format(date.toDate(timeZone))

  // Keyboard navigation (`useCalendarGrid` shortcuts). DOM focus follows the focused date while the grid has focus.
  const focusCell = (date: CalendarDate) => {
    focusedDate.value = date

    nextTick(() => {
      const grid = options.gridRef.value
      if (!grid?.contains(document.activeElement)) return

      grid.querySelector<HTMLElement>(`[data-value="${focusedDate.value.toString()}"]`)?.focus()
    })
  }

  const moveFocus = (amount: DateDuration, isForward: boolean) => {
    const focused = focusedDate.value
    focusCell(isForward ? focused.add(amount) : focused.subtract(amount))
  }

  const pageAndFocus = (isForward: boolean) => {
    page(isForward)
    focusCell(focusedDate.value)
  }

  // The day view pages on Up/Down/PageUp/PageDown; the week view moves the focused date by `amount`
  const pageOrMoveFocus = (amount: DateDuration, isForward: boolean) => {
    if (duration.value.days) {
      pageAndFocus(isForward)
      return
    }

    moveFocus(amount, isForward)
  }

  // Shift+PageUp/PageDown moves a month, PageUp/PageDown alone one unit of the duration
  const pageAmount = (event: KeyboardEvent): DateDuration =>
    event.shiftKey ? { months: 1 } : unitDuration(duration.value)

  const weekStart = () => startOfWeek(focusedDate.value, options.locale())

  const selectFocused: KeyAction = (_, keyOptions) => keyOptions.select(focusedDate.value)

  const keyActions: Partial<Record<string, KeyAction>> = {
    ArrowLeft: (_, keyOptions) => moveFocus({ days: 1 }, keyOptions.dir === 'rtl'),
    ArrowRight: (_, keyOptions) => moveFocus({ days: 1 }, keyOptions.dir !== 'rtl'),
    ArrowUp: () => pageOrMoveFocus({ weeks: 1 }, false),
    ArrowDown: () => pageOrMoveFocus({ weeks: 1 }, true),
    Home: () => focusCell(duration.value.days ? startDate.value : weekStart()),
    End: () => focusCell(duration.value.days ? endDate.value : weekStart().add({ days: 6 })),
    PageUp: (event) => pageOrMoveFocus(pageAmount(event), false),
    PageDown: (event) => pageOrMoveFocus(pageAmount(event), true),
    Enter: selectFocused,
    ' ': selectFocused,
  }

  const onKeyDown = (event: KeyboardEvent, keyOptions: DurationKeyDownOptions) => {
    // Escape only cancels an in-progress selection; its default is never prevented
    if (event.key === 'Escape') {
      keyOptions.escape?.()
      return
    }

    const action = keyActions[event.key]
    if (!action) return

    action(event, keyOptions)
    event.preventDefault()
  }

  return {
    startDate,
    endDate,
    focusedDate,
    rows,
    weekDays,
    heading,
    rangeLabel,
    nextPage,
    prevPage,
    isPrevDisabled,
    isNextDisabled,
    isInvalid,
    isCellDisabled,
    isOutsideVisibleRange,
    isToday: isTodayDate,
    isSameDay,
    formatDay,
    cellLabel,
    focusCell,
    onKeyDown,
    toDisplay,
  }
}
