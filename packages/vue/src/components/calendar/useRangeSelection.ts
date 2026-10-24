import type { DateDuration, DateValue } from '@internationalized/date'
import type { ComputedRef, ShallowRef } from 'vue'
import { computed, shallowRef } from 'vue'

import { compareDay } from './calendarCells'

/**
 * The DOM-free core of react-stately's `useRangeCalendarState`, shared by RangeCalendar's month view and
 * `CalendarDurationView`: anchor → preview → commit, Escape cancel, the available run around the anchor and the
 * min/max window derived from it. Each view keeps its own pointer/keyboard/focus layer on top.
 */

export type DayRange<T extends DateValue = DateValue> = {
  start: T
  end: T
}

/** Orders two picks into a range, whichever was picked first. */
export const makeRange = <T extends DateValue>(a: T, b: T): DayRange<T> => {
  return compareDay(a, b) <= 0 ? { start: a, end: b } : { start: b, end: a }
}

/** How the available run around an anchor is searched: the consumer matcher and the search distance. */
export type RunSearch<T extends DateValue = DateValue> = {
  isUnavailable: (date: T) => boolean
  /** How far from the anchor to look for an unavailable day (react-stately: the visible duration). */
  span: DateDuration
}

/**
 * One edge of react-stately's `getAvailableRange`: the last available day before the first unavailable one in
 * direction `dir`, or `undefined` when no unavailable day is found within `span` of `from`.
 */
export const edgeOfAvailableRun = <T extends DateValue>(
  from: T,
  search: RunSearch<T> & { dir: 1 | -1 },
): T | undefined => {
  const { dir, isUnavailable, span } = search
  const limit = (dir < 0 ? from.subtract(span) : from.add(span)) as T
  let next = from.add({ days: dir }) as T
  while (
    (dir < 0 ? compareDay(next, limit) >= 0 : compareDay(next, limit) <= 0) &&
    !isUnavailable(next)
  )
    next = next.add({ days: dir }) as T

  return isUnavailable(next) ? (next.add({ days: -dir }) as T) : undefined
}

/** The run of available days around `anchor`; either side is `undefined` when unbounded within `span`. */
export const availableRun = <T extends DateValue>(
  anchor: T,
  search: RunSearch<T>,
): { start?: T; end?: T } => {
  return {
    start: edgeOfAvailableRun(anchor, { ...search, dir: -1 }),
    end: edgeOfAvailableRun(anchor, { ...search, dir: 1 }),
  }
}

/** Narrows `[min, max]` to the available run (the tighter bound wins on each side). */
export const boundsWithinRun = (
  bounds: { min: DateValue; max: DateValue },
  run: { start?: DateValue; end?: DateValue } | null,
): { min: DateValue; max: DateValue } => {
  const { min, max } = bounds

  return {
    min: run?.start && compareDay(run.start, min) > 0 ? run.start : min,
    max: run?.end && compareDay(run.end, max) < 0 ? run.end : max,
  }
}

/**
 * Reka's `maximumDays`: while anchored, days `maximumDays` or more away from the anchor (either side) are disabled.
 * `0`/`undefined` means no limit.
 */
export const exceedsMaximumDays = (
  date: DateValue,
  limit: { anchor: DateValue | null; maximumDays: number | undefined },
): boolean => {
  const { anchor, maximumDays } = limit

  return !!maximumDays && !!anchor && Math.abs(compareDay(date, anchor)) >= maximumDays
}

/**
 * `useCalendarCell`'s selected rule: a day inside the highlighted range is never selected when disabled, and an
 * unavailable day only when the range is invalid (so an invalid committed range stays visibly selected end to end).
 */
export const isDaySelectedInRange = (state: {
  inRange: boolean
  disabled: boolean
  unavailable: boolean
  invalid: boolean
}): boolean => {
  return state.inRange && !state.disabled && (state.invalid || !state.unavailable)
}

