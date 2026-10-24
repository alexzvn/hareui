import type { CalendarDate, DateDuration, DateValue, DayOfWeek } from '@internationalized/date'
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
import { computed, nextTick, ref, shallowRef, watch } from 'vue'

/** React Aria's `visibleDuration`: `{ months }` is the (Reka) month view, `{ weeks }` / `{ days }` the custom views. */
export interface VisibleDuration {
  months?: number
  weeks?: number
  days?: number
}

export type PageBehavior = 'visible' | 'single'

/** Whether a duration selects the custom week/day grid (anything but a plain month view). */
export function isDurationView(duration: VisibleDuration | undefined): duration is VisibleDuration {
  return !!duration && (duration.weeks != null || duration.days != null)
}

// ---------------------------------------------------------------------------------------------
// Ported from react-stately `calendar/utils` (alignStart / alignEnd / alignCenter / constrainStart)
// ---------------------------------------------------------------------------------------------
function alignStart(
  date: CalendarDate,
  duration: DateDuration,
  locale: string,
  min?: DateValue,
  max?: DateValue,
): CalendarDate {
  let aligned = date
  if (duration.weeks || (duration.days && duration.days > 7)) aligned = startOfWeek(date, locale)
  return constrainStart(date, aligned, duration, locale, min, max)
}
function alignEnd(
  date: CalendarDate,
  duration: DateDuration,
  locale: string,
  min?: DateValue,
  max?: DateValue,
): CalendarDate {
  const d = { ...duration }
  if (d.days) d.days--
  else if (d.weeks) d.weeks--
  const aligned = alignStart(date, duration, locale).subtract(d)
  return constrainStart(date, aligned, duration, locale, min, max)
}
function alignCenter(
  date: CalendarDate,
  duration: DateDuration,
  locale: string,
  min?: DateValue,
  max?: DateValue,
): CalendarDate {
  const half: DateDuration = {}
  for (const key of Object.keys(duration) as (keyof DateDuration)[]) {
    const value = duration[key] ?? 0
    let h = Math.floor(value / 2)
    if (h > 0 && value % 2 === 0) h--
    half[key] = h
  }
  const aligned = alignStart(date, duration, locale).subtract(half)
  return constrainStart(date, aligned, duration, locale, min, max)
}
function constrainStart(
  date: CalendarDate,
  aligned: CalendarDate,
  duration: DateDuration,
  locale: string,
  min?: DateValue,
  max?: DateValue,
): CalendarDate {
  if (min && date.compare(min) >= 0)
    aligned =
      (maxDate(
        aligned,
        alignStart(toCalendarDate(min), duration, locale),
      ) as CalendarDate | null) ?? aligned
  if (max && date.compare(max) <= 0)
    aligned =
      (minDate(aligned, alignEnd(toCalendarDate(max), duration, locale)) as CalendarDate | null) ??
      aligned
  return aligned
}
function constrainValue(date: CalendarDate, min?: DateValue, max?: DateValue): CalendarDate {
  if (min) date = (maxDate(date, toCalendarDate(min)) as CalendarDate | null) ?? date
  if (max) date = (minDate(date, toCalendarDate(max)) as CalendarDate | null) ?? date
  return date
}
function unitDuration(duration: DateDuration): DateDuration {
  const unit: DateDuration = {}
  for (const key of Object.keys(duration) as (keyof DateDuration)[]) unit[key] = 1
  return unit
}
function isOutOfRange(date: DateValue, min?: DateValue, max?: DateValue) {
  return (min != null && date.compare(min) < 0) || (max != null && date.compare(max) > 0)
}

export interface UseCalendarDurationViewOptions {
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
}

/**
 * React Aria's `useCalendarState` for `visibleDuration={{ weeks }}` / `{{ days }}`: Reka's calendar primitives
 * always build full month grids, so the week and day views compute their own visible range, rows, headings and
 * keyboard navigation here (decision #11), while the month view stays on Reka.
 */
