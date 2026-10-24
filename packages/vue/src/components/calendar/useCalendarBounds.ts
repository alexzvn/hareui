import { CalendarDate } from '@internationalized/date'
import type { WeekStartsOn } from 'reka-ui/date'

// HeroUI defaults Calendar/RangeCalendar bounds to 1900-01-01..2099-12-31 (Gregorian) when the
// consumer passes none, giving the year picker a sane default range.
export function defaultMinValue(): CalendarDate {
  return new CalendarDate(1900, 1, 1)
}

export function defaultMaxValue(): CalendarDate {
  return new CalendarDate(2099, 12, 31)
}

const DAY_INDEX: Record<string, WeekStartsOn> = {
  sun: 0,
  mon: 1,
  tue: 2,
  wed: 3,
  thu: 4,
  fri: 5,
  sat: 6,
}

/** Maps HeroUI's day-name `firstDayOfWeek` prop to Reka's numeric `weekStartsOn`. */
export function weekStartsOnFromFirstDay(
  firstDayOfWeek: string | undefined,
): WeekStartsOn | undefined {
  if (!firstDayOfWeek) return undefined
  return DAY_INDEX[firstDayOfWeek]
}
