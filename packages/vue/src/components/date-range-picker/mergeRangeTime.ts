import type { DateValue } from '@internationalized/date'
import { toCalendarDateTime } from '@internationalized/date'

import type { DateRange } from '@/components/range-calendar/RangeCalendar.types'

import type { DateRangePickerProps, DateRangeValue } from './DateRangePicker.types'

type MergeRangeTimeOptions = {
  /** What the field currently holds (possibly a partial range). */
  current: DateRange
  granularity: DateRangePickerProps['granularity']
}

const TIME_GRANULARITIES = new Set(['hour', 'minute', 'second'])

const withTime = (
  date: DateValue,
  options: { current?: DateValue; hasTime: boolean },
): DateValue => {
  const { current, hasTime } = options

  // Keep the field's time of day, moving it to the picked date.
  if (current && 'hour' in current) {
    return current.set({ era: date.era, year: date.year, month: date.month, day: date.day })
  }

  // The field shows time segments but holds no value yet: start at midnight.
  if (hasTime && !('hour' in date)) return toCalendarDateTime(date)

  return date
}

/**
 * React Aria's `useDateRangePickerState`: picking dates in the calendar keeps the time of day already in
 * the field, and falls back to midnight when the field shows time segments but holds no value yet.
 */
export const mergeRangeTime = (
  picked: DateRangeValue,
  options: MergeRangeTimeOptions,
): DateRangeValue => {
  const { current, granularity } = options
  const hasTime = granularity !== undefined && TIME_GRANULARITIES.has(granularity)

  return {
    start: withTime(picked.start, { current: current.start, hasTime }),
    end: withTime(picked.end, { current: current.end, hasTime }),
  }
}