export function useCalendarDurationView(options: UseCalendarDurationViewOptions) {
  const timeZone = getLocalTimeZone()
  const displayCalendar = computed(() =>
    createCalendar(new DateFormatter(options.locale()).resolvedOptions().calendar as any),
  )
  const duration = computed<DateDuration>(() => {
    const d = options.duration()
    return d?.days != null ? { days: d.days } : { weeks: d?.weeks ?? 1 }
  })
  const toDisplay = (value: DateValue) =>
    toCalendar(toCalendarDate(value), displayCalendar.value) as CalendarDate
  const min = () => options.minValue()
  const max = () => options.maxValue()

  const focusedDate = computed<CalendarDate>({
    get: () => constrainValue(toDisplay(options.focused.value), min(), max()),
    set: (value) => {
      options.focused.value = constrainValue(value, min(), max())
    },
  })

  function initialStart() {
    const align = options.alignment() === 'start' ? alignStart : alignCenter
    return align(focusedDate.value, duration.value, options.locale(), min(), max())
  }
  const startDate = shallowRef<CalendarDate>(initialStart())
  const endDate = computed(() => {
    const d = { ...duration.value }
    if (d.days) d.days--
    else d.days = -1
    return startDate.value.add(d)
  })
  // React Aria realigns when the duration or the display calendar changes, and pages the range to keep the
  // focused date visible.
  watch([() => JSON.stringify(duration.value), displayCalendar], () => {
    startDate.value = initialStart()
  })
  watch(
    focusedDate,
    (focused) => {
      if (focused.compare(startDate.value) < 0)
        startDate.value = alignEnd(focused, duration.value, options.locale(), min(), max())
      else if (focused.compare(endDate.value) > 0)
        startDate.value = alignStart(focused, duration.value, options.locale(), min(), max())
    },
    { flush: 'sync' },
  )

  const pageDuration = computed(() =>
    options.pageBehavior() === 'visible' ? duration.value : unitDuration(duration.value),
  )
  function nextPage() {
    const start = startDate.value.add(pageDuration.value)
    const focused = focusedDate.value
    startDate.value = alignStart(
      constrainStart(focused, start, pageDuration.value, options.locale(), min(), max()),
      pageDuration.value,
      options.locale(),
    )
    focusedDate.value = constrainValue(focused.add(pageDuration.value), min(), max())
  }
  function prevPage() {
    const start = startDate.value.subtract(pageDuration.value)
    const focused = focusedDate.value
    startDate.value = alignStart(
      constrainStart(focused, start, pageDuration.value, options.locale(), min(), max()),
      pageDuration.value,
      options.locale(),
    )
    focusedDate.value = constrainValue(focused.subtract(pageDuration.value), min(), max())
  }

  const isInvalid = (date: DateValue) => isOutOfRange(date, min(), max())
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
    const short = d != null && d < 7
    const first = short
      ? startDate.value
      : startOfWeek(startDate.value, options.locale(), options.firstDayOfWeek())
    return Array.from({ length: short ? d! : 7 }, (_, i) =>
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
  const gridRef = ref<HTMLElement>()
  function focusCell(date: CalendarDate) {
    focusedDate.value = date
    nextTick(() => {
      if (!gridRef.value?.contains(document.activeElement)) return
      gridRef.value
        .querySelector<HTMLElement>(`[data-value="${focusedDate.value.toString()}"]`)
        ?.focus()
    })
  }
  function onKeyDown(
    event: KeyboardEvent,
    handlers: { select: (date: CalendarDate) => void; escape?: () => void },
    dir: 'ltr' | 'rtl' = 'ltr',
  ) {
    const focused = focusedDate.value
    const d = duration.value
    const unit = unitDuration(d)
    const rtl = dir === 'rtl'
    switch (event.key) {
      case 'ArrowLeft':
        focusCell(rtl ? focused.add({ days: 1 }) : focused.subtract({ days: 1 }))
        break
      case 'ArrowRight':
        focusCell(rtl ? focused.subtract({ days: 1 }) : focused.add({ days: 1 }))
        break
      case 'ArrowUp':
        if (d.days) prevPageAndFocus()
        else focusCell(focused.subtract({ weeks: 1 }))
        break
      case 'ArrowDown':
        if (d.days) nextPageAndFocus()
        else focusCell(focused.add({ weeks: 1 }))
        break
      case 'Home':
        focusCell(d.days ? startDate.value : startOfWeek(focused, options.locale()))
        break
      case 'End':
        focusCell(d.days ? endDate.value : startOfWeek(focused, options.locale()).add({ days: 6 }))
        break
      case 'PageUp':
        if (d.days) prevPageAndFocus()
        else focusCell(event.shiftKey ? focused.subtract({ months: 1 }) : focused.subtract(unit))
        break
      case 'PageDown':
        if (d.days) nextPageAndFocus()
        else focusCell(event.shiftKey ? focused.add({ months: 1 }) : focused.add(unit))
        break
      case 'Enter':
      case ' ':
        handlers.select(focused)
        break
      case 'Escape':
        if (!handlers.escape) return
        handlers.escape()
        return
      default:
        return
    }
    event.preventDefault()
  }
  function nextPageAndFocus() {
    nextPage()
    focusCell(focusedDate.value)
  }
  function prevPageAndFocus() {
    prevPage()
    focusCell(focusedDate.value)
  }

  return {
    startDate,
    endDate,
    focusedDate,
    rows,
    weekDays,
    heading,
    rangeLabel,
    gridRef,
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