export type UseRangeSelectionOptions<T extends DateValue = DateValue> = {
  /** Consumer matcher; receives the current anchor (React Aria's 2-arg `isDateUnavailable`). */
  isDateUnavailable: () => ((date: DateValue, anchorDate: DateValue | null) => boolean) | undefined
  allowNonContiguousRanges: () => boolean | undefined
  minValue: () => DateValue
  maxValue: () => DateValue
  /** How far from the anchor the available run is searched (react-stately: the visible duration). */
  span: () => DateDuration
  maximumDays?: () => number | undefined
  /** Whether range selection is active at all (the shared duration view also serves single selection). */
  enabled?: () => boolean
  /**
   * Called when the first pick anchors a selection. The month view emits a half-open `{ start, end: undefined }`
   * here (as Reka did); the duration view emits nothing until commit.
   */
  onAnchor?: (date: T) => void
  /** Called with the ordered range when the second pick commits. */
  onCommit: (range: DayRange<T>) => void
}

export type RangeSelection<T extends DateValue = DateValue> = {
  /** react-stately's `anchorDate`: the first pick of an in-progress selection, `null` otherwise. */
  anchor: ShallowRef<T | null>
  /** The consumer matcher bound to the current anchor, or `undefined` without one. */
  isUnavailable: ComputedRef<((date: DateValue) => boolean) | undefined>
  /** The selectable window while anchored (min/max narrowed to the available run). */
  effectiveMin: ComputedRef<DateValue>
  effectiveMax: ComputedRef<DateValue>
  /** Outside the effective window or beyond `maximumDays` from the anchor. */
  isOutsideWindow: (date: DateValue) => boolean
  /** First pick anchors, second commits the ordered range. */
  select: (date: T) => void
  /** Escape: drops an in-progress anchor. Returns whether there was one. */
  cancel: () => boolean
}

export const useRangeSelection = <T extends DateValue = DateValue>(
  options: UseRangeSelectionOptions<T>,
): RangeSelection<T> => {
  // `shallowRef<T | null>` returns a conditional type that stays deferred (and distributes) for a generic `T`, so
  // the ref is typed through its declared shape instead.
  const anchor = shallowRef<T | null>(null) as ShallowRef<T | null>
  const enabled = () => options.enabled?.() ?? true

  // Reka's `Matcher` (and our cell code) is single-argument, so the consumer's 2-arg callback is wrapped, reading the
  // anchor at call time.
  const isUnavailable = computed(() => {
    const matcher = options.isDateUnavailable()
    return matcher ? (date: DateValue) => matcher(date, anchor.value) : undefined
  })

  // react-stately's `getAvailableRange`: while anchored (and non-contiguous ranges are off), the selectable window
  // shrinks to the run of available days around the anchor, which also disables paging past it.
  const run = computed(() => {
    const from = anchor.value
    const matcher = isUnavailable.value
    if (!enabled() || !from || !matcher || options.allowNonContiguousRanges()) return null

    return availableRun(from, { isUnavailable: matcher, span: options.span() })
  })

  const bounds = computed(() =>
    boundsWithinRun({ min: options.minValue(), max: options.maxValue() }, run.value),
  )

  const effectiveMin = computed(() => bounds.value.min)
  const effectiveMax = computed(() => bounds.value.max)

  const isOutsideWindow = (date: DateValue) => {
    return (
      compareDay(date, effectiveMin.value) < 0 ||
      compareDay(date, effectiveMax.value) > 0 ||
      exceedsMaximumDays(date, { anchor: anchor.value, maximumDays: options.maximumDays?.() })
    )
  }

  const select = (date: T) => {
    if (!anchor.value) {
      anchor.value = date
      options.onAnchor?.(date)

      return
    }

    const range = makeRange(anchor.value, date)
    anchor.value = null
    options.onCommit(range)
  }

  const cancel = () => {
    if (!anchor.value) return false
    anchor.value = null

    return true
  }

  return { anchor, isUnavailable, effectiveMin, effectiveMax, isOutsideWindow, select, cancel }
}
