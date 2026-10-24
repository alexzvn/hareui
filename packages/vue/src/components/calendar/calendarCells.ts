import type { DateValue } from '@internationalized/date'
import { parseDate, toCalendarDate } from '@internationalized/date'

/** Day-level comparison that tolerates mixed `CalendarDate`/`CalendarDateTime`/`ZonedDateTime` values. */
export const compareDay = (a: DateValue, b: DateValue): number =>
  toCalendarDate(a).compare(toCalendarDate(b))

/** The Reka cell trigger an event happened on, when it belongs to this calendar's month grid. */
export const calendarCellFrom = (
  target: EventTarget | null,
  root: HTMLElement | undefined,
): HTMLElement | null => {
  const el = (target as Element | null)?.closest?.<HTMLElement>('[data-reka-calendar-cell-trigger]')
  return el && root?.contains(el) ? el : null
}

/** A cell's date (from its ISO `data-value`) in the calendar system and value type of `like`. */
export const calendarCellDate = (el: HTMLElement, like: DateValue): DateValue => {
  const iso = el.getAttribute('data-value')!.slice(0, 10)
  return like.add({ days: parseDate(iso).compare(toCalendarDate(like)) })
}

/** Focuses the in-month cell trigger of `date`, if the grid shows it. */
export const focusCalendarCell = (root: HTMLElement | undefined, date: DateValue): void => {
  root
    ?.querySelector<HTMLElement>(
      `[data-reka-calendar-cell-trigger][data-value='${date.toString()}']:not([data-outside-view])`,
    )
    ?.focus()
}
